import { useState } from "react";
import { MOCK_PROCUREMENTS } from "../data/mockData";
import InstitutionDetailPage from "./InstitutionDetailPage";

export default function PlannedProcurementsPage() {
    const procurements = MOCK_PROCUREMENTS;

    const [year,      setYear]      = useState("");
    const [authority, setAuthority] = useState("All authorities");
    const [filtered,  setFiltered]  = useState(procurements);
    const [searched,  setSearched]  = useState(false);
    const [selected,  setSelected]  = useState(null);

    const years = [...new Set(procurements.map(p => p.year))].sort((a, b) => b - a);

    const handleSearch = () => {
        const results = procurements.filter(p => {
            const matchYear = !year || p.year === Number(year);
            const matchAuth = authority === "All authorities" || p.institution === authority;
            return matchYear && matchAuth;
        });
        setFiltered(results);
        setSearched(true);
    };

    const handleClear = () => {
        setYear("");
        setAuthority("All authorities");
        setFiltered(procurements);
        setSearched(false);
    };

    const displayData = searched ? filtered : procurements;

    // Show institution detail
    if (selected) {
        return <InstitutionDetailPage proc={selected} onBack={() => setSelected(null)} />;
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e3a5f" }}>Planned Procurements</h2>
            </div>

            {/* Filters */}
            <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 6 }}>CHOOSE YEAR</label>
                    <select value={year} onChange={e => setYear(e.target.value)}
                            style={{ padding: "8px 32px 8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", background: "white" }}>
                        <option value="">All years</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 6 }}>CONTRACTING AUTHORITY</label>
                    <select value={authority} onChange={e => setAuthority(e.target.value)}
                            style={{ padding: "8px 32px 8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", background: "white" }}>
                        <option>All authorities</option>
                        {procurements.map(p => <option key={p.id}>{p.institution}</option>)}
                    </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSearch} style={{ padding: "9px 22px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Search</button>
                    {searched && <button onClick={handleClear} style={{ padding: "9px 14px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Clear</button>}
                </div>
            </div>

            {searched && (
                <div style={{ marginBottom: 12, fontSize: 13, color: "#6b7280" }}>
                    Showing <strong>{displayData.length}</strong> of {procurements.length} authorities
                </div>
            )}

            {/* Table */}
            <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>List of contracting authorities</h3>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ background: "#2563eb" }}>
                        {["Contracting Authority", "Number of Procurements", "Summary"].map(h => (
                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "white" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {displayData.length === 0 ? (
                        <tr><td colSpan={3} style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No results found.</td></tr>
                    ) : displayData.map((p, i) => {
                        const summary = Math.round(p.amount * p.planned / 1000);
                        return (
                            <tr key={p.id}
                                style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#f0f6ff" : "white", cursor: "pointer", transition: "background 0.15s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#f0f6ff" : "white"}
                                onClick={() => setSelected(p)}
                            >
                                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{p.institution}</td>
                                <td style={{ padding: "14px 20px", fontSize: 14, color: "#374151" }}>{p.planned}</td>
                                <td style={{ padding: "14px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 14, color: "#374151" }}>{summary},000 MKD</span>
                                        <button
                                            onClick={e => { e.stopPropagation(); setSelected(p); }}
                                            style={{ padding: "5px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                        >
                                            Open →
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
