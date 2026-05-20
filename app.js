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
function openModule(name,html){title.textContent=name;body.innerHTML=html;drawer.classList.add('open');paintClock()}
function closeModule(){drawer.classList.remove('open')}
document.getElementById('closeDrawer').onclick=closeModule;

function moduleHtml(name,sub){
 if(name==='TIME CLOCK')return `<div class="drawer-card clock-panel"><strong data-clock-time>00:00:00</strong><span data-clock-pay>$0.00</span><div class="clock-actions"><button class="clock-in" data-action="clock-in">CLOCK IN</button><button class="clock-out" data-action="clock-out">CLOCK OUT</button></div></div><div class="drawer-card"><h3>Multi-Job Labor Matrix</h3><p>Clock does not run on startup. It only starts when you open this module and press CLOCK IN.</p></div>`;
 if(name==='OEM PARTS')return `<div class="drawer-card"><h3>Parts Procurement Node</h3><p>Search inventory, quick kits, OEM books, and cross references.</p><input id="partsSearch" placeholder="Search parts catalog..."></div><div id="catalogList"></div>`;
 if(name==='AI ASSISTANT')return `<div class="drawer-card"><h3>AI Copilot + Image Upload</h3><p>Ask diagnostic questions or upload engine/part pictures.</p><input type="file" accept="image/*" onchange="previewImage(this)"></div><div id="aiPreview"></div>`;
 if(name==='VIN LOOKUP')return `<div class="drawer-card"><h3>Optical VIN Decoder</h3><p>Camera scanner shell. HTTPS is required for camera permissions.</p><button data-action="camera" style="width:100%;background:#00ccff;border:0;border-radius:10px;color:#001018;font-weight:900;padding:12px;margin-top:10px">ACTIVE CAMERA</button></div><div class="drawer-card"><video id="video" autoplay playsinline muted style="width:100%;height:220px;background:#05080d;border-radius:12px;object-fit:cover"></video><p id="cameraState">Camera offline.</p></div>`;
 if(name==='INVOICES')return `<div class="drawer-card"><h3>Digital Invoice Compiler</h3><p>Generates a field invoice from clock, truck, and job values.</p><button data-action="invoice" style="width:100%;background:#ff6600;border:0;border-radius:10px;color:#210800;font-weight:900;padding:12px;margin-top:10px">COMPILE INVOICE</button></div>`;
 return `<div class="drawer-card"><h3>${name}</h3><p>${sub}</p></div><div class="drawer-card"><h3>Integrated Build</h3><p>This module is wired into the final shell and ready for Supabase, Twilio dispatch, J1939 streaming, OCR, repair memory, and live job data.</p></div>`;
}

const toolsEl=document.getElementById('tools');
tools.forEach(([n,s,i])=>{const b=document.createElement('button');b.className='tool';b.innerHTML=`<div class="icon">${i}</div><div><b>${n}</b><small>${s}</small></div>`;b.onclick=()=>openModule(n,moduleHtml(n,s));toolsEl.appendChild(b)});

document.addEventListener('click',async e=>{
 const mod=e.target.closest('[data-module]')?.dataset.module;
 const action=e.target.closest('[data-action]')?.dataset.action;
 const tab=e.target.closest('[data-tab]')?.dataset.tab;
 if(mod)openModule(mod.toUpperCase(),moduleHtml(mod.toUpperCase(),mod));
 if(tab){document.querySelectorAll('nav button').forEach(x=>x.classList.remove('on'));e.target.closest('button').classList.add('on');if(tab!=='Home')openModule(tab.toUpperCase(),moduleHtml(tab.toUpperCase(),tab))}
 if(action==='search'){openModule('MASTER SEARCH',moduleHtml('MASTER SEARCH','Search VINs, parts, symptoms, jobs, faults, and repair memory.'))}
 if(action==='clock-in'&&!running){running=true;timer=setInterval(()=>{seconds++;paintClock()},1000)}
 if(action==='clock-out'){running=false;clearInterval(timer);paintClock()}
 if(action==='invoice')downloadInvoice()
 if(action==='camera')startCamera()
});

document.addEventListener('input',e=>{
 if(e.target.id==='partsSearch'){const q=e.target.value.toLowerCase();const data=[
 {name:'Cummins X15 PM Filter Kit',sku:'X15-PM-KIT',price:'145.10',loc:'Truck A',qty:2},
 {name:'Air Brake T30/30 Chamber Kit',sku:'AB-3030-KIT',price:'210.45',loc:'Service Truck A',qty:4},
 {name:'Heavy Duty Hub Assembly Kit',sku:'HD-HUB-KIT',price:'489.00',loc:'Main Hub',qty:1}
 ].filter(p=>(p.name+p.sku).toLowerCase().includes(q));document.getElementById('catalogList').innerHTML=data.map(p=>`<div class="drawer-card"><h3>${p.name}</h3><p>SKU: ${p.sku}<br>Location: ${p.loc} • Qty: ${p.qty}<br>$${p.price}</p></div>`).join('')}
});

function previewImage(input){if(!input.files?.[0])return;const r=new FileReader();r.onload=e=>document.getElementById('aiPreview').innerHTML=`<div class="drawer-card"><img src="${e.target.result}" style="max-width:100%;border-radius:12px"><p>image_payload.jpg</p></div>`;r.readAsDataURL(input.files[0])}
async function startCamera(){const v=document.getElementById('video'),s=document.getElementById('cameraState');try{v.srcObject=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});s.textContent='Camera online. ZXing scanner connects in the next phase.'}catch(err){s.textContent='Camera unavailable or permission denied.'}}
function downloadInvoice(){const txt=`ROLLING WRENCH AI FIELD INVOICE\nTruck: 2020 Freightliner Cascadia 126\nLabor: ${fmt(seconds)}\nLabor Total: ${cash()}\nParts: Air Brake T30/30 Kit $210.45\nGenerated: ${new Date().toLocaleString()}`;const blob=new Blob([txt],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`RollingWrench_Invoice_${Date.now()}.txt`;a.click()}
paintClock();
