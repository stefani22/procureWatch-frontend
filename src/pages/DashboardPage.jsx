

import { useState, useEffect } from "react";
import { getContracts } from "../services/api";
import StatCard     from "../components/StatCard";
import RiskBar      from "../components/RiskBar";
import RiskGauge    from "../components/RiskGauge";
import { getRiskColor } from "../utils/helpers";

export default function DashboardPage() {
    const [allData,       setAllData]       = useState([]);
    const [filtered,      setFiltered]      = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);
    const [searched,      setSearched]      = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    const [searchInstitution, setSearchInstitution] = useState("");
    const [searchDateFrom,    setSearchDateFrom]    = useState("");
    const [searchDateTo,      setSearchDateTo]      = useState("");
    const [searchMinAmount,   setSearchMinAmount]   = useState("");
    const [searchMaxAmount,   setSearchMaxAmount]   = useState("");

    // Вчитај при старт
    useEffect(() => {
        getContracts({ size: 20 })
            .then(res => {
                setAllData(res.items);
                setFiltered(res.items);
                setTotalElements(res.totalElements);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const highRisk   = allData.filter(p => p.riskLevel === "HIGH").length;
    const mediumRisk = allData.filter(p => p.riskLevel === "MEDIUM").length;
    const lowRisk    = allData.filter(p => p.riskLevel === "LOW" || p.riskLevel === "MINIMAL").length;
    const avgRisk    = allData.length
        ? Math.round(allData.reduce((a, p) => a + p.riskScore, 0) / allData.length)
        : 0;

    const handleSearch = () => {
        setLoading(true);
        setError(null);
        getContracts({
            institution: searchInstitution || undefined,
            dateFrom:    searchDateFrom    || undefined,
            dateTo:      searchDateTo      || undefined,
            minValue:    searchMinAmount   || undefined,
            maxValue:    searchMaxAmount   || undefined,
            size: 20,
        })
            .then(res => {
                setFiltered(res.items);
                setTotalElements(res.totalElements);
                setSearched(true);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    const handleClear = () => {
        setSearchInstitution("");
        setSearchDateFrom("");
        setSearchDateTo("");
        setSearchMinAmount("");
        setSearchMaxAmount("");
        setFiltered(allData);
        setSearched(false);
    };

    const inputStyle = {
        width: "100%", padding: "8px 12px", borderRadius: 8,
        border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box",
    };

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#1e3a5f" }}>Welcome to ProcureWatch</h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Review of Public Procurement and Risk Detection</p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
                <StatCard icon="📋" label="Total Contracts" value={totalElements.toLocaleString()} />
                <StatCard icon="🔴" label="High Risk"       value={highRisk} />
                <StatCard icon="🟡" label="Medium Risk"     value={mediumRisk} />
                <StatCard icon="✅" label="Low / Minimal"   value={lowRisk} />
            </div>

            {/* Search */}
            <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ flex: 2, minWidth: 160 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>INSTITUTION / KEYWORD</label>
                        <input value={searchInstitution} onChange={e => setSearchInstitution(e.target.value)}
                               placeholder="e.g. Ministry of Health" style={inputStyle}
                               onFocus={e => e.target.style.borderColor = "#2563eb"}
                               onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                               onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    </div>
                    <div style={{ flex: 1, minWidth: 130 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>DATE FROM</label>
                        <input type="date" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)}
                               style={inputStyle}
                               onFocus={e => e.target.style.borderColor = "#2563eb"}
                               onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 130 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>DATE TO</label>
                        <input type="date" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)}
                               style={inputStyle}
                               onFocus={e => e.target.style.borderColor = "#2563eb"}
                               onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 110 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>MIN VALUE</label>
                        <input type="number" value={searchMinAmount} onChange={e => setSearchMinAmount(e.target.value)}
                               placeholder="0" style={inputStyle}
                               onFocus={e => e.target.style.borderColor = "#2563eb"}
                               onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                               onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    </div>
                    <div style={{ flex: 1, minWidth: 110 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>MAX VALUE</label>
                        <input type="number" value={searchMaxAmount} onChange={e => setSearchMaxAmount(e.target.value)}
                               placeholder="∞" style={inputStyle}
                               onFocus={e => e.target.style.borderColor = "#2563eb"}
                               onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                               onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleSearch} style={{ padding: "9px 20px", background: "#1e3a5f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Search →</button>
                        {searched && <button onClick={handleClear} style={{ padding: "9px 14px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Clear</button>}
                    </div>
                </div>
                {searched && (
                    <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                        Showing <strong>{filtered.length}</strong> results (total in DB: {totalElements.toLocaleString()})
                    </div>
                )}
            </div>

            {/* Error banner */}
            {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>
                    ⚠️ Backend error: {error}. Make sure Spring Boot is running on port 8080.
                </div>
            )}

            {/* Table */}
            <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe", marginBottom: 24 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ background: "#f0f6ff" }}>
                        {["Institution", "Supplier", "Amount (MKD)", "Date", "Type", "Risk Score", "Risk Level"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading from backend…</td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No results found.</td></tr>
                    ) : filtered.map(p => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "12px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>🏛️</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{p.institution}</span>
                                </div>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{p.supplier}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>
                                {p.amount ? p.amount.toLocaleString() : "—"}
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{p.date}</td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{p.type}</td>
                            <td style={{ padding: "12px 16px", minWidth: 120 }}><RiskBar score={p.riskScore} /></td>
                            <td style={{ padding: "12px 16px" }}>
                                    <span style={{ background: getRiskColor(p.riskScore) + "20", color: getRiskColor(p.riskScore), borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                                        {p.riskLevel}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom: Risk counts + Gauge */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#dc2626", borderRadius: 16, padding: "20px 24px", color: "white" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800 }}>⚑ Risk Overview</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[["High Risk", highRisk], ["Medium Risk", mediumRisk], ["Low / Min", lowRisk]].map(([label, val]) => (
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
                    <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                        Average risk — {allData.length} contracts loaded
                    </div>
                </div>
            </div>
        </div>
    );
}

