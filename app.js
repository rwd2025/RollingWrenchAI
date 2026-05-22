const panels={
 ai:['Rolling Wrench AI','AI demo response:\n• Verify complaint and active codes.\n• Check power/ground, connector fit, harness rub points.\n• Confirm with live data before parts.'],
 vin:['VIN / Truck Profile','VIN panel ready. Save VIN, year, make, model, engine, ESN, CPL, EPA family.'],
 parts:['Parts Lookup','Parts panel ready. Use exact OEM number first, then verified cross-reference options.'],
 regen:['Forced Regen','Forced regen checklist:\n• Park outside / exhaust clear.\n• Verify coolant temp and no shutdown faults.\n• Monitor DOC/DPF temps and soot load.'],
 clock:['Live Job Clock','Job clock ready. Demo supports Start / Pause / Stop wiring placeholder for multiple jobs.'],
 invoice:['Quote / Invoice','Invoice ready. Defaults: $135/hr labor, $250 service call, tax/card fee fields.'],
 camera:['Camera Parts','Camera part-number mode ready. Connect photo/OCR backend later.'],
 maps:['GPS Pin Drop','GPS pin mode ready. Store roadside location and job notes.']
};
let current='ai';
const title=document.getElementById('panelTitle'), out=document.getElementById('output'), input=document.getElementById('panelInput');
document.querySelectorAll('.module').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.module').forEach(b=>b.classList.remove('active'));btn.classList.add('active');current=btn.dataset.panel;title.textContent=panels[current][0];out.textContent=panels[current][1];input.value='';document.getElementById('panel').scrollIntoView({behavior:'smooth',block:'start'});}));
document.getElementById('runBtn').onclick=()=>{out.textContent=`${panels[current][0]} result:\n${input.value?input.value:'No input entered.'}\n\nDemo action completed. Backend/API hooks can be added after phone stress test.`};
document.getElementById('clearBtn').onclick=()=>{input.value='';out.textContent='Cleared. Ready.'};
document.getElementById('backBtn').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
document.getElementById('copyBtn').onclick=async()=>{try{await navigator.clipboard.writeText(out.textContent);out.textContent+='\n\nCopied to clipboard.'}catch(e){out.textContent+='\n\nCopy blocked by browser.'}};
document.getElementById('invoiceBtn').onclick=()=>{current='invoice';title.textContent='Quote / Invoice';out.textContent='Added note to invoice draft:\n'+(input.value||'No note entered.')};
