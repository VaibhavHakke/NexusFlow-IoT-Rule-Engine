import React from 'react';
import { Handle, Position } from 'reactflow';

export default function SensorNode({ data, selected }) {
  return (
    <div className={`nf-node nf-node--source ${selected ? 'is-selected' : ''}`}>
      <div className="nf-node__badge mono">SRC</div>
      <div className="nf-node__body">
        <div className="nf-node__title">{data.label || 'Sensor'}</div>
        <select
          className="nf-node__select mono"
          value={data.deviceId}
          onChange={(e) => data.onChange?.({ deviceId: e.target.value })}
        >
          {(data.devices || []).map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.deviceId}
            </option>
          ))}
        </select>
      </div>
      <Handle type="source" position={Position.Right} className="nf-handle" />
    </div>
  );
}