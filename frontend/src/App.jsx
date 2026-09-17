import "./App.css";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Home from './pages/Home.jsx';
import Builder from './pages/Builder.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AlertPopup from './components/AlertPopup.jsx';
import useTelemetryEngine from './hooks/useTelemetryEngine.js';
import playAlertSound from './utils/alertSound.js';


const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'builder', label: 'Rule Builder' },
  { id: 'dashboard', label: 'Live Dashboard' },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [graphName, setGraphName] = useState('Turbine Overheat Watch');
  const [currentGraph, setCurrentGraph] = useState({ nodes: [], edges: [] });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [popupAlert, setPopupAlert] = useState(null);

  const prevAlertCountRef = useRef(0);

  const {
    demoMode,
    connectionStatus,
    devices,
    seriesByDevice,
    alerts,
    activeEdgeIds,
    isActive,
    activateGraph,
    saveGraph,
  } = useTelemetryEngine();

  // Whenever a NEW alert arrives (array grows), pop up a banner + play a beep.
  useEffect(() => {
    if (alerts.length > prevAlertCountRef.current) {
      const latest = alerts[0];
      setPopupAlert(latest);
      playAlertSound();
      const t = setTimeout(() => setPopupAlert(null), 6000);
      prevAlertCountRef.current = alerts.length;
      return () => clearTimeout(t);
    }
    prevAlertCountRef.current = alerts.length;
  }, [alerts]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleGraphChange = useCallback((g) => setCurrentGraph(g), []);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveGraph(currentGraph, graphName);
    setSaving(false);
    showToast(res.ok ? '✓ Graph saved' : `✗ ${res.error || 'Save failed'}`);
  };

  const handleActivate = async () => {
    if (currentGraph.nodes.length === 0) {
      showToast('✗ Add at least a Sensor + Action node first');
      return;
    }
    const res = await activateGraph(currentGraph, graphName);
    showToast(res.ok ? '▶ Rule engine compiled & running' : `✗ ${res.error || 'Activation failed'}`);
    if (res.ok) setPage('dashboard');
  };

  const statusColor =
    connectionStatus === 'open' ? '#6fd08c' : connectionStatus === 'connecting' ? '#f0a94e' : '#f0554f';

  return (
    <div className="nf-app">
      <header className="nf-topbar">
        <div className="nf-topbar__brand" onClick={() => setPage('home')} role="button">
          <span className="nf-topbar__logo">◆</span>
          <span className="nf-topbar__name">NEXUSFLOW</span>
        </div>

        <nav className="nf-topbar__nav">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={`nf-navlink ${page === p.id ? 'is-active' : ''}`}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <div className="nf-topbar__status">
          <span className="nf-dot" style={{ background: statusColor }} />
          <span className="mono">{demoMode ? 'DEMO DATA' : connectionStatus.toUpperCase()}</span>
        </div>
      </header>

      <AlertPopup alert={popupAlert} onClose={() => setPopupAlert(null)} />

      {page === 'home' && <Home onEnter={setPage} demoMode={demoMode} />}

      {page === 'builder' && (
        <Builder
          devices={devices}
          activeEdgeIds={activeEdgeIds}
          onGraphChange={handleGraphChange}
          graphName={graphName}
          onNameChange={setGraphName}
          onSave={handleSave}
          onActivate={handleActivate}
          isActive={isActive}
          saving={saving}
        />
      )}

      {page === 'dashboard' && (
        <DashboardPage seriesByDevice={seriesByDevice} alerts={alerts} isActive={isActive} />
      )}

      {toast && <div className="nf-toast mono">{toast}</div>}
    </div>
  );
}