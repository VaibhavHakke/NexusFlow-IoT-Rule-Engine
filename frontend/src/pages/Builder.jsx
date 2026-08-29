import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Canvas from '../components/Canvas.jsx';

export default function Builder({
  devices,
  activeEdgeIds,
  onGraphChange,
  graphName,
  onNameChange,
  onSave,
  onActivate,
  isActive,
  saving,
}) {
  return (
    <div className="nf-page nf-page--builder">
      <Sidebar
        onSave={onSave}
        onActivate={onActivate}
        isActive={isActive}
        graphName={graphName}
        onNameChange={onNameChange}
        saving={saving}
      />
      <main className="nf-main">
        <Canvas devices={devices} activeEdgeIds={activeEdgeIds} onGraphChange={onGraphChange} />
      </main>
    </div>
  );
}