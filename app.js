const $ = (id) => document.getElementById(id);
let jobs = JSON.parse(localStorage.getItem('rwd_jobs')||'[]');
let jobTimer = null;
function log(msg){ $('activityLog').textContent = msg; }
function showView(name){ document.querySelectorAll('.view').forEach(v=>v.classList.remove('active')); $('view-'+name).classList.add('active'); renderJobs(); }
function saveTruck(){ const vin=$('vinInput').value.trim().toUpperCase(); if(!vin){log('Enter a VIN first.');return} localStorage.setItem('rwd_vin',vin); $('activeTruckTitle').textContent=vin; $('activeTruckSub').textContent='Profile saved locally • VIN decode hook ready'; log('Truck profile saved: '+vin); }
function loadTruck(){ const vin=localStorage.getItem('rwd_vin'); if(vin){$('activeTruckTitle').textContent=vin;$('activeTruckSub').textContent='Profile saved locally • VIN decode hook ready';} renderJobs(); }
function askAI(){ const q=$('askInput').value.trim(); if(!q)return; showView('ai'); $('chatInput').value=q; chatSend(); }
function chatSend(){ const q=$('chatInput').value.trim(); if(!q)return; $('chatBox').innerHTML += `<p><b>You:</b> ${escapeHtml(q)}</p><p><b>AI:</b> Demo response ready. Backend ChatGPT/Supabase hook will connect here. I can use VIN, SPN/FMI, parts, quote, and repair memory context.</p>`; $('chatInput').value=''; $('chatBox').scrollTop=$('chatBox').scrollHeight; }
function masterSearchRun(){ const q=$('masterSearch').value.trim(); log(q ? `Master search queued: ${q}` : 'Type a search first.'); }
function partLookup(){ const p=$('partInput').value.trim(); $('partResult').innerHTML = p ? `<b>${escapeHtml(p)}</b><br>Exact-match parts verification demo. OEM/cross-reference API hook ready.` : 'Enter a part number first.'; }
function faultLookup(){ const spn=$('spn').value.trim(), fmi=$('fmi').value.trim(); $('faultResult').innerHTML = spn && fmi ? `<b>SPN ${spn} FMI ${fmi}</b><br>Diagnostic path demo: verify power/ground, connector pins, harness rub points, sensor signal, then component test. Forced regen checklist available when aftertreatment-related.` : 'Enter SPN and FMI.'; $('faultCount').textContent = spn&&fmi ? '1 active' : '0 active'; }
function addJob(){ jobs.push({id:Date.now(), name:`Job ${jobs.length+1}`, seconds:0, running:false, started:null}); saveJobs(); renderJobs(); }
function clearJobs(){ jobs=[]; saveJobs(); renderJobs(); }
function toggleJob(id){ const j=jobs.find(x=>x.id===id); if(!j)return; if(j.running){ j.seconds += Math.floor((Date.now()-j.started)/1000); j.running=false; j.started=null; } else { j.running=true; j.started=Date.now(); } saveJobs(); renderJobs(); }
function resetJob(id){ const j=jobs.find(x=>x.id===id); if(j){j.seconds=0;j.running=false;j.started=null;saveJobs();renderJobs();} }
function removeJob(id){ jobs=jobs.filter(j=>j.id!==id); saveJobs(); renderJobs(); }
function elapsed(j){ return j.seconds + (j.running ? Math.floor((Date.now()-j.started)/1000) : 0); }
function fmt(s){ const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60; return `${h}h ${m}m ${sec}s`; }
function renderJobs(){ const box=$('jobs'); if(!box)return; box.innerHTML = jobs.length ? jobs.map(j=>`<div class="job-card"><div class="job-row"><b>${j.name}</b><span>${fmt(elapsed(j))}</span></div><div class="job-row"><small>$${((elapsed(j)/3600)*135).toFixed(2)} labor @ $135/hr</small><small>${j.running?'RUNNING':'PAUSED'}</small></div><div class="job-actions"><button onclick="toggleJob(${j.id})">${j.running?'Pause':'Start'}</button><button onclick="resetJob(${j.id})">Clear</button><button onclick="removeJob(${j.id})">Delete</button></div></div>`).join('') : '<div class="result-card">No jobs running. Add a job to start tracking time and money.</div>'; }
function saveJobs(){ localStorage.setItem('rwd_jobs',JSON.stringify(jobs)); }
function calcInvoice(){ const h=+$('laborHours').value||0, r=+$('laborRate').value||135, call=+$('serviceCall').value||0, parts=+$('partsCost').value||0; const subtotal=h*r+call+parts; $('invoiceResult').innerHTML=`Labor: $${(h*r).toFixed(2)}<br>Service Call: $${call.toFixed(2)}<br>Parts: $${parts.toFixed(2)}<hr><b>Total: $${subtotal.toFixed(2)}</b>`; }
function escapeHtml(str){ return str.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
setInterval(()=>{ if(document.querySelector('#view-clock.active')) renderJobs(); },1000);
loadTruck();
