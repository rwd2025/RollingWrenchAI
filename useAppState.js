import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppState = create(
  persist(
    (set, get) => {
      let ws = null;
      let reconnectTimeout = null;
      let reconnectAttempts = 0;
      let telemetryBuffer = {};
      let animationFrameId = null;

      const flushTelemetryBuffer = () => {
        if (Object.keys(telemetryBuffer).length > 0) {
          set((state) => ({ telemetry: { ...state.telemetry, ...telemetryBuffer } }));
          telemetryBuffer = {};
        }
        animationFrameId = null;
      };

      return {
        activeTruck: { vin: null, make: null, model: null, esn: null },
        userSettings: { units: 'Imperial', offlineMode: false },
        repairHistory: [],
        isWsConnected: false,
        telemetry: { engine_rpm: 0, boost_pressure: 0, coolant_temp: 0, oil_temp: 0 },
        activeFaults: [],
        latestAiReport: null,
        isAiAnalyzing: false,

        setOfflineMode: (status) => set((state) => ({ userSettings: { ...state.userSettings, offlineMode: status } })),
        clearAiReport: () => set({ latestAiReport: null }),
        clearFaultContainer: () => set({ activeFaults: [] }),

        processIncomingFaults: (incomingFaults = []) => set((state) => {
          const systemTime = new Date().toISOString();
          const updatedFaults = state.activeFaults.map(existing => {
            const stillActive = incomingFaults.some(inc => inc.spn === existing.spn && inc.fmi === existing.fmi);
            if (!stillActive && existing.status === 'ACTIVE') return { ...existing, status: 'INACTIVE', resolvedAt: systemTime };
            return existing;
          });
          incomingFaults.forEach(inc => {
            const match = updatedFaults.find(ex => ex.spn === inc.spn && ex.fmi === inc.fmi);
            if (!match) updatedFaults.push({ spn: inc.spn, fmi: inc.fmi, description: inc.description || '', status: 'ACTIVE', firstSeen: systemTime, resolvedAt: null });
            else if (match.status !== 'ACTIVE') { match.status = 'ACTIVE'; match.resolvedAt = null; }
          });
          return { activeFaults: updatedFaults };
        }),

        queueTelemetryUpdate: (incomingData = {}) => {
          telemetryBuffer = { ...telemetryBuffer, ...incomingData };
          if (!animationFrameId) animationFrameId = requestAnimationFrame(flushTelemetryBuffer);
        },

        connectDataBus: (url) => {
          if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
          ws = new WebSocket(url);
          ws.onopen = () => { reconnectAttempts = 0; if (reconnectTimeout) clearTimeout(reconnectTimeout); set({ isWsConnected: true }); };
          ws.onmessage = (event) => {
            let packet;
            try { packet = JSON.parse(event.data); } catch { return; }
            if (packet.type === 'TELEMETRY') get().queueTelemetryUpdate(packet.payload);
            else if (packet.type === 'DM1_BROADCAST') { set({ isAiAnalyzing: true }); get().processIncomingFaults(packet.payload); }
            else if (packet.type === 'VEHICLE_HANDSHAKE') set({ activeTruck: packet.payload });
            else if (packet.type === 'AI_DIAGNOSTIC_REPORT') set({ latestAiReport: packet.payload, isAiAnalyzing: false });
          };
          ws.onclose = () => {
            set({ isWsConnected: false });
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            reconnectAttempts++;
            const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            reconnectTimeout = setTimeout(() => get().connectDataBus(url), backoffDelay);
          };
          ws.onerror = () => { try { ws.close(); } catch {} };
        },

        disconnectDataBus: () => {
          if (ws) { ws.close(); ws = null; }
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          set({ isWsConnected: false });
        }
      };
    },
    { name: 'diesel-doctor-state-v1', storage: createJSONStorage(() => localStorage), partialize: (state) => ({ activeTruck: state.activeTruck, userSettings: state.userSettings, repairHistory: state.repairHistory }) }
  )
);
