import React from 'react';
import { Handle, Position } from 'reactflow';

const CONDITIONS = [
  { value: 'gt', label: '>' },
  { value: 'gte', label: '>=' },
  { value: 'lt', label: '<' },
  { value: 'lte', label: '<=' },
  { value: 'eq', label: '==' },
];

export default function ActionNode({ data, selected }) {
  return (
    <div className={`nf-node nf-node--action ${selected ? 'is-selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="nf-handle" />
      <div className="nf-node__badge nf-node__badge--action mono">ACT</div>
      <div className="nf-node__body">
        <div className="nf-node__title">{data.label || 'SMS Alert'}</div>

        <div className="nf-node__row">
          <select
            className="nf-node__select mono nf-node__select--sm"
            value={data.condition || 'gt'}
            onChange={(e) => data.onChange?.({ condition: e.target.value })}
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            className="mono nf-node__number"
            type="number"
            step="0.1"
            value={data.threshold ?? 80}
            onChange={(e) => data.onChange?.({ threshold: e.target.value })}
          />
        </div>

        <textarea
          className="nf-node__textarea mono"
          rows={2}
          placeholder="Alert message..."
          value={data.message || ''}
          onChange={(e) => data.onChange?.({ message: e.target.value })}
        />
      </div>
    </div>
  );
}