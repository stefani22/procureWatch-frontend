import { getRiskColor } from "../utils/helpers";

export default function RiskBar({ score }) {
    const color = getRiskColor(score);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 24 }}>{score}</span>
        </div>
    );
}
