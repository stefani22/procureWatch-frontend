export default function StatCard({ icon, label, value, change, up }) {
    return (
        <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", flex: 1, minWidth: 130, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#1e3a5f" }}>{value}</span>
                {change && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: up ? "#22c55e" : "#ef4444" }}>
                        {up ? "↑" : "↓"}{change}
                    </span>
                )}
            </div>
        </div>
    );
}
