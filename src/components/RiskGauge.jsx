import { getRiskColor } from "../utils/helpers";

export default function RiskGauge({ score }) {
    const angle = -135 + (score / 100) * 270;
    const color = getRiskColor(score);
    return (
        <div style={{ position: "relative", width: 120, height: 70, margin: "0 auto" }}>
            <svg viewBox="0 0 120 70" width="120" height="70">
                <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#22c55e" />
                        <stop offset="33%"  stopColor="#eab308" />
                        <stop offset="66%"  stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
                <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" />
                <g transform={`rotate(${angle}, 60, 65)`}>
                    <line x1="60" y1="65" x2="60" y2="22" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="60" cy="65" r="4" fill="#1e3a5f" />
                </g>
            </svg>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 800, color }}>{score}</span>
                <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 2 }}>/100</span>
            </div>
        </div>
    );
}
