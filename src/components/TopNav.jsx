const NAV_ITEMS = [
    { id: "dashboard",    label: "Dashboard" },
    { id: "contracts",    label: "Contracts" },
    { id: "highrisk",     label: "🚨 High Risk Queue" },
    { id: "procurements", label: "Planned Procurements" },
    { id: "institutions", label: "Institutions" },
    { id: "riskanalysis", label: "Risk Analysis" },
    { id: "reports",      label: "Reports" },
];

export default function TopNav({ page, setPage, onLogout, user }) {
    return (
        <header style={{ background: "#dbeafe", borderBottom: "1px solid #bfdbfe", position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 24px" }}>

                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 28 }}>
                    <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #1e4d8c, #2563eb)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🔍</div>
                    <span style={{ fontSize: 17, fontWeight: 900, color: "#1e3a5f" }}>
                        Procure<span style={{ color: "#2563eb" }}>Watch</span>
                    </span>
                </div>

                {/* Nav links */}
                <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, flexWrap: "wrap" }}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            style={{
                                padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                                fontSize: 13, fontWeight: page === item.id ? 700 : 500,
                                color: item.id === "highrisk"
                                    ? (page === item.id ? "#dc2626" : "#b91c1c")
                                    : (page === item.id ? "#1e40af" : "#4b5563"),
                                background: page === item.id
                                    ? (item.id === "highrisk" ? "#fef2f2" : "white")
                                    : "transparent",
                                boxShadow: page === item.id ? "0 1px 4px rgba(30,58,95,0.12)" : "none",
                                transition: "all 0.15s",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Right: user + logout */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white", fontWeight: 700 }}>
                                {user.username ? user.username[0].toUpperCase() : "U"}
                            </div>
                            <div style={{ fontSize: 12, lineHeight: 1.3 }}>
                                <div style={{ fontWeight: 700, color: "#1e3a5f" }}>{user.username}</div>
                                <div style={{ color: "#6b7280", fontSize: 10 }}>{user.role}</div>
                            </div>
                        </div>
                    )}
                    <button onClick={onLogout} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#dc2626" }}>
                        Sign Out
                    </button>
                </div>

            </div>
        </header>
    );
}
