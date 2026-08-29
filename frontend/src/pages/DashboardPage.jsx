import React from 'react';
import Dashboard from '../components/Dashboard.jsx';
import AlertFeed from '../components/AlertFeed.jsx';

export default function DashboardPage({ seriesByDevice, alerts, isActive }) {
  return (
    <div className="nf-page nf-page--dashboard">
      {!isActive && (
        <div className="nf-banner mono">
          No rule graph is running yet — raw telemetry is still live below. Head to the{' '}
          <b>Rule Builder</b> to wire up a rule and see alerts fire here.
        </div>
      )}
      <div className="nf-page--dashboard__grid">
        <Dashboard seriesByDevice={seriesByDevice} />
        <AlertFeed alerts={alerts} />
      </div>
    </div>
  );
}