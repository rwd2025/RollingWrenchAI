const $=id=>document.getElementById(id);
const state={
  rate:135, callOut:250, tax:7, cardFee:3.0, clockStart:null, clockTimer:null,
  jobs:JSON.parse(localStorage.getItem("rwJobs")||"[]"),
  payroll:JSON.parse(localStorage.getItem("rwPayroll")||"[]")
};

const panels={
menu:["MENU",'<div class="grid2">'+["vin","parts","doctor","repair","invoice","clock","payroll","vision","manuals","gps","memory","scanner","settings","jobs"].map(x=>`<button class="action" onclick="openPanel('${x}')">${x.toUpperCase()}</button>`).join("")+'</div>'],
settings:["SETTINGS",`<div class="grid2">
<label>Labor Rate<input id="setRate" class="field" type="number" value="${state.rate}"></label>
<label>Service Call<input id="setCall" class="field" type="number" value="${state.callOut}"></label>
<label>Tax %<input id="setTax" class="field" type="number" value="${state.tax}"></label>
<label>Card Fee %<input id="setCard" class="field" type="number" value="${state.cardFee}"></label>
</div><button class="action" onclick="saveSettings()">SAVE SETTINGS</button><div class="output">Backend URL and API keys stay in backend .env only. Do not put keys in frontend.</div>`],
master:["MASTER SEARCH",`<textarea id="masterQ" class="field" rows="5" placeholder="VIN, part number, fault code, symptom, repair, quote note..."></textarea><button class="action" onclick="runMaster()">RUN SEARCH</button><div id="masterOut" class="output">Results show here.</div>`],
vin:["VIN LOOKUP",`<div class="grid2"><label>VIN<input id="vinIn" class="field" value="1XP4D49X8KD123456"></label><label>Engine<input id="engIn" class="field" value="Cummins X15"></label><label>ESN<input id="esnIn" class="field" value="79876562"></label><label>CPL<input id="cplIn" class="field" value="4342"></label></div><button class="action" onclick="saveTruck()">SAVE ACTIVE TRUCK</button><div id="vinOut" class="output">VIN system ready.</div>`],
parts:["OEM PARTS",`<textarea id="partQ" class="field" rows="4" placeholder="Part number or part name..."></textarea><button class="action" onclick="parts()">LOOKUP PART</button><button class="action" onclick="openCamera()">SCAN LABEL</button><div id="partsOut" class="output">Parts system ready.</div>`],
doctor:["DIESEL DOCTOR",`<textarea id="docQ" class="field" rows="4" placeholder="SPN/FMI, symptom, derate, regen, no-start..."></textarea><button class="action" onclick="doctor()">RUN DIAGNOSTIC</button><div id="docOut" class="output">Diagnostic system ready.</div>`],
repair:["REPAIR BRAIN",`<textarea id="repQ" class="field" rows="4" placeholder="Repair steps, tools, warnings..."></textarea><button class="action" onclick="repair()">BUILD REPAIR PLAN</button><div id="repOut" class="output">Repair Brain ready.</div>`],
invoice:["SMART QUOTE / INVOICE",`<div class="grid2">
<label>Customer<input id="cust" class="field" placeholder="Customer name"></label>
<label>Unit / Truck<input id="unit" class="field" placeholder="Unit # / truck"></label>
<label>Labor Hours<input id="laborHours" class="field" type="number" step="0.1"></label>
<label>Labor Rate<input id="laborRate" class="field" type="number" value="${state.rate}"></label>
<label>Service Call<input id="serviceCall" class="field" type="number" value="${state.callOut}"></label>
<label>Drive / Misc<input id="driveFee" class="field" type="number" value="0"></label>
<label>Parts Cost<input id="partsCost" class="field" type="number" value="0"></label>
<label>Markup %<input id="markup" class="field" type="number" value="0"></label>
<label>Tax %<input id="taxRate" class="field" type="number" value="${state.tax}"></label>
<label>Card Fee %<input id="cardFee" class="field" type="number" value="${state.cardFee}"></label>
</div>
<label>Complaint / Job Notes<textarea id="jobNotes" class="field" rows="4" placeholder="Complaint, cause, correction, parts, quote note..."></textarea></label>
<div class="grid3"><button class="action" onclick="buildInvoice()">TOTAL</button><button class="action" onclick="copyInvoice()">COPY</button><button class="action" onclick="saveJob()">SAVE JOB</button></div>
<div id="invoiceOut" class="output">Invoice output ready.</div>`],
clock:["JOB CLOCK",`<div class="output" style="text-align:center"><b id="clockStatus" style="color:#ff7a00;font-size:28px">CLOCKED OUT</b><br><span id="clockTimer" style="font-size:54px;font-weight:900">0.00 hrs</span></div>
<div class="grid3"><button class="action" onclick="clockIn()">CLOCK IN</button><button class="action" onclick="clockOut()">CLOCK OUT</button><button class="action" onclick="resetClock()">RESET</button></div>
<button class="action" onclick="sendClockToInvoice()">SEND HOURS TO INVOICE</button>`],
payroll:["PAYROLL",`<div class="grid2">
<label>Employee / Tech<input id="payName" class="field" placeholder="James / David / Steph"></label>
<label>Hourly Rate<input id="payRate" class="field" type="number" value="25"></label>
<label>Hours Worked<input id="payHours" class="field" type="number" step="0.1"></label>
<label>Bonus / Reimb.<input id="payBonus" class="field" type="number" value="0"></label>
</div>
<div class="grid3"><button class="action" onclick="calcPayroll()">CALC</button><button class="action" onclick="savePayroll()">SAVE</button><button class="action" onclick="showPayroll()">HISTORY</button></div>
<div id="payrollOut" class="output">Payroll calculator ready.</div>`],
jobs:["SAVED JOBS",`<button class="action" onclick="showJobs()">REFRESH JOBS</button><button class="action" onclick="clearJobs()">CLEAR JOBS</button><div id="jobsOut" class="output">Saved jobs show here.</div>`],
vision:["VISION / OCR",`<button class="action" onclick="openCamera()">OPEN CAMERA / PHOTO</button><div class="output">OCR shell ready. Backend vision API connects next.</div>`],
manuals:["SERVICE MANUALS",`<textarea class="field" rows="4" placeholder="Search manual/procedure..."></textarea><div class="output">Manual search shell ready.</div>`],
gps:["DOT / GPS",`<button class="action" onclick="gps()">DROP GPS PIN</button><div id="gpsOut" class="output">GPS ready.</div>`],
memory:["REPAIR MEMORY",`<textarea id="memQ" class="field" rows="4" placeholder="Save repair note..."></textarea><button class="action" onclick="memory()">SAVE MEMORY</button><button class="action" onclick="showMemory()">SHOW MEMORY</button><div id="memOut" class="output">Memory ready.</div>`],
scanner:["SCANNER",`<div class="output">Bluetooth 9-pin / OBD2 / J1939 scanner module.\\n\\nStatus: READY TO CONNECT\\n\\nFuture connection:\\nws://localhost:8000/ws/j1939\\n\\nRoutes live DM1 faults, SPN/FMI, RPM, boost, coolant, oil temp into Diesel Doctor and Repair Brain.</div><button class="action" onclick="alert('Scanner WebSocket hook ready for backend')">CONNECT SCANNER</button>`],
gateway:["OEM GATEWAY",`<div class="output">OEM Gateway ready. Connects VIN, ESN, CPL, fault codes and OEM lookup systems.</div>`],
ai:["AI SYSTEM",`<div class="output">AI System online shell. Connects to FastAPI + Ollama backend.</div>`],
supabase:["SUPABASE SYNC",`<div class="output">Supabase sync shell ready. Stores repair memory, parts, VIN profiles and job records.</div>`],
offline:["OFFLINE MODE",`<div class="output">Offline mode ready. PWA cache installed for homepage and local shop tools.</div>`],
more:["MORE",`<div class="grid2"><button class="action" onclick="openPanel('scanner')">SCANNER</button><button class="action" onclick="openPanel('payroll')">PAYROLL</button><button class="action" onclick="openPanel('jobs')">SAVED JOBS</button><button class="action" onclick="openPanel('settings')">SETTINGS</button><button class="action" onclick="openPanel('memory')">MEMORY</button><button class="action" onclick="openPanel('gps')">GPS</button></div>`]
};

function openPanel(name){const p=panels[name]||panels.more;$("homeScreen").classList.remove("active");$("panelScreen").classList.add("active");$("panelTitle").textContent=p[0];$("panelBody").innerHTML=p[1]; if(name==="jobs") showJobs();}
function goHome(){$("panelScreen").classList.remove("active");$("homeScreen").classList.add("active");}
function openCamera(){$("cameraInput").click();}
$("cameraInput").addEventListener("change",e=>{const f=e.target.files[0];if(f)alert("Photo loaded: "+f.name);});
function voiceShell(){alert("Voice shell ready. Backend connects next.");}
function saveSettings(){state.rate=+$("setRate").value||135;state.callOut=+$("setCall").value||250;state.tax=+$("setTax").value||0;state.cardFee=+$("setCard").value||0;localStorage.setItem("rwSettings",JSON.stringify({rate:state.rate,callOut:state.callOut,tax:state.tax,cardFee:state.cardFee}));alert("Settings saved");}
function runMaster(){const q=$("masterQ").value.trim();$("masterOut").textContent=q?`Searching Rolling Wrench AI:\\n${q}\\n\\nRoutes: VIN, Parts, Diesel Doctor, Repair Brain, Scanner, Quote Notes.`:"Enter a question first."}
function saveTruck(){let vin=$("vinIn").value||"NONE",eng=$("engIn").value||"UNKNOWN";$("vinOut").textContent=`Active truck saved.\\nVIN: ${vin}\\nEngine: ${eng.toUpperCase()}`;}
function parts(){const q=$("partQ").value.trim();$("partsOut").textContent=q?`OEM parts lookup shell:\\n${q}\\n\\nNext: Supabase/parts database.`:"Enter part number/name."}
function doctor(){const q=$("docQ").value.trim();$("docOut").textContent=q?`Diesel Doctor shell:\\n${q}\\n\\nNext: FastAPI/Ollama/Neo4j diagnostics.`:"Enter fault/symptom."}
function repair(){const q=$("repQ").value.trim();$("repOut").textContent=q?`Repair Brain shell:\\n${q}\\n\\nNext: repair memory + known fixes.`:"Enter repair question."}
function money(n){return "$"+(Number(n)||0).toFixed(2)}
function buildInvoice(){
  const customer=$("cust").value||"Customer", unit=$("unit").value||"Unit", h=+$("laborHours").value||0, r=+$("laborRate").value||0, call=+$("serviceCall").value||0, drive=+$("driveFee").value||0, parts=+$("partsCost").value||0, markup=+$("markup").value||0, tax=+$("taxRate").value||0, card=+$("cardFee").value||0, notes=$("jobNotes").value||"";
  const labor=h*r, partsMarked=parts+(parts*markup/100), subtotal=labor+call+drive+partsMarked, taxAmt=subtotal*tax/100, beforeCard=subtotal+taxAmt, cardAmt=beforeCard*card/100, total=beforeCard+cardAmt;
  const text=`ROLLING WRENCH DIESEL\\nQUOTE / INVOICE\\n\\nCustomer: ${customer}\\nUnit: ${unit}\\n\\nLabor: ${h.toFixed(2)} hrs x ${money(r)} = ${money(labor)}\\nService Call: ${money(call)}\\nDrive/Misc: ${money(drive)}\\nParts: ${money(parts)}\\nMarkup (${markup}%): ${money(partsMarked-parts)}\\nSubtotal: ${money(subtotal)}\\nTax (${tax}%): ${money(taxAmt)}\\nCard Fee (${card}%): ${money(cardAmt)}\\n\\nCUSTOMER TOTAL: ${money(total)}\\n\\nNotes:\\n${notes}`;
  $("invoiceOut").textContent=text;
  return {customer,unit,h,r,call,drive,parts,markup,tax,card,notes,total,text,date:new Date().toLocaleString()};
}
function copyInvoice(){const txt=$("invoiceOut")?.textContent||"";navigator.clipboard?.writeText(txt);alert("Invoice copied");}
function saveJob(){const job=buildInvoice();state.jobs.unshift(job);localStorage.setItem("rwJobs",JSON.stringify(state.jobs));$("invoiceOut").textContent += "\\n\\nSAVED TO JOB HISTORY."; }
function showJobs(){const out=$("jobsOut"); if(!out)return; out.textContent=state.jobs.length?state.jobs.map((j,i)=>`#${i+1} ${j.date}\\n${j.customer} - ${j.unit}\\nTotal: ${money(j.total)}\\n${j.notes}\\n`).join("\\n---\\n"):"No saved jobs yet.";}
function clearJobs(){if(confirm("Clear saved jobs?")){state.jobs=[];localStorage.setItem("rwJobs","[]");showJobs();}}
function clockIn(){state.clockStart=Date.now();$("clockStatus").textContent="CLOCKED IN";clearInterval(state.clockTimer);state.clockTimer=setInterval(updateClock,1000);updateClock()}
function updateClock(){if(!state.clockStart)return;$("clockTimer").textContent=((Date.now()-state.clockStart)/3600000).toFixed(2)+" hrs"}
function clockOut(){updateClock();$("clockStatus").textContent="CLOCKED OUT";clearInterval(state.clockTimer)}
function resetClock(){state.clockStart=null;clearInterval(state.clockTimer);$("clockStatus").textContent="CLOCKED OUT";$("clockTimer").textContent="0.00 hrs"}
function sendClockToInvoice(){let hrs=state.clockStart?((Date.now()-state.clockStart)/3600000).toFixed(2):"0.00";openPanel("invoice");setTimeout(()=>{$("laborHours").value=hrs;},50)}
function calcPayroll(){const name=$("payName").value||"Tech", rate=+$("payRate").value||0, hrs=+$("payHours").value||0, bonus=+$("payBonus").value||0, gross=rate*hrs+bonus; $("payrollOut").textContent=`PAYROLL\\n${name}\\nHours: ${hrs.toFixed(2)}\\nRate: ${money(rate)}\\nBonus/Reimb: ${money(bonus)}\\nGROSS PAY: ${money(gross)}`; return {name,rate,hrs,bonus,gross,date:new Date().toLocaleString()};}
function savePayroll(){const rec=calcPayroll();state.payroll.unshift(rec);localStorage.setItem("rwPayroll",JSON.stringify(state.payroll));$("payrollOut").textContent+="\\n\\nSAVED TO PAYROLL HISTORY.";}
function showPayroll(){$("payrollOut").textContent=state.payroll.length?state.payroll.map((p,i)=>`#${i+1} ${p.date}\\n${p.name}: ${p.hrs} hrs x ${money(p.rate)} + ${money(p.bonus)} = ${money(p.gross)}`).join("\\n---\\n"):"No payroll history yet."}
function gps(){if(!navigator.geolocation){$("gpsOut").textContent="GPS not supported.";return;}$("gpsOut").textContent="Getting GPS...";navigator.geolocation.getCurrentPosition(p=>$("gpsOut").textContent=`GPS Pin:\\n${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`,()=>$("gpsOut").textContent="GPS denied/unavailable.")}
function memory(){const old=JSON.parse(localStorage.getItem("rwMemory")||"[]");old.unshift({date:new Date().toLocaleString(),note:$("memQ").value});localStorage.setItem("rwMemory",JSON.stringify(old));$("memOut").textContent="Repair memory saved."}
function showMemory(){const mem=JSON.parse(localStorage.getItem("rwMemory")||"[]");$("memOut").textContent=mem.length?mem.map((m,i)=>`#${i+1} ${m.date}\\n${m.note}`).join("\\n---\\n"):"No repair memory yet."}
try{const s=JSON.parse(localStorage.getItem("rwSettings")||"{}");Object.assign(state,s);}catch(e){}
if("serviceWorker" in navigator){navigator.serviceWorker.register("service-worker.js").catch(()=>{});}
