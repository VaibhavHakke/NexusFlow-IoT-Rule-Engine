import React from 'react';

export default function AlertPopup({ alert, onClose }) {
  if (!alert) return null;

  return (
    <div className="nf-alertpopup">
      <div className="nf-alertpopup__icon">⚠</div>
      <div className="nf-alertpopup__body">
        <div className="nf-alertpopup__top">
          <span className="mono nf-alertpopup__device">{alert.deviceId}</span>
          <span className="mono nf-alertpopup__time">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="nf-alertpopup__msg">{alert.message}</div>
        <div className="mono nf-alertpopup__value">
          Reading: {typeof alert.value === 'number' ? alert.value.toFixed(2) : alert.value}
        </div>
      </div>
      <button className="nf-alertpopup__close" onClick={onClose} aria-label="Dismiss alert">
        ×
      </button>
    </div>
  );
}