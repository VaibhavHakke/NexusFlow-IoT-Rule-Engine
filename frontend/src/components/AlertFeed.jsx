import React from 'react';

export default function AlertFeed({ alerts }) {
  return (
    <div className="nf-alerts">
      <div className="nf-eyebrow mono">04 · ALERT FEED</div>
      {alerts.length === 0 && <div className="nf-empty mono">No rules have fired yet.</div>}
      <div className="nf-alerts__list">
        {alerts.map((a, i) => (
          <div key={i} className="nf-alert-item">
            <div className="nf-alert-item__bar" />
            <div>
              <div className="nf-alert-item__top">
                <span className="mono nf-alert-item__device">{a.deviceId}</span>
                <span className="mono nf-alert-item__time">
                  {new Date(a.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="nf-alert-item__msg">{a.message}</div>
              <div className="mono nf-alert-item__value">
                value: {typeof a.value === 'number' ? a.value.toFixed(2) : a.value} · via {a.actionType || 'sms'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}