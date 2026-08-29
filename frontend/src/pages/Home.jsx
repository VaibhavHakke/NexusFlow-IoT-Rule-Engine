import React from 'react';

const MODULES = [
  {
    tag: 'REACT · REACT FLOW',
    title: 'Visual Graph Builder',
    body: 'A node-based canvas where a non-technical factory floor manager drags a sensor, a filter, and an alert node onto the canvas and wires them together — no code required.',
  },
  {
    tag: 'MONGODB 5.0+',
    title: 'Time-Series Database',
    body: 'Native MongoDB Time-Series collections built for high-ingest, append-only sensor data — efficient storage and fast range queries at scale.',
  },
  {
    tag: 'NODE.JS · RXJS',
    title: 'Stream Compiler',
    body: 'The backend parses the saved graph JSON and compiles it into live, reactive RxJS Observables — the same logic runs identically in this demo, right in your browser.',
  },
  {
    tag: 'EXPRESS · WEBSOCKETS',
    title: 'Ingestion API',
    body: 'High-throughput endpoints receive telemetry from real or mock hardware and broadcast alerts back to every connected dashboard instantly.',
  },
];

export default function Home({ onEnter, demoMode }) {
  return (
    <div className="nf-home blueprint-grid">
      <div className="nf-home__inner">
        <div className="nf-eyebrow mono">NEXUSFLOW · REAL-WORLD SYSTEM BUILD</div>
        <h1 className="nf-home__title">
          Turn a drag-and-drop canvas
          <br />
          into a live IoT rule engine.
        </h1>
        <p className="nf-home__lede">
          Hardcoding "if temperature &gt; 80°C, send an alert" means a developer in the loop
          for every business-rule change. NexusFlow lets a factory floor manager wire up a{' '}
          <span className="mono">Turbine Sensor</span> → <span className="mono">Moving Average</span> →{' '}
          <span className="mono">SMS Alert</span> pipeline visually — the backend compiles it into a
          running data stream instantly.
        </p>

        <div className="nf-home__cta">
          <button className="nf-btn nf-btn--primary nf-btn--lg" onClick={() => onEnter('builder')}>
            Open Rule Builder →
          </button>
          <button className="nf-btn nf-btn--ghost nf-btn--lg" onClick={() => onEnter('dashboard')}>
            View Live Dashboard
          </button>
        </div>

        <div className={`nf-home__badge mono ${demoMode ? 'is-demo' : 'is-live'}`}>
          {demoMode
            ? '● Running on synthetic demo data — no backend required'
            : '● Connected to live backend + MongoDB'}
        </div>

        <div className="nf-home__modules">
          {MODULES.map((m) => (
            <div key={m.title} className="nf-module-card">
              <div className="nf-module-card__tag mono">{m.tag}</div>
              <div className="nf-module-card__title">{m.title}</div>
              <p className="nf-module-card__body">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}