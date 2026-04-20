import { flagColor } from "../utils/helpers";

export default function RedFlagBadge({ flag }) {
    const c = flagColor(flag);
    return (
        <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
            ⚑ {flag}
        </span>
    );
}
