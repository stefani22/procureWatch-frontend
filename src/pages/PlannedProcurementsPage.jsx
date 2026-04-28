
import { useState, useEffect } from "react";
import { getInstitutions } from "../services/api";
import InstitutionDetailPage from "./InstitutionDetailPage";

export default function PlannedProcurementsPage() {
    const [institutions, setInstitutions] = useState([]);
    const [filtered,     setFiltered]     = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [selected,     setSelected]     = useState(null);

    const [searchName,   setSearchName]   = useState("");
    const [searchCity,   setSearchCity]   = useState("");
    const [searchType,   setSearchType]   = useState("");

    // Вчитај при старт
    useEffect(() => {
        getInstitutions()
            .then(data => { setInstitutions(data); setFiltered(data); })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = () => {
        const results = institutions.filter(inst => {
            const matchName = !searchName || inst.name.toLowerCase().includes(searchName.toLowerCase());
            const matchCity = !searchCity || (inst.city && inst.city.toLowerCase().includes(searchCity.toLowerCase()));
            const matchType = !searchType || searchType === "All" || inst.type === searchType;
            return matchName && matchCity && matchType;
        });
        setFiltered(results);
    };

    const handleClear = () => {
        setSearchName("");
        setSearchCity("");
        setSearchType("");
        setFiltered(institutions);
    };

    const uniqueTypes = ["All", ...new Set(institutions.map(i => i.type).filter(Boolean))];

    if (selected) {
        return <InstitutionDetailPage inst={selected} onBack={() => setSelected(null)} />;
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e3a5f" }}>Planned Procurements</h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Contracting authorities from the backend</p>
            </div>

            {/* Filters */}
            <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ flex: 2, minWidth: 180 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 6 }}>INSTITUTION NAME</label>
                    <input value={searchName} onChange={e => setSearchName(e.target.value)}
                           placeholder="Search by name…"
                           style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                           onFocus={e => e.target.style.borderColor = "#2563eb"}
                           onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                           onKeyDown={e => e.key === "Enter" && handleSearch()} />
                </div>
                <div style={{ flex: 1, minWidth: 130 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 6 }}>CITY</label>
                    <input value={searchCity} onChange={e => setSearchCity(e.target.value)}
                           placeholder="e.g. Skopje"
                           style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                           onFocus={e => e.target.style.borderColor = "#2563eb"}
                           onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                           onKeyDown={e => e.key === "Enter" && handleSearch()} />
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 6 }}>TYPE</label>
                    <select value={searchType} onChange={e => setSearchType(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", background: "white", boxSizing: "border-box" }}>
                        {uniqueTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSearch} style={{ padding: "9px 22px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Search</button>
                    <button onClick={handleClear}  style={{ padding: "9px 14px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Clear</button>
                </div>
            </div>

            <div style={{ marginBottom: 12, fontSize: 13, color: "#6b7280" }}>
                Showing <strong>{filtered.length}</strong> of {institutions.length} institutions
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>
                    ⚠️ Backend error: {error}
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
                        {["Institution Name", "City", "Type", "Category", ""].map(h => (
                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "white" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading institutions…</td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No institutions found.</td></tr>
                    ) : filtered.map((inst, i) => (
                        <tr key={inst.id}
                            style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#f0f6ff" : "white", cursor: "pointer", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#f0f6ff" : "white"}
                            onClick={() => setSelected(inst)}
                        >
                            <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{inst.name}</td>
                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{inst.city || "—"}</td>
                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{inst.type || "—"}</td>
                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{inst.category || "—"}</td>
                            <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                <button
                                    onClick={e => { e.stopPropagation(); setSelected(inst); }}
                                    style={{ padding: "5px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                >
                                    Open →
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
