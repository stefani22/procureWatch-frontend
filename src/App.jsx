import { useState } from "react";
import TopNav                  from "./components/TopNav";
import LoginPage               from "./pages/LoginPage";
import DashboardPage           from "./pages/DashboardPage";
import PlannedProcurementsPage from "./pages/PlannedProcurementsPage";
import HighRiskQueuePage       from "./pages/HighRiskQueuePage";
import ContractsPage           from "./pages/ContractsPage";
import ContractDetailPage      from "./pages/ContractDetailPage";
import RiskAnalysisPage        from "./pages/RiskAnalysisPage";
import InstitutionDetailPage   from "./pages/InstitutionDetailPage";

// Institutions list page — inline за да не правиме нов фајл
import { useState as useStateInst, useEffect as useEffectInst } from "react";
import { getInstitutions } from "./services/api";

function InstitutionsPage({ onOpenInstitution }) {
    const [institutions, setInstitutions] = useStateInst([]);
    const [filtered,     setFiltered]     = useStateInst([]);
    const [loading,      setLoading]      = useStateInst(true);
    const [search,       setSearch]       = useStateInst("");

    useEffectInst(() => {
        getInstitutions()
            .then(data => { setInstitutions(data); setFiltered(data); })
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = () => {
        const q = search.toLowerCase();
        setFiltered(institutions.filter(i =>
            i.name.toLowerCase().includes(q) ||
            (i.city && i.city.toLowerCase().includes(q)) ||
            (i.type && i.type.toLowerCase().includes(q))
        ));
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e3a5f" }}>Institutions</h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>All contracting authorities</p>
            </div>
            <div style={{ background: "white", borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, city, type…"
                       style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none" }}
                       onFocus={e => e.target.style.borderColor = "#2563eb"}
                       onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                       onKeyDown={e => e.key === "Enter" && handleSearch()} />
                <button onClick={handleSearch} style={{ padding: "8px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Search</button>
                <button onClick={() => { setSearch(""); setFiltered(institutions); }} style={{ padding: "8px 14px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Clear</button>
            </div>
            <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #dbeafe" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>Showing {filtered.length} of {institutions.length} institutions</span>
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
                        <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading…</td></tr>
                    ) : filtered.map((inst, i) => (
                        <tr key={inst.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#f0f6ff" : "white", cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#f0f6ff" : "white"}
                            onClick={() => onOpenInstitution(inst)}>
                            <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{inst.name}</td>
                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{inst.city || "—"}</td>
                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{inst.type || "—"}</td>
                            <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{inst.category || "—"}</td>
                            <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                <button onClick={e => { e.stopPropagation(); onOpenInstitution(inst); }}
                                        style={{ padding: "5px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
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

export default function App() {
    const [user,               setUser]               = useState(null);
    const [page,               setPage]               = useState("dashboard");
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [selectedInstitution, setSelectedInstitution] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
        setPage("dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("pw_token");
        localStorage.removeItem("pw_user");
        setUser(null);
        setPage("dashboard");
    };

    const handleOpenContract = (contractId) => {
        setSelectedContractId(contractId);
        setPage("contract-detail");
    };

    const handleOpenInstitution = (inst) => {
        setSelectedInstitution(inst);
        setPage("institution-detail");
    };

    const handleSetPage = (p) => {
        setSelectedContractId(null);
        setSelectedInstitution(null);
        setPage(p);
    };

    if (!user) return <LoginPage onLogin={handleLogin} />;

    const activePage = page === "contract-detail"    ? "contracts"    :
        page === "institution-detail"  ? "institutions" : page;

    return (
        <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f4fa" }}>
            <TopNav page={activePage} setPage={handleSetPage} onLogout={handleLogout} user={user} />
            <main style={{ padding: "80px 32px 40px" }}>
                {page === "dashboard"          && <DashboardPage />}
                {page === "contracts"          && <ContractsPage onOpenDetail={handleOpenContract} />}
                {page === "contract-detail"    && <ContractDetailPage contractId={selectedContractId} onBack={() => setPage("contracts")} />}
                {page === "highrisk"           && <HighRiskQueuePage />}
                {page === "procurements"       && <PlannedProcurementsPage />}
                {page === "institutions"       && <InstitutionsPage onOpenInstitution={handleOpenInstitution} />}
                {page === "institution-detail" && <InstitutionDetailPage inst={selectedInstitution} onBack={() => setPage("institutions")} />}
                {page === "riskanalysis"       && <RiskAnalysisPage />}
            </main>
        </div>
    );
}
