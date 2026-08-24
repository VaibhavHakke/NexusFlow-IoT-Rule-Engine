import "./DevicesPage.css";

const devices = [
  { id: "ESP32-001", location: "Lab A", status: "Online", temp: "28°C" },
  { id: "ESP32-002", location: "Room 201", status: "Online", temp: "31°C" },
  { id: "NODE-101", location: "Warehouse", status: "Offline", temp: "--" },
  { id: "ESP32-005", location: "Factory", status: "Online", temp: "26°C" },
];

export default function DevicesPage() {
  return (
    <div className="devices-page">
      <div className="page-header">
        <div>
          <h1>Connected Devices</h1>
          <p>Monitor all IoT devices in real time</p>
        </div>

        <button className="add-btn">+ Add Device</button>
      </div>

      <div className="device-table-card">
        <table className="device-table">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Location</th>
              <th>Status</th>
              <th>Temperature</th>
            </tr>
          </thead>

          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.location}</td>
                <td>
                  <span
                    className={
                      device.status === "Online"
                        ? "status online"
                        : "status offline"
                    }
                  >
                    {device.status}
                  </span>
                </td>
                <td>{device.temp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}