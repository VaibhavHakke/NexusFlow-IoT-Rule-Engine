export default function StatCard({ title, value, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >
      <div
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "16px",
          background: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          color: "#fff",
        }}
      >
        {icon}
      </div>

      <div>
        <h2 style={{ margin: 0 }}>{value}</h2>
        <p style={{ color: "#64748b", marginTop: "6px" }}>{title}</p>
      </div>
    </div>
  );
}