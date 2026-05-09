import { useReports } from "../hooks/useReports";

export default function ReportsPage() {
    const { data, loading, error, handleExport } = useReports();

    return (
        <div style={{ padding: "32px" }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#1e3a5f" }}>
                    📈 High Risk Reports
                </h1>
                <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: 16 }}>
                    Contracts with elevated risk indicators
                </p>
            </div>

            <div style={{ marginBottom: 24 }}>
                <button
                    onClick={handleExport}
                    style={{ background: "#059669", color: "white", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                    📊 Export to CSV
                </button>
            </div>

            {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, color: "#dc2626", marginBottom: 24 }}>
                    Error: {error}
                </div>
            )}

            <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" }}>
                <div style={{ background: "#f8fafc", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#1e3a5f" }}>
                        {loading ? "Loading..." : `${data.length} high-risk contracts found`}
                    </span>
                </div>

                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
                        <div style={{ fontSize: 18, marginBottom: 8 }}>⏳</div>
                        <p>Loading reports...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                        <p style={{ fontSize: 18, marginBottom: 8 }}>No high-risk contracts found</p>
                        <p style={{ fontSize: 14 }}>Run risk evaluation on contracts to generate reports</p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ background: "#2563eb" }}>
                            {["Contract ID", "Subject", "Institution", "Supplier", "Risk Score", "Risk Level"].map(h => (
                                <th key={h} style={{ padding: "16px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "white" }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <tr key={item.contractId} style={{ background: index % 2 === 0 ? "#f9fafb" : "white", borderBottom: "1px solid #f3f4f6" }}>
                                <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>#{item.contractId}</td>
                                <td style={{ padding: "16px 20px", fontSize: 14, color: "#374151", maxWidth: 300 }}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.subject || "—"}</div>
                                </td>
                                <td style={{ padding: "16px 20px", fontSize: 14, color: "#374151", maxWidth: 200 }}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.institutionName || "—"}</div>
                                </td>
                                <td style={{ padding: "16px 20px", fontSize: 14, color: "#374151", maxWidth: 200 }}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.supplierName || "—"}</div>
                                </td>
                                <td style={{ padding: "16px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 60, height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                                            <div style={{ width: `${Math.min(item.finalRiskScore || 0, 100)}%`, height: "100%", background: (item.finalRiskScore || 0) >= 70 ? "#dc2626" : "#f59e0b", borderRadius: 4 }} />
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{item.finalRiskScore || 0}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "16px 20px" }}>
                                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: item.riskLevel === "CRITICAL" ? "#fef2f2" : "#fff7ed", color: item.riskLevel === "CRITICAL" ? "#dc2626" : "#c2410c", border: `1px solid ${item.riskLevel === "CRITICAL" ? "#fecaca" : "#fed7aa"}` }}>
                                        {item.riskLevel || "UNKNOWN"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
