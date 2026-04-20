import { useState } from "react";
import { MOCK_PROCUREMENTS } from "../data/mockData";
import { getRiskColor } from "../utils/helpers";
import StatCard     from "../components/StatCard";
import RiskBar      from "../components/RiskBar";
import RiskGauge    from "../components/RiskGauge";
import RedFlagBadge from "../components/RedFlagBadge";

export default function DashboardPage() {
    const procurements = MOCK_PROCUREMENTS;

    const [searchInstitution, setSearchInstitution] = useState("");
    const [searchDate,        setSearchDate]        = useState("");
    const [searchAmount,      setSearchAmount]      = useState("");
    const [filtered,          setFiltered]          = useState(procurements);
    const [searched,          setSearched]          = useState(false);

    const singleBidder = procurements.filter(p => p.redFlags.includes("Single Bidder")).length;
    const repeated     = procurements.filter(p => p.redFlags.includes("Repeated Supplier")).length;
    const highValue    = procurements.filter(p => p.redFlags.includes("High Value")).length;
    const avgRisk      = Math.round(procurements.reduce((a, p) => a + p.riskScore, 0) / procurements.length);

    const handleSearch = () => {
        const results = procurements.filter(p => {
            const matchInst   = !searchInstitution || p.institution.toLowerCase().includes(searchInstitution.toLowerCase());
            const matchDate   = !searchDate   || p.date.includes(searchDate);
            const matchAmount = !searchAmount || p.amount <= Number(searchAmount);
            return matchInst && matchDate && matchAmount;
        });
        setFiltered(results);
        setSearched(true);
    };

    const handleClear = () => {
        setSearchInstitution("");
        setSearchDate("");
        setSearchAmount("");
        setFiltered(procurements);
        setSearched(false);
    };

    const displayData = searched ? filtered : procurements;

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1e3a5f" }}>Welcome to ProcureWatch</h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Review of Public Procurement and Risk Detection</p>
            </div>

            {/* Stat cards */}
            <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
                <StatCard icon="📋" label="Planned Procurements" value="1,245" change="12%" up={true} />
                <StatCard icon="📢" label="Tender Notices"       value="678"   change="15%" up={true} />
                <StatCard icon="✍️" label="Signed Contracts"     value="932"   change="18%" up={true} />
                <StatCard icon="⚖️" label="Decisions"            value="305" />
            </div>

            {/* Search */}
            <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ flex: 2, minWidth: 160 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>INSTITUTION</label>
                        <input value={searchInstitution} onChange={e => setSearchInstitution(e.target.value)} placeholder="e.g. Ministry of Health"
                               style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                               onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                               onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    </div>
                    <div style={{ flex: 1, minWidth: 130 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>DATE (YYYY-MM-DD)</label>
                        <input value={searchDate} onChange={e => setSearchDate(e.target.value)} placeholder="e.g. 2024"
                               style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                               onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                               onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    </div>
                    <div style={{ flex: 1, minWidth: 130 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>MAX AMOUNT (€)</label>
                        <input type="number" value={searchAmount} onChange={e => setSearchAmount(e.target.value)} placeholder="e.g. 50000"
                               style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                               onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                               onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleSearch} style={{ padding: "9px 20px", background: "#1e3a5f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Search →</button>
                        {searched && <button onClick={handleClear} style={{ padding: "9px 14px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Clear</button>}
                    </div>
                </div>
                {searched && (
                    <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                        Showing <strong>{displayData.length}</strong> of {procurements.length} results
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe", marginBottom: 24 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ background: "#f0f6ff" }}>
                        {["Institution", "Supplier", "Amount", "Date", "Risk Score", "Red Flags"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {displayData.length === 0 ? (
                        <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No results found.</td></tr>
                    ) : displayData.map(p => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "12px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 16 }}>🏛️</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{p.institution}</span>
                                </div>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{p.supplier}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>{p.currency}{p.amount.toLocaleString()}</td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{p.date}</td>
                            <td style={{ padding: "12px 16px", minWidth: 120 }}><RiskBar score={p.riskScore} /></td>
                            <td style={{ padding: "12px 16px" }}>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {p.redFlags.length === 0
                                        ? <span style={{ fontSize: 12, color: "#9ca3af" }}>—</span>
                                        : p.redFlags.map(f => <RedFlagBadge key={f} flag={f} />)}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom: Red Flags + Score Overview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#dc2626", borderRadius: 16, padding: "20px 24px", color: "white" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800 }}>⚑ Red Flags</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[["Single Bidder", singleBidder], ["Repeated Supplier", repeated], ["High Value contracts", highValue]].map(([label, val]) => (
                            <div key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                                <div style={{ fontSize: 26, fontWeight: 900 }}>{val}</div>
                                <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, opacity: 0.9 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe", textAlign: "center" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800, color: "#1e3a5f" }}>Score Overview</h3>
                    <RiskGauge score={avgRisk} />
                    <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", fontWeight: 600, padding: "0 10px" }}>
                        <span>LOW</span><span>HIGH</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>Average risk score</div>
                </div>
            </div>
        </div>
    );
}
