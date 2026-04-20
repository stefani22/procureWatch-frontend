import { useState } from "react";
import TopNav                  from "./components/TopNav";
import LoginPage               from "./pages/LoginPage";
import DashboardPage           from "./pages/DashboardPage";
import PlannedProcurementsPage from "./pages/PlannedProcurementsPage";
import CasesPage               from "./pages/CasesPage";
import ReportsPage             from "./pages/ReportsPage";

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [page,     setPage]     = useState("dashboard");

    if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

    return (
        <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f4fa" }}>
            <TopNav
                page={page}
                setPage={setPage}
                onLogout={() => setLoggedIn(false)}
            />
            <main style={{ padding: "80px 32px 40px" }}>
                {page === "dashboard"    && <DashboardPage />}
                {page === "procurements" && <PlannedProcurementsPage />}
                {page === "cases"        && <CasesPage />}
                {page === "reports"      && <ReportsPage />}
            </main>
        </div>
    );
}
