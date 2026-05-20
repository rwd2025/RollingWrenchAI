const modules = [
  ['🚛','VIN LOOKUP','Decode VIN, ESN, CPL & more'],['⚙️📦','OEM PARTS','Search OEM parts & diagrams'],['🩺','FAULT DOCTOR','AI powered fault diagnostics'],['🖥️','REPAIR HUD','Step-by-step repair guidance'],['🧾','SMART QUOTES','Create quotes & estimates'],['📋','WORK ORDERS','Create, manage & track jobs'],['📄','INVOICES','Create invoices & send'],['🕘','TIME CLOCK','Track time, jobs & labor'],['📷','CAMERA / OCR','Scan codes, parts & documents'],['📍','DOT / GPS','GPS, routes, ELD & location'],['🧠','REPAIR MEMORY','Saved repairs, history & notes'],['🤝','SUPPLIERS','Parts suppliers & contacts'],['🤖','AI ASSISTANT','Ask AI for help & advice'],['📊','REPORTS','Analytics & performance'],['⚙️','SETTINGS','App settings & preferences']
];
const grid = document.getElementById('moduleGrid');
modules.forEach(m=>{const el=document.createElement('article');el.className='card module-card';el.innerHTML=`<div class="ico">${m[0]}</div><strong>${m[1]}</strong><span>${m[2]}</span>`;grid.appendChild(el)});
let running=true, seconds=10053, rate=135;
const timeEl=document.getElementById('clockTime'), earnEl=document.getElementById('earnings'), btn=document.getElementById('clockBtn');
function tick(){if(running)seconds++;let h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;timeEl.textContent=[h,m,s].map(v=>String(v).padStart(2,'0')).join(':');earnEl.textContent='$'+((seconds/3600)*rate).toFixed(2)}
setInterval(tick,1000);tick();
btn.addEventListener('click',()=>{running=!running;btn.textContent=running?'CLOCK OUT':'CLOCK IN'});
