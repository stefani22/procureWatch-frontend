import { useState } from "react";

const TABS = ["planned", "tenders", "signed", "decisions"];

export default function InstitutionDetailPage({ proc, onBack }) {
    const [activeTab, setActiveTab] = useState("planned");

    return (
        <div>
            <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#2563eb", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 20, padding: 0 }}>
                ← Back to planned procurements
            </button>

            {/* Header */}
            <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #dbeafe, #bfdbfe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🏛️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>Ministry</div>
                        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 900, color: "#1e3a5f" }}>{proc.institution}</h2>
                        <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#6b7280", flexWrap: "wrap" }}>
                            <span>📍 Ilindenska bb, Skopje, Macedonia</span>
                            <span>🌐 www.gov.mk</span>
                            <span>📞 +38923249567</span>
                            <span>✉️ info@gov.mk</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {[
                        ["📋", "Planned procurements", proc.planned],
                        ["📢", "Tender notices",        proc.tenders],
                        ["✍️", "Signed contracts",      proc.signed],
                        ["⚖️", "Decisions",             proc.decisions],
                    ].map(([icon, label, val]) => (
                        <div key={label} style={{ background: "#f0f6ff", borderRadius: 12, padding: "14px 18px", flex: 1, minWidth: 120, border: "1px solid #dbeafe" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                <span style={{ fontSize: 18 }}>{icon}</span>
                                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{label}</span>
                            </div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#1e3a5f" }}>{val}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: "white", borderRadius: "12px 12px 0 0", border: "1px solid #dbeafe", borderBottom: "none", overflow: "hidden" }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{ flex: 1, padding: "12px", border: "none", cursor: "pointer", fontSize: 13,
                                fontWeight: activeTab === tab ? 700 : 500,
                                color: activeTab === tab ? "#1e40af" : "#6b7280",
                                background: activeTab === tab ? "#eff6ff" : "white",
                                borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
                                transition: "all 0.15s" }}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ✓
                    </button>
                ))}
            </div>

            {/* Notices */}
            <div style={{ background: "white", borderRadius: "0 0 14px 14px", border: "1px solid #dbeafe", borderTop: "none" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>All notices</h3>
                </div>
                {proc.notices.map(notice => (
                    <div key={notice.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Notice id: {notice.id}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", marginBottom: 2 }}>{notice.title}</div>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>{notice.date}</div>
                        </div>
                        <button style={{ padding: "6px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                            Show notice →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
