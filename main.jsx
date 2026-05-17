import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useAppState } from './store/useAppState';
import './style.css';

function GaugeCard({ title, value, unit, tone }) {
  const display = Number.isFinite(Number(value)) ? Number(value).toFixed(0) : '0';
  return <div className="gauge"><span>{title}</span><b className={tone}>{display}</b><small>{unit}</small></div>;
}

function FaultTerminal() {
  const faults = useAppState(s => s.activeFaults);
  return <section className="panel"><h2>Active J1939 DM1 Monitor</h2>{faults.length===0 ? <p className="muted">No active trouble codes detected.</p> : <div className="faults">{faults.map((f,i)=><div className={f.status==='ACTIVE'?'fault active':'fault'} key={`${f.spn}-${f.fmi}-${i}`}><b>SPN {f.spn}</b><span>FMI {f.fmi}</span><em>{f.status}</em></div>)}</div>}</section>;
}

function AiReport() {
  const report = useAppState(s => s.latestAiReport);
  if (!report) return <section className="panel"><h2>RAG Mechanic Assistant</h2><p className="muted">Waiting for DM1 fault to generate AI diagnostic report.</p></section>;
  const r = report.report || {};
  return <section className="panel ai"><h2>AI Diagnostic Report</h2><div className="faultline">SPN {report.spn} / FMI {report.fmi}</div><h3>Suspected Root Cause</h3><p>{r.suspected_root_cause || 'Report received.'}</p><h3>Test Procedure</h3><pre>{Array.isArray(r.test_procedure) ? r.test_procedure.join('\n') : JSON.stringify(r.test_procedure || r, null, 2)}</pre><h3>Expected Values</h3><pre>{Array.isArray(r.expected_values) ? r.expected_values.join('\n') : JSON.stringify(r.expected_values || {}, null, 2)}</pre></section>;
}

function App(){
  const connect = useAppState(s=>s.connectDataBus);
  const connected = useAppState(s=>s.isWsConnected);
  const truck = useAppState(s=>s.activeTruck);
  const t = useAppState(s=>s.telemetry);
  const offline = useAppState(s=>s.userSettings.offlineMode);
  const setOffline = useAppState(s=>s.setOfflineMode);
  useEffect(()=>{ connect(import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/j1939'); },[connect]);
  return <main><header><div><h1>DIESEL DOCTOR NETWORK</h1><p>{truck.vin || 'WAITING FOR J1939 LINK'} {truck.model ? `• ${truck.make || ''} ${truck.model}` : ''}</p></div><div className={connected?'status on':'status'}>{connected?'CONNECTED':'OFFLINE'}</div></header><div className="toolbar"><button onClick={()=>setOffline(!offline)}>Offline Mode: {offline?'ON':'OFF'}</button></div><section className="grid"><GaugeCard title="Engine Speed" value={t.engine_rpm} unit="RPM" tone="green"/><GaugeCard title="Turbo Boost" value={t.boost_pressure} unit="PSI" tone="cyan"/><GaugeCard title="Coolant Temp" value={t.coolant_temp} unit="°F" tone="orange"/><GaugeCard title="Oil Temp" value={t.oil_temp} unit="°F" tone="red"/></section><FaultTerminal/><AiReport/></main>
}

createRoot(document.getElementById('root')).render(<App/>);
