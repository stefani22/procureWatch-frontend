import { useContracts } from "../hooks/useContracts";

const RISK_COLORS = {
    HIGH:    { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    MEDIUM:  { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
    LOW:     { bg: "#fefce8", text: "#a16207", border: "#fef08a" },
    MINIMAL: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    UNKNOWN: { bg: "#f3f4f6", text: "#6b7280", border: "#e5e7eb" },
};

function RiskBadge({ level }) {
    const c = RISK_COLORS[level] || RISK_COLORS.UNKNOWN;
    return (
        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
            {level || "—"}
        </span>
    );
}

const inputStyle = {
    padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb",
    fontSize: 13, outline: "none", background: "white",
};

export default function ContractsPage({ onOpenDetail }) {
    const {
        contracts, loading, error,
        total, page, totalPages,
        filters, setFilters,
        search, clear, goToPage,
    } = useContracts();

    const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e3a5f" }}>📑 Contracts</h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
                    Browse and search all procurement contracts — {total.toLocaleString()} total
                </p>
            </div>

            <div style={{ background: "white", borderRadius: 12, padding: "16px 18px", marginBottom: 18,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <input value={filters.searchText} onChange={e => setFilter("searchText", e.target.value)}
                        onKeyDown={e => e.key === "Enter" && search()}
                        placeholder="Search institution, supplier, subject…"
                        style={{ ...inputStyle }} />
                    <input value={filters.dateFrom} onChange={e => setFilter("dateFrom", e.target.value)}
                        type="date" style={{ ...inputStyle }} />
                    <input value={filters.dateTo} onChange={e => setFilter("dateTo", e.target.value)}
                        type="date" style={{ ...inputStyle }} />
                    <input value={filters.minValue} onChange={e => setFilter("minValue", e.target.value)}
                        placeholder="Min value" type="number" style={{ ...inputStyle }} />
                    <input value={filters.maxValue} onChange={e => setFilter("maxValue", e.target.value)}
                        placeholder="Max value" type="number" style={{ ...inputStyle }} />
                    <select value={filters.riskLevel} onChange={e => setFilter("riskLevel", e.target.value)}
                        style={{ ...inputStyle }}>
                        <option value="">All Risk Levels</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                        <option value="MINIMAL">Minimal</option>
                    </select>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={search} style={{ padding: "8px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Search</button>
                    <button onClick={clear}  style={{ padding: "8px 16px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Clear</button>
                </div>
            </div>

            {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 16, color: "#dc2626", marginBottom: 16 }}>
                    {error}
                </div>
            )}

            <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>
                        Showing {contracts.length} of {total.toLocaleString()} contracts
                    </span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#2563eb" }}>
                            {["Subject", "Institution", "Supplier", "Date", "Value (MKD)", "Risk Score", "Risk Level", "Flags", ""].map(h => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading…</td></tr>
                        ) : contracts.length === 0 ? (
                            <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No contracts found</td></tr>
                        ) : contracts.map((c, i) => (
                            <tr key={c.id}
                                style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#f0f6ff" : "white", cursor: "pointer" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#f0f6ff" : "white"}
                                onClick={() => onOpenDetail && onOpenDetail(c.id)}>
                                <td style={{ padding: "12px 16px", maxWidth: 220 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description || "—"}</div>
                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.noticeNumber}</div>
                                </td>
                                <td style={{ padding: "12px 16px", fontSize: 12, color: "#374151", maxWidth: 180 }}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.institution}</div>
                                </td>
                                <td style={{ padding: "12px 16px", fontSize: 12, color: "#374151", maxWidth: 150 }}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.supplier}</div>
                                </td>
                                <td style={{ padding: "12px 16px", fontSize: 12, color: "#374151", whiteSpace: "nowrap" }}>{c.date}</td>
                                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#1e3a5f", whiteSpace: "nowrap" }}>
                                    {c.amount > 0 ? c.amount.toLocaleString() : "—"}
                                </td>
                                <td style={{ padding: "12px 16px" }}>
                                    {c.riskScore > 0 ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ width: 50, height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                                                <div style={{ width: `${c.riskScore}%`, height: "100%", borderRadius: 3,
                                                    background: c.riskScore >= 75 ? "#ef4444" : c.riskScore >= 50 ? "#f97316" : "#eab308" }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: "#1e3a5f" }}>{c.riskScore}</span>
                                        </div>
                                    ) : <span style={{ fontSize: 12, color: "#9ca3af" }}>—</span>}
                                </td>
                                <td style={{ padding: "12px 16px" }}><RiskBadge level={c.riskLevel} /></td>
                                <td style={{ padding: "12px 16px" }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {(c.redFlags || []).slice(0, 2).map(f => (
                                            <span key={f} style={{ padding: "2px 7px", borderRadius: 10, fontSize: 10, fontWeight: 600,
                                                background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>{f}</span>
                                        ))}
                                        {(c.redFlags || []).length > 2 && (
                                            <span style={{ fontSize: 10, color: "#6b7280" }}>+{c.redFlags.length - 2}</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: "12px 16px" }}>
                                    <button onClick={e => { e.stopPropagation(); onOpenDetail && onOpenDetail(c.id); }}
                                        style={{ padding: "5px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                        View →
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 20 }}>
                    <button onClick={() => goToPage(page - 1)} disabled={page === 0}
                        style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: page === 0 ? "#f3f4f6" : "white", cursor: page === 0 ? "default" : "pointer", fontSize: 13 }}>
                        ← Prev
                    </button>
                    <span style={{ padding: "7px 16px", fontSize: 13, color: "#6b7280" }}>Page {page + 1} of {totalPages}</span>
                    <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages - 1}
                        style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: page >= totalPages - 1 ? "#f3f4f6" : "white", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 13 }}>
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
