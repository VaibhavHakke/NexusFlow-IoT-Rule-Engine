import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/dashboard/StatCard";
import "./DashboardPage.css";

const stats = [
  { title: "Connected Devices", value: "24", color: "#2563eb", icon: "🛰" },
  { title: "Telemetry Events", value: "1,520", color: "#0ea5e9", icon: "📡" },
  { title: "Active Rules", value: "08", color: "#7c3aed", icon: "⚙" },
  { title: "Alerts Today", value: "12", color: "#dc2626", icon: "🚨" },
];

const activities = [
  { device: "ESP32-001", event: "Temperature Updated", time: "2 min ago" },
  { device: "ESP32-004", event: "Humidity Alert", time: "10 min ago" },
  { device: "NODE-101", event: "Device Offline", time: "18 min ago" },
];

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="content">
          <div className="welcome">
            <div>
              <h1>Welcome Back, Tasneem 👋</h1>
              <p>Monitor your IoT network in real time</p>
            </div>

            <button className="create-btn">+ Create Rule</button>
          </div>

          {/* Premium Reusable Stat Cards */}
          <div className="stats-grid">
            {stats.map((item) => (
              <StatCard
                key={item.title}
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </div>

          {/* Bottom Section */}
          <div className="bottom-grid">
            <div className="panel">
              <h3>Recent Activity</h3>

              {activities.map((a) => (
                <div className="activity" key={a.device + a.time}>
                  <div>
                    <strong>{a.device}</strong>
                    <p>{a.event}</p>
                  </div>

                  <span>{a.time}</span>
                </div>
              ))}
            </div>

            <div className="panel">
              <h3>System Health</h3>

              <div className="health">
                <div>
                  <span>Server</span>
                  <strong className="green">Healthy</strong>
                </div>

                <div>
                  <span>MongoDB</span>
                  <strong className="green">Connected</strong>
                </div>

                <div>
                  <span>Rule Engine</span>
                  <strong className="blue">Running</strong>
                </div>

                <div>
                  <span>API Status</span>
                  <strong className="green">Live</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Chart */}
          <div className="panel chart-panel">
            <h3>Telemetry Overview</h3>

            <div className="bars">
              <div className="bar b1"></div>
              <div className="bar b2"></div>
              <div className="bar b3"></div>
              <div className="bar b4"></div>
              <div className="bar b5"></div>
              <div className="bar b6"></div>
              <div className="bar b7"></div>
            </div>

            <div className="days">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}