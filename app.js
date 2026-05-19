// Initialize layout actions and navigation events
document.addEventListener('DOMContentLoaded', () => {
  
  // Single delegated event listener for grease-finger friendly touch targets
  document.body.addEventListener('click', (e) => {
    const targetButton = e.target.closest('[data-action]');
    if (!targetButton) return;

    const actionRaw = targetButton.getAttribute('data-action');
    const [type, command] = actionRaw.split(':');

    // Route based on layout semantics
    if (type === 'nav') {
      handleTabNavigation(command, targetButton);
    } else if (type === 'action') {
      executeDiagnosticCommand(command);
    }
  });
});

// Update the visual selection on your bottom nav dock
function handleTabNavigation(tabName, activeNode) {
  console.log(`Navigating to dashboard section: ${tabName}`);
  
  // Strip active state from previous selection
  document.querySelectorAll('.dock-action-item').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Append orange active line indicators to clicked target
  activeNode.classList.add('active');
  
  // Your app router context switches go here:
  // router.navigate(tabName);
}

// Map grid blocks directly to your backend or store logic
function executeDiagnosticCommand(command) {
  console.log(`Command triggered: ${command}`);
  
  switch(command) {
    case 'vin-lookup':
      // triggerCameraOCR() or openVinModal()
      break;
    case 'diesel-doctor':
      // loadFaultCodeWorkspace()
      break;
    case 'oem-parts':
      // openCrossReferenceEngine()
      break;
    default:
      if (window.commandBus) {
        window.commandBus.publish(command);
      }
  }
}
// Drop this into your background listener or Zustand store subscriber
function updateDashboardTelemetry(vehicleData, systemMetrics) {
  
  // 1. Update active specification matrix text fields
  const specFields = {
    'vin': vehicleData.vin || '---',
    'engine': vehicleData.engine || '---',
    'esn': vehicleData.esn || '---',
    'odometer': vehicleData.odometer ? `${vehicleData.odometer} MI` : '---',
    'hours': vehicleData.hours ? `${vehicleData.hours} HRS` : '---'
  };

  // Dynamically map properties directly into your HTML grid matrix cells
  Object.keys(specFields).forEach(key => {
    // Looks for spec cells containing labels matching key criteria
    const labelNodes = Array.from(document.querySelectorAll('.spec-cell label'));
    const targetLabel = labelNodes.find(lbl => lbl.textContent.toLowerCase() === key);
    if (targetLabel && targetLabel.nextElementSibling) {
      targetLabel.nextElementSibling.textContent = specFields[key];
    }
  });

  // 2. Toggle low status infrastructure nodes (active/inactive states)
  const hardwareNodes = {
    'gateway': systemMetrics.oemGatewayConnected,
    'ai': systemMetrics.aiEngineOnline,
    'sync': systemMetrics.databaseSynced,
    'memory': systemMetrics.localCacheActive,
    'scanner': systemMetrics.rp1210Connected
  };

  // Toggle opacity and success text color based on connection state variables
  Object.keys(hardwareNodes).forEach(nodeName => {
    const nodeLabelNodes = Array.from(document.querySelectorAll('.node-cell span'));
    const targetSpan = nodeLabelNodes.find(span => span.textContent.toLowerCase().includes(nodeName));
    if (targetSpan) {
      const containerCell = targetSpan.closest('.node-cell');
      if (hardwareNodes[nodeName]) {
        containerCell.classList.add('active');
      } else {
        containerCell.classList.remove('active');
      }
    }
  });
}
