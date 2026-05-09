import { useState, useEffect, useCallback } from "react";
import { getRiskAssessmentsByLevel, evaluateAllContracts } from "../services/api";

const PAGE_SIZE = 20;

export function useRiskAnalysis() {
    const [activeLevel,    setActiveLevel]    = useState("HIGH");
    const [items,          setItems]          = useState([]);
    const [loading,        setLoading]        = useState(false);
    const [evaluating,     setEvaluating]     = useState(false);
    const [error,          setError]          = useState(null);
    const [successMsg,     setSuccessMsg]     = useState(null);
    const [page,           setPage]           = useState(1);
    const [totalPages,     setTotalPages]     = useState(1);
    const [totalElements,  setTotalElements]  = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRiskAssessmentsByLevel(activeLevel, page - 1, PAGE_SIZE);
            setItems(data.items || []);
            setTotalElements(data.totalElements || 0);
            setTotalPages(data.totalPages || 1);
        } catch {
            setError("Failed to load risk assessments.");
        } finally {
            setLoading(false);
        }
    }, [activeLevel, page]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLevelChange = (level) => {
        setActiveLevel(level);
        setPage(1);
    };

    const handleEvaluateAll = async () => {
        if (!window.confirm("This will re-evaluate ALL contracts. This may take a while. Continue?")) return;
        setEvaluating(true);
        setError(null);
        setSuccessMsg(null);
        try {
            await evaluateAllContracts();
            setSuccessMsg("All contracts evaluated successfully!");
            setTimeout(() => setSuccessMsg(null), 4000);
            fetchData();
        } catch {
            setError("Evaluation failed. Please try again.");
        } finally {
            setEvaluating(false);
        }
    };

    return {
        activeLevel, handleLevelChange,
        items, loading, error, successMsg,
        evaluating, handleEvaluateAll,
        page, setPage, totalPages, totalElements,
    };
}
