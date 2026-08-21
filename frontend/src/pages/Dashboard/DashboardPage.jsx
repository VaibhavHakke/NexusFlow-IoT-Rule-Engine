import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./DashboardPage.css";

export default function DashboardPage() {

  const cards = [
    { title: "Connected Devices", value: 24 },
    { title: "Telemetry Events", value: 1520 },
    { title: "Active Rules", value: 8 },
    { title: "Alerts Today", value: 12 }
  ];

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="content">

        <Header />

        <div className="body">

          <div className="welcome">
            <h1>Dashboard</h1>
            <p>Welcome back, Tasneem 👋</p>
          </div>

          <div className="card-grid">
            {cards.map((card) => (
              <div className="card" key={card.title}>
                <h2>{card.value}</h2>
                <p>{card.title}</p>
              </div>
            ))}
          </div>

          <div className="bottom-grid">

            <div className="panel">
              <h3>Recent Activity</h3>

              <div className="activity">
                <span>🟢 Sensor A</span>
                <span>Online</span>
              </div>

              <div className="activity">
                <span>🟡 Temperature</span>
                <span>32°C</span>
              </div>

              <div className="activity">
                <span>🔴 Alert</span>
                <span>High Voltage</span>
              </div>
            </div>

            <div className="panel">
              <h3>System Status</h3>

              <div className="status-item">
                <span>Server</span>
                <strong className="green">Healthy</strong>
              </div>

              <div className="status-item">
                <span>Database</span>
                <strong className="green">Connected</strong>
              </div>

              <div className="status-item">
                <span>Rule Engine</span>
                <strong className="blue">Running</strong>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}