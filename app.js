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
