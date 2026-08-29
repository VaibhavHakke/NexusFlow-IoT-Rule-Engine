import React from 'react';
import { Handle, Position } from 'reactflow';

const OPERATIONS = [
  { value: 'movingAverage', label: 'Moving Average' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'add', label: 'Add Offset' },
  { value: 'delta', label: 'Delta (Δ)' },
];

export default function MathNode({ data, selected }) {
  const op = data.operation || 'movingAverage';

  return (
    <div className={`nf-node nf-node--math ${selected ? 'is-selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="nf-handle" />
      <div className="nf-node__badge mono">FX</div>
      <div className="nf-node__body">
        <select
          className="nf-node__select mono"
          value={op}
          onChange={(e) => data.onChange?.({ operation: e.target.value })}
        >
          {OPERATIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {op === 'movingAverage' && (
          <label className="nf-node__field mono">
            window
            <input
              type="number"
              min={2}
              max={50}
              value={data.windowSize || 5}
              onChange={(e) => data.onChange?.({ windowSize: e.target.value })}
            />
          </label>
        )}

        {op === 'multiply' && (
          <label className="nf-node__field mono">
            factor
            <input
              type="number"
              step="0.1"
              value={data.factor || 1}
              onChange={(e) => data.onChange?.({ factor: e.target.value })}
            />
          </label>
        )}

        {op === 'add' && (
          <label className="nf-node__field mono">
            amount
            <input
              type="number"
              step="0.1"
              value={data.amount || 0}
              onChange={(e) => data.onChange?.({ amount: e.target.value })}
            />
          </label>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="nf-handle" />
    </div>
  );
}