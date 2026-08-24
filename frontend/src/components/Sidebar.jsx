export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="brand">NexusFlow</h1>

      <div className="line"></div>

      <nav>
        <div className="nav-item active">📊 Dashboard</div>
        <div className="nav-item">🛰 Devices</div>
        <div className="nav-item">⚙ Rule Builder</div>
        <div className="nav-item">📡 Telemetry</div>
        <div className="nav-item">📈 Analytics</div>
        <div className="nav-item">👤 Profile</div>
      </nav>

      <div className="sidebar-footer">
        <small>Version 1.0</small>
      </div>
    </aside>
  );
}