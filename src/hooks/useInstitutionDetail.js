import { useState, useEffect } from "react";
import {
    getNoticesByInstitution,
    getContractsByInstitution,
    getDecisionsByInstitution,
    getProcurementPlansByInstitution,
} from "../services/api";

export function useInstitutionDetail(institutionId) {
    const [notices,   setNotices]   = useState([]);
    const [contracts, setContracts] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [plans,     setPlans]     = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);

    useEffect(() => {
        if (!institutionId) return;
        setLoading(true);
        setError(null);
        Promise.all([
            getNoticesByInstitution(institutionId),
            getContractsByInstitution(institutionId),
            getDecisionsByInstitution(institutionId),
            getProcurementPlansByInstitution(institutionId),
        ])
            .then(([n, c, d, p]) => {
                setNotices(n);
                setContracts(c);
                setDecisions(d);
                setPlans(p);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [institutionId]);

    return { notices, contracts, decisions, plans, loading, error };
}
