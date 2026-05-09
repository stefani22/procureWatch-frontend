import { useRiskAnalysis } from "../hooks/useRiskAnalysis";

const LEVELS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const RISK_COLORS = {
  HIGH:     { bg: "#fff1f1", text: "#c0392b", border: "#e74c3c" },
  MEDIUM:   { bg: "#fffbea", text: "#b7770d", border: "#f39c12" },
  LOW:      { bg: "#f0fff4", text: "#1a7f37", border: "#27ae60" },
  CRITICAL: { bg: "#fde8ff", text: "#7b2fa8", border: "#9b59b6" },
  UNKNOWN:  { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db" },
};

const RiskBadge = ({ level }) => {
  const c = RISK_COLORS[level] || RISK_COLORS.UNKNOWN;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.text, display: "inline-block" }} />
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

export default function RiskAnalysisPage({ onOpenContract }) {
  const {
    activeLevel, handleLevelChange,
    items, loading, error, successMsg,
    evaluating, handleEvaluateAll,
    page, setPage, totalPages, totalElements,
  } = useRiskAnalysis();

  const activeColor = RISK_COLORS[activeLevel] || RISK_COLORS.UNKNOWN;

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Segoe UI', sans-serif", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22 }}>🔍</span>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1a2e" }}>Risk Analysis</h1>
          </div>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>View and run risk assessments across all contracts</p>
        </div>
        <button onClick={handleEvaluateAll} disabled={evaluating}
          style={{ background: evaluating ? "#ccc" : "#e74c3c", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: evaluating ? "not-allowed" : "pointer" }}>
          {evaluating ? "⏳ Evaluating..." : "⚡ Evaluate All Contracts"}
        </button>
      </div>

      {successMsg && (
        <div style={{ background: "#f0fff4", border: "1px solid #27ae60", color: "#1a7f37", borderRadius: 8, padding: "12px 18px", marginBottom: 16, fontSize: 14 }}>
          ✅ {successMsg}
        </div>
      )}
      {error && (
        <div style={{ background: "#fff1f1", border: "1px solid #e74c3c", color: "#c0392b", borderRadius: 8, padding: "12px 18px", marginBottom: 16, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {LEVELS.map(level => {
          const c = RISK_COLORS[level];
          const active = activeLevel === level;
          return (
            <button key={level} onClick={() => handleLevelChange(level)}
              style={{ padding: "8px 20px", borderRadius: 20, border: `1.5px solid ${active ? c.border : "#ddd"}`, background: active ? c.bg : "#fff", color: active ? c.text : "#666", fontWeight: active ? 700 : 400, fontSize: 13, cursor: "pointer" }}>
              {level}
            </button>
          );
        })}
      </div>

      {!loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#888" }}>
            <strong style={{ color: activeColor.text }}>{totalElements}</strong> assessments — risk level: <strong>{activeLevel}</strong>
          </span>
          <span style={{ fontSize: 13, color: "#aaa" }}>Page {page} of {totalPages}</span>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f7f8fa", borderBottom: "2px solid #e8e8e8" }}>
              {["Contract ID", "Risk Level", "Final Score", "Rule Score", "Anomaly Score", "Similarity Score", "Cluster Score", "Priority", "Evaluated At", ""].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: 48, textAlign: "center", color: "#aaa" }}>⏳<br />Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: 48, textAlign: "center", color: "#bbb" }}>
                <span style={{ fontSize: 36, display: "block", marginBottom: 8 }}>📋</span>
                No assessments found for {activeLevel}.
              </td></tr>
            ) : items.map((a, i) => (
              <tr key={a.id || i}
                style={{ borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa", cursor: onOpenContract ? "pointer" : "default", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                onClick={() => onOpenContract && onOpenContract(a.contractId)}>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#1a73e8" }}>#{a.contractId}</td>
                <td style={{ padding: "12px 14px" }}><RiskBadge level={a.riskLevel} /></td>
                <td style={{ padding: "12px 14px", minWidth: 140 }}><ScoreBar score={a.finalRiskScore} /></td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{a.ruleScore ?? "—"}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{a.anomalyScore ?? "—"}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{a.similarityScore ?? "—"}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{a.clusterScore ?? "—"}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{a.priorityRank ?? "—"}</td>
                <td style={{ padding: "12px 14px", color: "#666", whiteSpace: "nowrap" }}>
                  {a.evaluatedAt ? new Date(a.evaluatedAt).toLocaleDateString("en-GB") : "—"}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  {onOpenContract && (
                    <button onClick={e => { e.stopPropagation(); onOpenContract(a.contractId); }}
                      style={{ background: "none", border: "1px solid #1a73e8", color: "#1a73e8", borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Details →
                    </button>
                  )}
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

const pageBtnStyle = (disabled) => ({ padding: "7px 13px", border: "1px solid #ddd", borderRadius: 6, background: "#fff", color: "#333", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, fontSize: 14 });
