// ==========================================
// QUANTITY-CORRECTED TIME ENGINE & CORE CALCS
// ==========================================
function startClock() {
  if (RWD.clock.running) return;

  RWD.clock.running = true;
  RWD.clock.startTime = Date.now() - RWD.clock.elapsedMs;

  RWD.clock.ticker = setInterval(() => {
    RWD.clock.elapsedMs = Date.now() - RWD.clock.startTime;
    updateClockUI();
    calculateInvoiceTotals();
  }, 250);

  updateDashboardSummaryStatus();
}

function stopClock() {
  if (!RWD.clock.running) return;

  RWD.clock.running = false;
  clearInterval(RWD.clock.ticker);
  RWD.clock.ticker = null;

  calculateInvoiceTotals();
  updateDashboardSummaryStatus();
}

function clearJob() {
  if (confirm("Reset current ticket details, time accumulations, and parts registers?")) {
    if (RWD.clock.running) {
      clearInterval(RWD.clock.ticker);
    }

    RWD.clock.running = false;
    RWD.clock.elapsedMs = 0;
    RWD.clock.startTime = null;
    RWD.clock.ticker = null;

    RWD.job = {
      customer: "",
      unit: "",
      vin: "",
      engine: "",
      notes: "",
      parts: [],
      labor: []
    };

    updateClockUI();
    renderPartsList();
    renderJobNotes();
    calculateInvoiceTotals();
    updateDashboardSummaryStatus();
    switchView("home");
  }
}

function updateClockUI() {
  const totalSeconds = Math.floor(RWD.clock.elapsedMs / 1000);
  const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");

  const displayElement = document.getElementById("clock-display");
  if (displayElement) displayElement.textContent = `${hrs}:${mins}:${secs}`;

  const decimalHours = RWD.clock.elapsedMs / (1000 * 60 * 60);
  const liveLaborCost = decimalHours * RWD.clock.hourlyRate;

  const costElement = document.getElementById("clock-live-cost");
  if (costElement) costElement.textContent = `$${liveLaborCost.toFixed(2)}`;
}

function calculateInvoiceTotals() {
  const decimalHours = RWD.clock.elapsedMs / (1000 * 60 * 60);
  const laborTotal = decimalHours * RWD.clock.hourlyRate;

  const partsTotal = RWD.job.parts.reduce((sum, item) => {
    return sum + ((Number(item.qty) || 1) * (Number(item.unitPrice) || 0));
  }, 0);

  const serviceCall = RWD.clock.serviceCall;
  const grandTotal = serviceCall + laborTotal + partsTotal;

  const domMappings = {
    "inv-service-call": serviceCall.toFixed(2),
    "inv-labor-hours": decimalHours.toFixed(2),
    "inv-labor-total": laborTotal.toFixed(2),
    "inv-parts-total": partsTotal.toFixed(2),
    "inv-grand-total": grandTotal.toFixed(2)
  };

  for (const [id, value] of Object.entries(domMappings)) {
    const el = document.getElementById(id);
    if (el) el.textContent = id.includes("hours") ? value : `$${value}`;
  }

  const dashInvSum = document.getElementById("dash-invoice-total");
  if (dashInvSum) dashInvSum.textContent = `$${grandTotal.toFixed(2)}`;
}
