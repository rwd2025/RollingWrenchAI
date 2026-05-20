const tools=[
['VIN LOOKUP','Decode VIN, ESN, CPL & more','🚚'],
['OEM PARTS','Search OEM parts & diagrams','⚙️📦'],
['FAULT DOCTOR','AI powered fault diagnostics','🩺'],
['REPAIR HUD','Step-by-step repair guidance','🖥️'],
['SMART QUOTES','Create quotes & estimates','📜💰'],
['WORK ORDERS','Create, manage & track jobs','📋'],
['INVOICES','Create invoices & send','📄'],
['TIME CLOCK','Track time, jobs & labor','🕘'],
['CAMERA / OCR','Scan codes, parts & documents','📷'],
['DOT / GPS','GPS, routes, ELD & location','📍'],
['REPAIR MEMORY','Saved repairs, history & notes','🧠'],
['SUPPLIERS','Parts suppliers & contacts','🤝'],
['AI ASSISTANT','Ask AI for help, advice & more','🤖'],
['REPORTS','Analytics & performance','📊'],
['SETTINGS','App settings & preferences','⚙️']
];

let seconds=0,running=false,timer=null,rate=145;
const drawer=document.getElementById('drawer'),title=document.getElementById('drawerTitle'),body=document.getElementById('drawerBody');

function pad(n){return String(n).padStart(2,'0')}
function fmt(s){return `${pad(Math.floor(s/3600))}:${pad(Math.floor((s%3600)/60))}:${pad(s%60)}`}
function cash(){return '$'+((seconds/3600)*rate).toFixed(2)}
function paintClock(){document.querySelectorAll('[data-clock-time]').forEach(e=>e.textContent=fmt(seconds));document.querySelectorAll('[data-clock-pay]').forEach(e=>e.textContent=cash())}
function moduleHtml(name){return name==='TIME CLOCK'?`<div class="drawer-card clock-panel"><strong data-clock-time>00:00:00</strong><span data-clock-pay>$0.00</span><div class="clock-actions"><button class="clock-in" data-action="clock-in">CLOCK IN</button><button class="clock-out" data-action="clock-out">CLOCK OUT</button></div></div><div class="drawer-card"><h3>Multi-Job Labor Matrix</h3><p>Clock does not run on startup. It starts only after CLOCK IN.</p></div>`:`<div class="drawer-card"><h3>${name}</h3><p>This module is wired into the final shell and ready for Supabase, Twilio, J1939, OCR, repair memory, and live job data.</p></div>`}
function openModule(name){title.textContent=name;body.innerHTML=moduleHtml(name);drawer.classList.add('open');paintClock()}
document.getElementById('closeDrawer').onclick=()=>drawer.classList.remove('open');

const toolsEl=document.getElementById('tools');
tools.forEach(([n,s,i])=>{const b=document.createElement('button');b.className='tool';b.innerHTML=`<div class="icon">${i}</div><div><b>${n}</b><small>${s}</small></div>`;b.onclick=()=>openModule(n);toolsEl.appendChild(b)});

document.addEventListener('click',e=>{
 const mod=e.target.closest('[data-module]')?.dataset.module;
 const action=e.target.closest('[data-action]')?.dataset.action;
 const tab=e.target.closest('[data-tab]')?.dataset.tab;
 if(mod)openModule(mod);
 if(tab){document.querySelectorAll('nav button').forEach(x=>x.classList.remove('on'));e.target.closest('button').classList.add('on');if(tab!=='HOME')openModule(tab)}
 if(action==='clock-in'&&!running){running=true;timer=setInterval(()=>{seconds++;paintClock()},1000)}
 if(action==='clock-out'){running=false;clearInterval(timer);paintClock()}
});
paintClock();
