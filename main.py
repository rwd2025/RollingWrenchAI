import asyncio
import json
import os
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

try:
    from database import query_supabase_history, query_neo4j_context
except Exception:
    async def query_supabase_history(vin: str, spn: int, fmi: int):
        return []
    async def query_neo4j_context(spn: int):
        return {"location": "Unknown", "harness_nodes": []}

app = FastAPI(title="Diesel Doctor Stabilized Gateway Core")

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama_ai:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

class FaultPacket(BaseModel):
    vin: str
    spn: int
    fmi: int

class AsyncDiagnosticPipeline:
    def __init__(self):
        self.queue: asyncio.Queue = asyncio.Queue()
        self.worker_task = None
        self.broadcast = None

    def start(self, websocket_broadcast_callback):
        self.broadcast = websocket_broadcast_callback
        self.worker_task = asyncio.create_task(self._pipeline_processor_loop())

    async def submit_fault_to_pipeline(self, fault: FaultPacket):
        await self.queue.put(fault)

    async def _pipeline_processor_loop(self):
        import httpx
        async with httpx.AsyncClient(timeout=60.0) as client:
            while True:
                fault: FaultPacket = await self.queue.get()
                try:
                    neo4j_data = await query_neo4j_context(fault.spn)
                    supabase_history = await query_supabase_history(fault.vin, fault.spn, fault.fmi)
                    prompt = self._assemble_vin_aware_prompt(fault, neo4j_data, supabase_history)
                    report_payload = None
                    try:
                        response = await client.post(OLLAMA_URL, json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "format": "json"})
                        if response.status_code == 200:
                            raw = response.json().get("response", "{}")
                            try:
                                report_payload = json.loads(raw)
                            except Exception:
                                report_payload = {"suspected_root_cause": raw, "test_procedure": [], "expected_values": []}
                    except Exception as ai_error:
                        report_payload = {"suspected_root_cause": f"AI offline or unavailable: {ai_error}", "test_procedure": ["Verify gateway connection", "Verify Ollama container is running"], "expected_values": []}
                    if self.broadcast and report_payload:
                        await self.broadcast({"type": "AI_DIAGNOSTIC_REPORT", "payload": {"spn": fault.spn, "fmi": fault.fmi, "report": report_payload}})
                except Exception as e:
                    print(f"Pipeline processing drop error: {e}")
                finally:
                    self.queue.task_done()

    def _assemble_vin_aware_prompt(self, fault: FaultPacket, graph: dict, history: List[dict]) -> str:
        history_str = "\n".join([f"- Fix: {h.get('fix') or h.get('confirmed_fix', 'Unknown')} (Labor: {h.get('hours') or h.get('labor_time_hours', 'N/A')}h)" for h in history]) if history else "None"
        return f"""
You are Diesel Doctor AI, an expert heavy-duty diesel diagnostic assistant.
Return ONLY valid JSON with exactly these keys: suspected_root_cause, test_procedure, expected_values.
Vehicle VIN: {fault.vin}
Fault: SPN {fault.spn} FMI {fault.fmi}
Neo4j location: {graph.get('location')}
Harness nodes: {graph.get('harness_nodes')}
Repair history:
{history_str}
Create a professional field troubleshooting plan. Do not guess exact parts without VIN/ESN/OEM verification.
"""

ai_pipeline = AsyncDiagnosticPipeline()
active_connections: List[WebSocket] = []

async def broadcast_to_frontend(message: dict):
    dead_connections = []
    for ws in list(active_connections):
        try:
            await ws.send_json(message)
        except Exception:
            dead_connections.append(ws)
    for ws in dead_connections:
        if ws in active_connections:
            active_connections.remove(ws)

@app.on_event("startup")
async def startup_event():
    ai_pipeline.start(broadcast_to_frontend)

@app.get("/health")
async def health():
    return {"ok": True, "service": "diesel-doctor-api"}

@app.websocket("/ws/j1939")
async def j1939_socket_handler(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    await websocket.send_json({"type": "VEHICLE_HANDSHAKE", "payload": {"vin": "1FUJA6CVXJLXXXXXX", "make": "Detroit", "model": "DD15", "esn": "472901SXXXXXX"}})
    try:
        while True:
            raw_data = await websocket.receive_text()
            packet_data = json.loads(raw_data)
            pgn = packet_data.get("pgn")
            if pgn == 65226:
                incoming_faults = packet_data.get("payload", {}).get("faults", [])
                await websocket.send_json({"type": "DM1_BROADCAST", "payload": incoming_faults})
                for f in incoming_faults:
                    fault_payload = FaultPacket(vin=packet_data.get("vin", "UNKNOWN"), spn=f["spn"], fmi=f["fmi"])
                    await ai_pipeline.submit_fault_to_pipeline(fault_payload)
            elif pgn in [61444, 65263, 65270]:
                await websocket.send_json({"type": "TELEMETRY", "payload": packet_data.get("payload", {})})
    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)
