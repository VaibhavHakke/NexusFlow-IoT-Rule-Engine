import "./RuleBuilderPage.css";

const nodes = [
  { icon: "🌡", title: "Temperature Sensor", color: "#2563eb" },
  { icon: "💧", title: "Humidity Sensor", color: "#0ea5e9" },
  { icon: "⚡", title: "Voltage Sensor", color: "#7c3aed" },
  { icon: "🚨", title: "Send Alert", color: "#dc2626" },
];

export default function RuleBuilderPage() {
  return (
    <div className="rule-page">
      <div className="rule-header">
        <div>
          <h1>Rule Builder</h1>
          <p>Design IoT automation rules visually</p>
        </div>

        <button className="publish-btn">Publish Rule</button>
      </div>

      <div className="builder-layout">
        <aside className="node-panel">
          <h3>Node Library</h3>

          {nodes.map((node) => (
            <div className="node-card" key={node.title}>
              <div
                className="node-icon"
                style={{ background: node.color }}
              >
                {node.icon}
              </div>

              <span>{node.title}</span>
            </div>
          ))}
        </aside>

        <section className="canvas">
          <div className="canvas-box">

            <div className="flow-node sensor">
              🌡 Temperature
            </div>

            <div className="arrow">↓</div>

            <div className="flow-node condition">
              IF Temp &gt; 40°C
            </div>

            <div className="arrow">↓</div>

            <div className="flow-node action">
              🚨 Send Alert
            </div>

            <p className="canvas-note">
              React Flow integration will be added here.
            </p>

          </div>
        </section>
      </div>
    </div>
  );
}