import { useEffect, useState, useCallback, useRef } from 'react';
import { DEMO_MODE, WS_URL } from '../config.js';
import { DEMO_DEVICES } from '../data/demoDevices.js';
import * as demoEngine from '../services/demoEngine.js';

const MAX_POINTS = 60;

export default function useTelemetryEngine() {
  const [connectionStatus, setConnectionStatus] = useState(DEMO_MODE ? 'open' : 'connecting');
  const [devices, setDevices] = useState(DEMO_MODE ? DEMO_DEVICES : []);
  const [seriesByDevice, setSeriesByDevice] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [activeEdgeIds, setActiveEdgeIds] = useState(new Set());
  const [isActive, setIsActive] = useState(false);

  const socketRef = useRef(null);
  const savedGraphIdRef = useRef(null);

  const appendPoint = useCallback((deviceId, value) => {
    setSeriesByDevice((prev) => {
      const existing = prev[deviceId] || [];
      return { ...prev, [deviceId]: [...existing, { value, ts: Date.now() }].slice(-MAX_POINTS) };
    });
  }, []);

  const flashEdges = useCallback((edgeIds) => {
    setActiveEdgeIds(new Set(edgeIds));
    setTimeout(() => setActiveEdgeIds(new Set()), 600);
  }, []);

  // DEMO MODE (no backend) — unchanged
  useEffect(() => {
    if (!DEMO_MODE) return;

    demoEngine.startDemoGenerator(1000);
    const sub = demoEngine.telemetry$.subscribe((reading) => {
      appendPoint(reading.deviceId, reading.value);
    });

    return () => {
      sub.unsubscribe();
      demoEngine.stopDemoGenerator();
      demoEngine.stopActiveGraph();
    };
  }, [appendPoint]);

  // REAL MODE — talks to the actual backend + MongoDB via REST + WebSocket
  useEffect(() => {
    if (DEMO_MODE) return;

    let pollInterval;

    // 1. Load device list from backend
    const loadDevices = async () => {
      try {
        const res = await fetch('/api/telemetry/devices');
        const data = await res.json();
        setDevices(data);
      } catch (err) {
        console.error('Failed to load devices:', err);
        setDevices([]);
      }
    };
    loadDevices();
    pollInterval = setInterval(loadDevices, 5000);

    // 2. Hydrate recent history for each device so chart isn't empty on load
    const hydrateHistory = async () => {
      try {
        const res = await fetch('/api/telemetry/devices');
        const list = await res.json();
        for (const d of list) {
          const histRes = await fetch(`/api/telemetry/${d.deviceId}/recent?limit=${MAX_POINTS}`);
          const rows = await histRes.json();
          setSeriesByDevice((prev) => ({
            ...prev,
            [d.deviceId]: rows.map((r) => ({ value: r.value, ts: new Date(r.timestamp).getTime() })),
          }));
        }
      } catch (err) {
        console.error('Failed to hydrate history:', err);
      }
    };
    hydrateHistory();

    // 3. Connect WebSocket for live updates — this was the broken part
    const connect = () => {
      setConnectionStatus('connecting');
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => setConnectionStatus('open');
      socket.onclose = () => {
        setConnectionStatus('closed');
        setTimeout(connect, 2000);
      };
      socket.onerror = () => socket.close();

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'alert') {
            setAlerts((prev) => [msg.payload, ...prev].slice(0, 100));
          } else if (msg.type === 'value_update') {
            appendPoint(msg.payload.deviceId, msg.payload.value);
          } else if (msg.type === 'edge_activity') {
            flashEdges(msg.edgeIds || []);
          }
        } catch {
          /* ignore malformed messages */
        }
      };
    };

    connect();

    return () => {
      clearInterval(pollInterval);
      socketRef.current?.close();
    };
  }, [appendPoint, flashEdges]);

  const activateGraph = useCallback(
    async (graph, graphName) => {
      if (DEMO_MODE) {
        demoEngine.compileAndRun(graph, {
          onEdgeActivity: flashEdges,
          onAlert: (alert) => setAlerts((prev) => [alert, ...prev].slice(0, 100)),
          onValueUpdate: () => {},
        });
        setIsActive(true);
        return { ok: true };
      }

      try {
        let id = savedGraphIdRef.current;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/graphs/${id}` : '/api/graphs';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: graphName, ...graph }),
        });
        const saved = await res.json();
        savedGraphIdRef.current = saved._id;

        await fetch(`/api/graphs/${saved._id}/activate`, { method: 'POST' });
        setIsActive(true);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    },
    [flashEdges]
  );

  const saveGraph = useCallback(async (graph, graphName) => {
    if (DEMO_MODE) {
      return { ok: true, id: 'demo-local' };
    }
    try {
      let id = savedGraphIdRef.current;
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/graphs/${id}` : '/api/graphs';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: graphName, ...graph }),
      });
      const saved = await res.json();
      savedGraphIdRef.current = saved._id;
      return { ok: true, id: saved._id };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  return {
    demoMode: DEMO_MODE,
    connectionStatus,
    devices,
    seriesByDevice,
    alerts,
    activeEdgeIds,
    isActive,
    activateGraph,
    saveGraph,
  };
}