# Diesel Doctor App Build

Includes:
- React + Vite frontend
- Zustand persisted global store
- J1939 WebSocket live telemetry state
- DM1 fault lifecycle
- AI diagnostic report panel
- FastAPI backend WebSocket gateway
- Docker compose starter

Run backend:
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Run frontend:
```bash
cd frontend
npm install
npm run dev
```

Open:
http://localhost:3000

WebSocket:
ws://localhost:8000/ws/j1939
