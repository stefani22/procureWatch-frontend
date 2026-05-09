import { useHighRiskQueue } from "../hooks/useHighRiskQueue";

const RISK_COLORS = {
  HIGH:     { bg: "#fff1f1", text: "#c0392b", border: "#e74c3c", dot: "#e74c3c" },
  MEDIUM:   { bg: "#fffbea", text: "#b7770d", border: "#f39c12", dot: "#f39c12" },
  LOW:      { bg: "#f0fff4", text: "#1a7f37", border: "#27ae60", dot: "#27ae60" },
  CRITICAL: { bg: "#fde8ff", text: "#7b2fa8", border: "#9b59b6", dot: "#9b59b6" },
};

const RiskBadge = ({ level }) => {
  const c = RISK_COLORS[level] || RISK_COLORS.MEDIUM;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {level}
    </span>
  );
};

const ScoreBar = ({ score }) => {
  const pct = Math.min(100, Math.max(0, score || 0));
  const color = pct >= 75 ? "#e74c3c" : pct >= 50 ? "#f39c12" : "#27ae60";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width .4s" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 32 }}>{pct}</span>
    </div>
  );
};

export default function HighRiskQueuePage({ onOpenContract }) {
  const {
    contracts, loading, error,
    total, page, setPage, totalPages,
    riskLevel, setRiskLevel,
    minScore, setMinScore,
    searchInput, setSearchInput,
    handleSearch, handleClear,
  } = useHighRiskQueue();

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Segoe UI', sans-serif", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>🚨</span>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1a2e" }}>High Risk Queue</h1>
          </div>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Contracts flagged as high risk requiring review</p>
        </div>
        {total > 0 && (
          <div style={{ background: "#fff1f1", border: "1px solid #e74c3c", borderRadius: 8, padding: "8px 18px", color: "#c0392b", fontWeight: 700, fontSize: 15 }}>
            {total} high-risk contract{total !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: "2 1 220px" }}>
          <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>Search</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Notice number, supplier..."
              style={{ flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, outline: "none" }} />
            <button onClick={handleSearch} style={btnStyle("#1a73e8")}>Search</button>
          </div>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>Risk Level</label>
          <select value={riskLevel} onChange={e => { setRiskLevel(e.target.value); }}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, background: "#fff" }}>
            <option value="">All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
        <div style={{ flex: "1 1 120px" }}>
          <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 4, fontWeight: 600 }}>Min. Risk Score</label>
          <input type="number" min="0" max="100" value={minScore} onChange={e => setMinScore(e.target.value)}
            placeholder="0 – 100"
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <button onClick={handleClear} style={btnStyle("#888")}>Clear</button>
      </div>

      {error && (
        <div style={{ background: "#fff1f1", border: "1px solid #e74c3c", color: "#c0392b", borderRadius: 8, padding: "12px 18px", marginBottom: 16, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f7f8fa", borderBottom: "2px solid #e8e8e8" }}>
              {["Notice No.", "Supplier", "Amount", "Date", "Level", "Risk Score", ""].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#aaa" }}>⏳<br />Loading...</td></tr>
            ) : contracts.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#bbb" }}>
                <span style={{ fontSize: 36, display: "block", marginBottom: 8 }}>✅</span>
                No high-risk contracts found
              </td></tr>
            ) : contracts.map((c, i) => (
              <tr key={c.id || i}
                style={{ borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                onClick={() => onOpenContract && onOpenContract(c.id)}>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#1a73e8" }}>{c.noticeNumber || `#${c.id}`}</td>
                <td style={{ padding: "12px 14px", color: "#333", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.supplier || "—"}</td>
                <td style={{ padding: "12px 14px", fontWeight: 500, color: "#222" }}>
                  {c.amount != null ? new Intl.NumberFormat("mk-MK", { style: "currency", currency: "MKD", maximumFractionDigits: 0 }).format(c.amount) : "—"}
                </td>
                <td style={{ padding: "12px 14px", color: "#666" }}>
                  {c.date && c.date !== "—" ? new Date(c.date).toLocaleDateString("mk-MK") : "—"}
                </td>
                <td style={{ padding: "12px 14px" }}><RiskBadge level={c.riskLevel || "UNKNOWN"} /></td>
                <td style={{ padding: "12px 14px", minWidth: 130 }}><ScoreBar score={c.riskScore} /></td>
                <td style={{ padding: "12px 14px" }}>
                  <button onClick={e => { e.stopPropagation(); onOpenContract && onOpenContract(c.id); }}
                    style={{ background: "none", border: "1px solid #1a73e8", color: "#1a73e8", borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                    Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtnStyle(page === 1)}>← Prev</button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
            return (
              <button key={p} onClick={() => setPage(p)} style={{ ...pageBtnStyle(false), background: p === page ? "#1a73e8" : "#fff", color: p === page ? "#fff" : "#333", borderColor: p === page ? "#1a73e8" : "#ddd", fontWeight: p === page ? 700 : 400 }}>{p}</button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtnStyle(page === totalPages)}>Next →</button>
        </div>
      )}
    </div>
  );
}

const btnStyle = (color) => ({ background: color, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" });
const pageBtnStyle = (disabled) => ({ padding: "7px 13px", border: "1px solid #ddd", borderRadius: 6, background: "#fff", color: "#333", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, fontSize: 14 });
