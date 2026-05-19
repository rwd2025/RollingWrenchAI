const modules = [
  ['🚛','VIN LOOKUP','Decode VIN, ESN, CPL & more'],['⚙️📦','OEM PARTS','Search OEM parts & diagrams'],['🩺','FAULT DOCTOR','AI powered fault diagnostics'],['🖥️','REPAIR HUD','Step-by-step repair guidance'],['🧾💰','SMART QUOTES','Create quotes & estimates'],['📋','WORK ORDERS','Create, manage & track jobs'],['📄','INVOICES','Create invoices & send'],['🕘','TIME CLOCK','Track time, jobs & labor'],['📷','CAMERA / OCR','Scan codes, parts & documents'],['📍','DOT / GPS','GPS, routes, ELD & location'],['🧠','REPAIR MEMORY','Saved repairs, history & notes'],['🤝','SUPPLIERS','Parts suppliers & contacts'],['🤖','AI ASSISTANT','Ask AI for help, advice & more'],['📊','REPORTS','Analytics & performance'],['⚙️','SETTINGS','App settings & preferences']
];
const grid = document.getElementById('moduleGrid');
modules.forEach(([ico,title,desc])=>{ const el=document.createElement('button'); el.className='module'; el.innerHTML=`<div class="ico">${ico}</div><strong>${title}</strong><p>${desc}</p>`; grid.appendChild(el); });
document.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>btn.animate([{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:160})));
