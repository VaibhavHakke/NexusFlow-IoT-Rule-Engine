import React from 'react';

const PALETTE = [
  { type: 'sensorSource', label: 'Data Source', badge: 'SRC', hint: 'Sensor / device feed' },
  { type: 'mathOp', label: 'Math Operation', badge: 'FX', hint: 'Filter, average, transform' },
  { type: 'actionTrigger', label: 'Action Trigger', badge: 'ACT', hint: 'Condition + alert' },
];

export default function Sidebar({ onSave, onActivate, isActive, graphName, onNameChange, saving, onAddNode }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/nexusflow-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="nf-sidebar">
      <div className="nf-sidebar__section">
        <div className="nf-eyebrow mono">01 · NODE LIBRARY</div>
        <p className="nf-sidebar__hint">
          Drag a node onto the canvas — or just click it to drop it automatically.
        </p>

        {PALETTE.map((item) => (
          <div
            key={item.type}
            className={`nf-palette-item nf-palette-item--${item.type}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            onClick={() => onAddNode?.(item.type)}
            role="button"
            tabIndex={0}
          >
            <span className="nf-palette-item__badge mono">{item.badge}</span>
            <div>
              <div className="nf-palette-item__label">{item.label}</div>
              <div className="nf-palette-item__hint">{item.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="nf-sidebar__section">
        <div className="nf-eyebrow mono">02 · GRAPH</div>
        <input
          className="nf-input mono"
          value={graphName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Rule graph name"
        />
        <button className="nf-btn nf-btn--ghost" onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save graph'}
        </button>
        <button
          className={`nf-btn ${isActive ? 'nf-btn--active' : 'nf-btn--primary'}`}
          onClick={onActivate}
        >
          {isActive ? '● Rule engine running' : '▶ Compile & run'}
        </button>
      </div>

      <div className="nf-sidebar__section nf-sidebar__section--footer">
        <div className="nf-eyebrow mono">DEMO DATA</div>
        <p className="nf-sidebar__hint">
          3 mock devices (<span className="mono">turbine-01</span>,{' '}
          <span className="mono">turbine-02</span>, <span className="mono">pump-01</span>) are
          streaming synthetic readings right now, including occasional spikes, so you can test
          rules end-to-end before wiring up real hardware.
        </p>
      </div>
    </aside>
  );
}