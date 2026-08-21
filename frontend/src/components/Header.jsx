export default function Header() {
  return (
    <header
      style={{
        height: "70px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: "1px solid #eee",
      }}
    >
      <h2 style={{ color: "#2563eb" }}>NexusFlow</h2>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <span>🔔</span>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#2563eb",
            color: "#fff",
            display: "grid",
            placeItems: "center",
          }}
        >
          T
        </div>
      </div>
    </header>
  );
}