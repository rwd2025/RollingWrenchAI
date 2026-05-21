// ==========================================
// SECURE PARTS LIST RENDERING (TEXTCONTENT ONLY)
// ==========================================
function addPartToJob(part) {
  const qty = Number(part.qty) || 1;
  const unitPrice = Number(part.unitPrice || part.price) || 0;

  RWD.job.parts.push({
    id: crypto.randomUUID(),
    partNumber: part.partNumber || "",
    description: part.description || "",
    brand: part.brand || "",
    qty,
    unitPrice,
    price: qty * unitPrice,
    source: part.source || "",
    notes: part.notes || "",
    verified: Boolean(part.verified)
  });

  renderPartsList();
  calculateInvoiceTotals();
  updateDashboardSummaryStatus();
}

function renderPartsList() {
  const partsContainer = document.getElementById("parts-list-container");
  if (!partsContainer) return;

  partsContainer.innerHTML = "";

  if (RWD.job.parts.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state-text";
    emptyState.textContent = "No parts added to this job yet.";
    partsContainer.appendChild(emptyState);
    return;
  }

  RWD.job.parts.forEach(part => {
    const partCard = document.createElement("div");
    partCard.className = `part-item-card ${part.verified ? "is-verified" : ""}`;

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "part-details";

    const mainRow = document.createElement("div");
    mainRow.className = "part-main-row";

    if (part.verified) {
      const badge = document.createElement("span");
      badge.className = "badge-verified";
      badge.textContent = "✓ OEM Verified";
      mainRow.appendChild(badge);
    }

    const partNumSpan = document.createElement("strong");
    partNumSpan.className = "part-num";
    partNumSpan.textContent = part.partNumber || "No P/N";
    mainRow.appendChild(partNumSpan);

    if (part.brand) {
      const brandSpan = document.createElement("span");
      brandSpan.className = "part-brand";
      brandSpan.textContent = ` (${part.brand})`;
      mainRow.appendChild(brandSpan);
    }
    detailsDiv.appendChild(mainRow);

    const descDiv = document.createElement("div");
    descDiv.className = "part-desc";
    descDiv.textContent = part.description || "No description provided";
    detailsDiv.appendChild(descDiv);

    if (part.notes) {
      const notesDiv = document.createElement("div");
      notesDiv.className = "part-notes";
      notesDiv.textContent = `Note: ${part.notes}`;
      detailsDiv.appendChild(notesDiv);
    }

    const pricingDiv = document.createElement("div");
    pricingDiv.className = "part-pricing-breakdown";

    const qtySpan = document.createElement("span");
    qtySpan.textContent = `${part.qty}x @ $${part.unitPrice.toFixed(2)}`;

    const totalStrong = document.createElement("strong");
    totalStrong.className = "part-line-total";
    totalStrong.textContent = `$${part.price.toFixed(2)}`;

    pricingDiv.appendChild(qtySpan);
    pricingDiv.appendChild(totalStrong);
    detailsDiv.appendChild(pricingDiv);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "part-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete-icon";
    deleteBtn.setAttribute("data-action", "remove-part");
    deleteBtn.setAttribute("data-id", part.id);
    deleteBtn.setAttribute("aria-label", "Remove part");
    deleteBtn.textContent = "✕";

    actionsDiv.appendChild(deleteBtn);
    partCard.appendChild(detailsDiv);
    partCard.appendChild(actionsDiv);
    partsContainer.appendChild(partCard);
  });
}

function removePart(id) {
  RWD.job.parts = RWD.job.parts.filter(part => part.id !== id);
  renderPartsList();
  calculateInvoiceTotals();
  updateDashboardSummaryStatus();
}

function clearParts() {
  if (RWD.job.parts.length === 0) return;
  if (confirm("Clear all component lines from this vehicle ticket?")) {
    RWD.job.parts = [];
    renderPartsList();
    calculateInvoiceTotals();
    updateDashboardSummaryStatus();
  }
}
