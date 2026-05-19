const tools = [
  ['🚚🔎','VIN LOOKUP','Decode VIN, ESN, CPL & more'],
  ['⚙️📦','OEM PARTS','OEM parts lookup, diagrams & cross refs'],
  ['🩺','DIESEL DOCTOR','AI powered fault diagnostics'],
  ['🖥️🔧','REPAIR HUD','Step-by-step repair guidance'],
  ['🧾💵','SMART QUOTES','Create estimates & quotes'],
  ['📋','WORK ORDERS','Create, manage & track jobs'],
  ['🧾','INVOICES','Create invoices & send'],
  ['⏱️','JOB CLOCK','Track time, jobs & labor'],
  ['📷','VISION / OCR','Scan codes, parts & documents'],
  ['📍','DOT / GPS','GPS, routes, ELD, logs & location'],
  ['🧠','REPAIR MEMORY','Saved repairs, history & notes'],
  ['🤝','SUPPLIERS','Parts suppliers & contacts'],
  ['🤖','AI ASSISTANT','Ask AI for help & advice'],
  ['📊','REPORTS','Analytics & performance'],
  ['⚙️','SETTINGS','App settings & preferences']
];

const grid = document.getElementById('toolGrid');
tools.forEach(([emoji,label,sub])=>{
  const btn = document.createElement('button');
  btn.className = 'tool';
  btn.innerHTML = `<div class="emoji">${emoji}</div><b>${label}</b><span>${sub}</span>`;
  btn.onclick = () => openModule(label, sub);
  grid.appendChild(btn);
});

const homeView = document.getElementById('homeView');
const moduleView = document.getElementById('moduleView');
const moduleTitle = document.getElementById('moduleTitle');
const moduleSubtitle = document.getElementById('moduleSubtitle');
const moduleOutput = document.getElementById('moduleOutput');

function setNavActive(name){
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.remove('active'));
  if(name === 'home') document.querySelector('[data-nav="home"]').classList.add('active');
}

function openHome(){
  homeView.classList.add('active');
  moduleView.classList.remove('active');
  setNavActive('home');
}

function openModule(title, subtitle='Working module shell connected to the tactical dashboard.'){
  homeView.classList.remove('active');
  moduleView.classList.add('active');
  moduleTitle.textContent = title;
  moduleSubtitle.textContent = subtitle;
  moduleOutput.textContent = `${title} ready.\n\nThis GitHub Pages build is wired for the frontend shell. Connect this button to your existing backend/Supabase/API function for live data.`;
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.remove('active'));
  window.scrollTo({top:0,behavior:'smooth'});
}

document.getElementById('backBtn').onclick = openHome;
document.querySelector('[data-nav="home"]').onclick = openHome;
document.querySelectorAll('[data-module]').forEach(btn=>{
  btn.onclick = () => openModule(btn.dataset.module);
});

document.getElementById('moduleRun').onclick = () => {
  const val = document.getElementById('moduleInput').value.trim();
  moduleOutput.textContent = val
    ? `Input received:\n${val}\n\nNext step: connect this to your Rolling Wrench AI lookup function.`
    : 'Type something first.';
};

let seconds = 2*3600 + 47*60 + 33;
let clocked = true;
const timer = document.getElementById('clockTimer');
const earnings = document.getElementById('earningsToday');
const clockToggle = document.getElementById('clockToggle');
const clockStatus = document.getElementById('clockStatus');
const rollingState = document.getElementById('rollingState');

function fmt(s){
  const h=String(Math.floor(s/3600)).padStart(2,'0');
  const m=String(Math.floor((s%3600)/60)).padStart(2,'0');
  const sec=String(s%60).padStart(2,'0');
  return `${h}:${m}:${sec}`;
}
setInterval(()=>{
  if(!clocked) return;
  seconds++;
  timer.textContent = fmt(seconds);
  const money = 250 + (seconds/3600)*135;
  earnings.textContent = '$' + money.toFixed(2);
},1000);

clockToggle.onclick = () => {
  clocked = !clocked;
  clockToggle.textContent = clocked ? 'CLOCK OUT' : 'CLOCK IN';
  clockStatus.textContent = clocked ? 'ON THE CLOCK' : 'CLOCKED OUT';
  rollingState.textContent = clocked ? 'Rolling' : 'Stopped';
};

document.getElementById('masterSearch').addEventListener('keydown', e=>{
  if(e.key === 'Enter'){
    openModule('MASTER SEARCH', `Searching for: ${e.target.value}`);
  }
});
