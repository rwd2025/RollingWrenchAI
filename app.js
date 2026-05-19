const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const truckSVG = `
<svg class="truck-svg" viewBox="0 0 640 320" role="img" aria-label="Black Freightliner truck illustration">
  <defs>
    <linearGradient id="cab" x1="0" x2="1"><stop offset="0" stop-color="#0b0f14"/><stop offset=".52" stop-color="#27313e"/><stop offset="1" stop-color="#05070a"/></linearGradient>
    <linearGradient id="orange" x1="0" x2="1"><stop offset="0" stop-color="#ff6a16"/><stop offset="1" stop-color="#ffb15c"/></linearGradient>
  </defs>
  <ellipse cx="315" cy="270" rx="260" ry="30" fill="rgba(0,0,0,.55)"/>
  <path d="M95 208 L122 110 Q132 75 175 70 L360 62 Q395 61 420 87 L492 164 L560 178 Q590 184 596 212 L598 238 L86 238 Q84 222 95 208Z" fill="url(#cab)" stroke="#5d6876" stroke-width="4"/>
  <path d="M148 104 L268 94 L255 158 L125 166 L140 118 Q143 108 148 104Z" fill="#05080d" stroke="#7c8999" stroke-width="3"/>
  <path d="M282 93 L355 91 Q375 91 389 108 L435 164 L275 160Z" fill="#060a10" stroke="#7c8999" stroke-width="3"/>
  <path d="M108 184 Q152 171 222 175 L560 190" stroke="#ff6a16" stroke-width="5" opacity=".85"/>
  <rect x="420" y="132" width="42" height="42" rx="8" fill="#0c1118" stroke="#6b7685"/>
  <rect x="178" y="79" width="12" height="11" rx="4" fill="url(#orange)"/><rect x="220" y="76" width="12" height="11" rx="4" fill="url(#orange)"/><rect x="328" y="76" width="12" height="11" rx="4" fill="url(#orange)"/>
  <circle cx="184" cy="239" r="44" fill="#05070a" stroke="#708090" stroke-width="10"/><circle cx="184" cy="239" r="22" fill="#242d37"/>
  <circle cx="452" cy="239" r="44" fill="#05070a" stroke="#708090" stroke-width="10"/><circle cx="452" cy="239" r="22" fill="#242d37"/>
  <path d="M80 213 L132 205" stroke="#f6f8fb" stroke-width="8" opacity=".7"/><path d="M510 178 L574 190" stroke="#ffb15c" stroke-width="8" opacity=".95"/>
</svg>`;

const modules = [
  ['🚚','VIN LOOKUP','Decode VIN, ESN, CPL & more','doctor'],['⚙️','OEM PARTS','Search OEM parts & diagrams','parts'],['🩺','FAULT DOCTOR','AI powered fault diagnostics','doctor'],['🖥️','REPAIR HUD','Step-by-step repair guidance','repair'],['🧾','SMART QUOTES','Create quotes & estimates','repair'],['📋','WORK ORDERS','Create, manage & track jobs','repair'],['💵','INVOICES','Create invoices & send','repair'],['🕒','TIME CLOCK','Track time, jobs & labor','home'],['📷','CAMERA / OCR','Scan codes, parts & documents','more'],['📍','DOT / GPS','GPS, routes, ELD & location','more'],['🧠','REPAIR MEMORY','Saved repairs, history & notes','repair'],['🤝','SUPPLIERS','Parts suppliers & contacts','parts'],['🤖','AI ASSISTANT','Ask AI for help & advice','doctor'],['📊','REPORTS','Analytics & performance','more'],['⚙️','SETTINGS','App settings & preferences','settings']
];

function home(){
  return `
  <section class="grid hero-grid">
    <article class="card glass-panel"><h2>TIME CLOCK</h2><p class="green">● ON THE CLOCK</p><div class="big-number">02:47:33</div><p class="muted">Today's Earnings</p><div class="big-number green">$642.75</div><p class="green">Rolling</p><button class="btn" data-action="clock">CLOCK OUT</button></article>
    <article class="card glass-panel truck-card"><div class="truck-art">${truckSVG}</div><div><h3>ACTIVE TRUCK</h3><p class="truck-title">2020 Freightliner Cascadia 126</p><div class="truck-info"><div class="kv"><small>VIN</small><strong>1XP4D49X8KD123456</strong></div><div class="kv"><small>ENGINE</small><strong>CUMMINS X15</strong></div><div class="kv"><small>ESN</small><strong>79876123</strong></div><div class="kv"><small>CPL</small><strong>4342</strong></div></div><br><button class="btn">TRUCK PROFILE</button></div></article>
    <article class="card glass-panel"><h2>SYSTEM STATUS</h2><div class="gauge"><div class="gauge-ring"><div class="gauge-core"><div><b>98%</b><br><span class="muted">HEALTH</span></div></div></div></div><p class="green">All Systems Normal ✓</p><button class="btn">VIEW DETAILS</button></article>
  </section>
  <section class="searchbar glass-panel"><span>⌕</span><div><strong>MASTER SEARCH</strong><input placeholder="Search VIN, Part #, Symptoms, Fault Codes, Repairs..." /></div><button class="btn">SEARCH</button></section>
  <section class="grid module-grid">${modules.map(m=>`<button class="module" data-route="${m[3]}"><span class="ico">${m[0]}</span><strong>${m[1]}</strong><small>${m[2]}</small></button>`).join('')}</section>
  <section class="grid info-grid">
    <article class="card glass-panel"><h3>TOP FAULTS TODAY</h3>${['P2009 — DPF Differential Pressure','SPN 157 — EGR Position Sensor','SPN 111 FMI 5 — Coolant Temp High','U0101 — Lost Comm w/ ECM'].map((x,i)=>`<div class="list-row"><span>${x}</span><b class="pill">${4-i}</b></div>`).join('')}</article>
    <article class="card glass-panel"><h3>RECENT WORK ORDERS</h3>${['WO-10045 — DPF Cleaning','WO-10044 — EGR Valve Replacement','WO-10043 — Coolant Temp Sensor','WO-10042 — Air Leak Inspection'].map((x,i)=>`<div class="list-row"><span>${x}</span><b class="${i?'green':'orange'}">${i?'COMPLETE':'IN PROGRESS'}</b></div>`).join('')}</article>
    <article class="card glass-panel"><h3>EARNINGS SUMMARY</h3><div class="big-number green">$3,842.50</div><p class="muted">This week</p><div class="wave"></div><br><button class="btn">VIEW REPORTS</button></article>
  </section>
  <section class="system-row">${['⚙️ GATEWAY CONNECTED','🧠 AI SYSTEM ONLINE','☁️ SUPABASE SYNCED','Bluetooth CONNECTED','📍 ELD / GPS ACTIVE'].map(t=>`<div class="system-tile"><span class="dot live"></span><b>${t}</b></div>`).join('')}</section>`;
}

function scanner(){
 return `<h2 class="page-title">Scanner / Elite Diagnostics Shell</h2><section class="scanner-layout"><aside class="side-menu glass-panel card">${['Dashboard','Diesel Doctor','9-Pin Scanner','Live Data','Fault Codes','ABS / Wheel Speed','Forced Regen','ECM Programming','Wiring / Schematics','Manuals / OCR','Settings'].map((x,i)=>`<button class="${i===2?'orange':''}">${x}</button>`).join('')}</aside><div class="diag-panel"><article class="card glass-panel"><h3>9-PIN BLUETOOTH SCANNER</h3><p><b class="green">Connected</b> · RP1210 · J1939 · CAN Active</p><div class="diag-grid">${['Live Data','Fault Codes','Freeze Frame','I/M Readiness','SPN / FMI','Battery Voltage','VIN Auto-Detect','Data Record'].map(x=>`<button class="diag-btn">${x}</button>`).join('')}</div></article><article class="card glass-panel"><h3>ABS / WHEEL SPEED MONITOR</h3><div class="list-row"><span>Steer Axle</span><b class="green">OK</b></div><div class="list-row"><span>Drive Axle 1 Right</span><b class="red">FAULT</b></div><div class="list-row"><span>Drive Axle 2</span><b class="green">OK</b></div></article><article class="card glass-panel"><h3>FORCED REGEN</h3><p>Soot Load: <b>52%</b> · Ash Load: <b>18%</b> · Status: <b class="orange">Not Active</b></p><button class="btn fill">START FORCED REGEN</button></article></div><aside class="right-rail"><div class="quick-card"><b>Rolling Wrench AI Chat</b><p class="muted">Phase 1 shell only. Backend hooks come later.</p></div><div class="quick-card"><b>Quick Actions</b><p>Master ECM Programming<br>Clear Faults<br>System Scan</p></div></aside></section>`
}

function simple(title, text){return `<article class="card glass-panel"><h2 class="page-title">${title}</h2><p class="muted">${text}</p><br><button class="btn" data-route="home">BACK HOME</button></article>`}
const routes = {home, scan:scanner, doctor:()=>simple('Rolling Wrench AI Doctor','Phase 1 page shell for fault lookup, symptom ranking, and repair guidance.'), parts:()=>simple('OEM Parts','Phase 1 page shell for parts search, cross references, kits, and diagrams.'), repair:()=>simple('Repair Workflow','Phase 1 page shell for work orders, procedures, invoices, and repair memory.'), more:()=>simple('More Tools','Phase 1 page shell for reports, GPS, camera OCR, suppliers, and settings.'), ecm:()=>simple('ECM Programming','Phase 1 page shell for ECM backup, parameters, programming guide, and validation.'), settings:()=>simple('Settings','Phase 1 settings shell for theme, rates, shop profile, and system connections.')};

function route(name='home'){$('#view').innerHTML=(routes[name]||routes.home)();$$('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===name));$('#drawer').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});}
document.addEventListener('click',e=>{const r=e.target.closest('[data-route]')?.dataset.route;if(r) route(r);const a=e.target.closest('[data-action]')?.dataset.action;if(a==='openMenu') $('#drawer').classList.add('open'); if(a==='closeMenu') $('#drawer').classList.remove('open'); if(a==='notify') alert('Notifications shell: 3 open alerts.'); if(a==='clock') alert('Time Clock shell: Phase 2 will save live sessions and earnings.');});
route('home');
