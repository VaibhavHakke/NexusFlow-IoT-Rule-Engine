import React from 'react';

const WORKFLOW = [
  { step: '01', title: 'Design', body: 'Build the rule visually on a drag-and-drop canvas — sensor, transform, condition.' },
  { step: '02', title: 'Compile', body: 'The graph is parsed into a live RxJS pipeline the moment you click run.' },
  { step: '03', title: 'Execute', body: 'The pipeline evaluates every incoming reading in real time and fires alerts.' },
];

const MODULES = [
  { tag: 'REACT · REACT FLOW', title: 'Visual Graph Builder', body: 'Node-based canvas for composing sensor, transform, and action logic without writing code.' },
  { tag: 'MONGODB 5.0+', title: 'Time-Series Database', body: 'Native Time-Series collections for high-ingest, append-only telemetry at scale.' },
  { tag: 'NODE.JS · RXJS', title: 'Stream Compiler', body: 'Converts a saved graph into reactive Observables that evaluate rules continuously.' },
  { tag: 'EXPRESS · WEBSOCKETS', title: 'Ingestion API', body: 'High-throughput endpoints for device telemetry and real-time alert broadcast.' },
];

const STACK = ['React', 'React Flow', 'Recharts', 'Node.js', 'Express', 'RxJS', 'MongoDB', 'WebSocket'];

export default function Home({ onEnter, demoMode }) {
  return (
    <div className="nf-home blueprint-grid">
      <div className="nf-home__inner">
        <section className="nf-hero">
          <div className="nf-eyebrow mono">NEXUSFLOW</div>
          <h1 className="nf-hero__title">Visual IoT Telemetry &amp; Rule Engine</h1>
          <p className="nf-hero__sub">
            A no-code rule builder for high-frequency sensor data — design a condition visually,
            run it against a live telemetry stream, and get notified the moment it trips.
          </p>
          <div className="nf-hero__cta">
            <button className="nf-btn nf-btn--primary nf-btn--lg" onClick={() => onEnter('builder')}>
              Open Rule Builder
            </button>
            <button className="nf-btn nf-btn--ghost nf-btn--lg" onClick={() => onEnter('dashboard')}>
              View Live Dashboard
            </button>
          </div>
          <div className={`nf-status-pill mono ${demoMode ? 'is-demo' : 'is-live'}`}>
            <span className="nf-dot" />
            {demoMode ? 'Demo data' : 'Live backend · MongoDB'}
          </div>
        </section>

        <section className="nf-section">
          <div className="nf-eyebrow mono">HOW IT WORKS</div>
          <div className="nf-workflow">
            {WORKFLOW.map((w) => (
              <div key={w.step} className="nf-workflow__item">
                <span className="nf-workflow__step mono">{w.step}</span>
                <div className="nf-workflow__title">{w.title}</div>
                <p className="nf-workflow__body">{w.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="nf-section">
          <div className="nf-eyebrow mono">SYSTEM MODULES</div>
          <div className="nf-home__modules">
            {MODULES.map((m) => (
              <div key={m.title} className="nf-module-card">
                <div className="nf-module-card__tag mono">{m.tag}</div>
                <div className="nf-module-card__title">{m.title}</div>
                <p className="nf-module-card__body">{m.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="nf-stack">
          {STACK.map((s) => (
            <span key={s} className="nf-stack__chip mono">{s}</span>
          ))}
        </section>
      </div>
    </div>
  );
}