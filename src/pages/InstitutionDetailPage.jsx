

import { useState, useEffect } from "react";
import {
    getNoticesByInstitution,
    getContractsByInstitution,
    getDecisionsByInstitution,
    getProcurementPlansByInstitution,
    getRiskAssessment,
} from "../services/api";

import { getRiskColor, getRiskLabel } from "../utils/helpers";
import RiskGauge from "../components/RiskGauge";

const TABS = ["plans", "notices", "contracts", "decisions"];

export default function InstitutionDetailPage({ inst, onBack }) {
    const [activeTab, setActiveTab] = useState("notices");

    // Data per tab
    const [notices,   setNotices]   = useState([]);
    const [contracts, setContracts] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [plans,     setPlans]     = useState([]);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        if (!inst?.id) return;
        setLoading(true);
        Promise.all([
            getNoticesByInstitution(inst.id),
            getContractsByInstitution(inst.id),
            getDecisionsByInstitution(inst.id),
            getProcurementPlansByInstitution(inst.id),
        ])
            .then(([n, c, d, p]) => {
                setNotices(n);
                setContracts(c);
                setDecisions(d);
                setPlans(p);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [inst?.id]);

    const tabCount = {
        plans:     plans.length,
        notices:   notices.length,
        contracts: contracts.length,
        decisions: decisions.length,
    };

    return (
        <div>
            {/* Back */}
            <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#2563eb", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 20, padding: 0 }}>
                ← Back to planned procurements
            </button>

            {/* Header */}
            <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #dbeafe, #bfdbfe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🏛️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>{inst.type || "Institution"}</div>
                        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 900, color: "#1e3a5f" }}>{inst.name}</h2>
                        <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#6b7280", flexWrap: "wrap" }}>
                            {inst.city     && <span>📍 {inst.city}</span>}
                            {inst.category && <span>🏷️ {inst.category}</span>}
                            {inst.sourceUrl && <a href={inst.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>🌐 Source</a>}
                        </div>
                    </div>
                </div>

                {/* Mini stat cards */}
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {[
                        ["📅", "Plans",     plans.length],
                        ["📢", "Notices",   notices.length],
                        ["✍️", "Contracts", contracts.length],
                        ["⚖️", "Decisions", decisions.length],
                    ].map(([icon, label, val]) => (
                        <div key={label} style={{ background: "#f0f6ff", borderRadius: 12, padding: "14px 18px", flex: 1, minWidth: 100, border: "1px solid #dbeafe" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                <span style={{ fontSize: 18 }}>{icon}</span>
                                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{label}</span>
                            </div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#1e3a5f" }}>{loading ? "…" : val}</div>
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
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {!loading && <span style={{ marginLeft: 6, fontSize: 11, background: "#dbeafe", color: "#2563eb", borderRadius: 10, padding: "1px 7px", fontWeight: 700 }}>{tabCount[tab]}</span>}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div style={{ background: "white", borderRadius: "0 0 14px 14px", border: "1px solid #dbeafe", borderTop: "none", marginBottom: 24 }}>
                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading data…</div>
                ) : (
                    <>
                        {/* NOTICES */}
                        {activeTab === "notices" && (
                            <>
                                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>Notices ({notices.length})</h3>
                                </div>
                                {notices.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No notices found.</div>
                                ) : notices.map(n => (
                                    <div key={n.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Notice: {n.noticeNumber}</div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", marginBottom: 2 }}>{n.title}</div>
                                            <div style={{ fontSize: 11, color: "#6b7280" }}>{n.contractType} · Deadline: {n.deadline}</div>
                                        </div>
                                        {n.sourceUrl && (
                                            <a href={n.sourceUrl} target="_blank" rel="noreferrer"
                                               style={{ padding: "6px 14px", background: "#2563eb", color: "white", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                                                View →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}

                        {/* CONTRACTS */}
                        {activeTab === "contracts" && (
                            <>
                                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>Contracts ({contracts.length})</h3>
                                </div>
                                {contracts.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No contracts found.</div>
                                ) : contracts.map(c => (
                                    <div key={c.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Notice: {c.noticeNumber}</div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", marginBottom: 2 }}>{c.subject}</div>
                                            <div style={{ fontSize: 11, color: "#6b7280" }}>{c.date} · {c.amount?.toLocaleString()} {c.currency}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* DECISIONS */}
                        {activeTab === "decisions" && (
                            <>
                                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>Decisions ({decisions.length})</h3>
                                </div>
                                {decisions.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No decisions found.</div>
                                ) : decisions.map(d => (
                                    <div key={d.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb" }}>
                                        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Notice: {d.noticeNumber} · {d.date}</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", marginBottom: 2 }}>{d.subject}</div>
                                        <div style={{ fontSize: 11, color: "#6b7280" }}>{d.procedureType}</div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* PLANS */}
                        {activeTab === "plans" && (
                            <>
                                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>Procurement Plans ({plans.length})</h3>
                                </div>
                                {plans.length === 0 ? (
                                    <div style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No plans found.</div>
                                ) : plans.map(plan => (
                                    <div key={plan.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb" }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", marginBottom: 8 }}>
                                            Plan {plan.year} · Published: {plan.publicationDate}
                                        </div>
                                        {plan.planItems.length > 0 && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                {plan.planItems.map(item => (
                                                    <div key={item.id} style={{ background: "#f8faff", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#374151" }}>
                                                        <strong>{item.subject}</strong>
                                                        {item.cpvCode && <span style={{ color: "#6b7280", marginLeft: 8 }}>CPV: {item.cpvCode}</span>}
                                                        {item.contractType && <span style={{ color: "#6b7280", marginLeft: 8 }}>· {item.contractType}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

