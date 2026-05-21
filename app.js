// ==========================================
// ROLLING WRENCH DIESEL MASTER ENGINE STATE
// ==========================================
const RWD = {
  activeView: "home",
  history: [],
  clock: {
    running: false,
    startTime: null,
    elapsedMs: 0,
    hourlyRate: 135,
    serviceCall: 250,
    ticker: null
  },
  job: {
    customer: "",
    unit: "",
    vin: "",
    engine: "",
    notes: "",
    parts: [],
    labor: []
  }
};

// ==========================================
// DETERMINISTIC VIEW SWITCHER (ROUTER)
// ==========================================
function switchView(viewId, pushHistory = true) {
  const current = RWD.activeView;
  const targetElement = document.getElementById(viewId);
  if (!targetElement) return;

  document.querySelectorAll(".app-section").forEach(section => {
    section.classList.toggle("is-active", section.id === viewId);
  });

  if (pushHistory && current && current !== viewId) {
    RWD.history.push(current);
  }

  RWD.activeView = viewId;
  window.scrollTo(0, 0);
}

function goBack() {
  const previous = RWD.history.pop() || "home";
  switchView(previous, false);
}

// ==========================================
// UNIFIED DIAGNOSTICS LOG RECOVERY
// ==========================================
function saveManualNotesFromUI() {
  const notesTextArea = document.getElementById("job-notes-display");
  if (notesTextArea) {
    RWD.job.notes = notesTextArea.value;
    renderJobNotes();
    updateDashboardSummaryStatus();
  }
}

function renderJobNotes() {
  const notesTextArea = document.getElementById("job-notes-display");
  if (notesTextArea) {
    notesTextArea.value = RWD.job.notes.trim();
  }

  const diagnosticsSummary = document.getElementById("diag-summary-container");
  if (diagnosticsSummary) {
    diagnosticsSummary.innerHTML = "";

    if (!RWD.job.notes.trim()) {
      const emptyText = document.createElement("div");
      emptyText.className = "empty-state-text";
      emptyText.textContent = "No diagnostics recorded for this ticket.";
      diagnosticsSummary.appendChild(emptyText);
      return;
    }

    const logCard = document.createElement("div");
    logCard.className = "diagnostic-log-card";

    const notesBody = document.createElement("p");
    notesBody.className = "notes-body";
    notesBody.textContent = RWD.job.notes.trim();

    logCard.appendChild(notesBody);
    diagnosticsSummary.appendChild(logCard);
  }
}

function updateDashboardSummaryStatus() {
  const clkStat = document.getElementById("dash-clock-status");
  if (clkStat) clkStat.textContent = RWD.clock.running ? "TRACKING LIVE" : "Stopped";

  const prtStat = document.getElementById("dash-parts-count");
  if (prtStat) prtStat.textContent = `${RWD.job.parts.length} Items Added`;

  const diagStat = document.getElementById("dash-diag-status");
  if (diagStat) diagStat.textContent = RWD.job.notes.trim() ? "Notes Captured" : "Empty";
}

// ==========================================
// TRANSIENT TRANSFORMATION INTERCEPTOR (GATEWAY)
// ==========================================
function handleAIResult(result) {
  if (!result) return;

  if (result.type === "part_result" && result.part) {
    addPartToJob({
      ...result.part,
      verified: result.verified,
      source: result.source,
      notes: result.part.notes || `AI Confidence: ${Math.round((result.confidence || 0) * 100)}%`
    });
    switchView("partsLookup");
    return;
  }

  if (result.type === "diagnostic_result" && result.diagnostic) {
    const freshDiagStr = formatDiagnosticNote(result.diagnostic);
    RWD.job.notes = RWD.job.notes.trim()
      ? `${RWD.job.notes}\n\n${freshDiagStr}`
      : freshDiagStr;

    renderJobNotes();
    updateDashboardSummaryStatus();
    switchView("diagnostics");
  }
}

function formatDiagnosticNote(d) {
  return [
    d.complaint ? `Complaint: ${d.complaint}` : "",
    d.cause ? `Cause: ${d.cause}` : "",
    d.correction ? `Correction: ${d.correction}` : "",
    d.tests?.length ? `Tests Run: ${d.tests.join(", ")}` : "",
    d.warnings?.length ? `System Warnings: ${d.warnings.join(", ")}` : ""
  ].filter(Boolean).join("\n");
}

// ==========================================
// UNIFIED DELEGATION CLICK ARCHITECTURE
// ==========================================
document.addEventListener("click", e => {
  const viewBtn = e.target.closest("[data-view]");
  const actionBtn = e.target.closest("[data-action]");

  if (viewBtn) {
    switchView(viewBtn.dataset.view);
    return;
  }

  if (actionBtn) {
    const action = actionBtn.dataset.action;

    if (action === "back") { goBack(); return; }
    if (action === "start-clock") { startClock(); return; }
    if (action === "stop-clock") { stopClock(); return; }
    if (action === "clear-job") { clearJob(); return; }
    if (action === "clear-parts") { clearParts(); return; }
    if (action === "save-manual-notes") { saveManualNotesFromUI(); return; }
    if (action === "remove-part") {
      const partId = actionBtn.getAttribute("data-id");
      removePart(partId);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderPartsList === "function") renderPartsList();
  renderJobNotes();
  if (typeof calculateInvoiceTotals === "function") calculateInvoiceTotals();
  updateDashboardSummaryStatus();
});
