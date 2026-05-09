import { useState, useEffect, useCallback } from "react";
import { getHighRiskQueue } from "../services/api";

const PAGE_SIZE = 10;

export function useHighRiskQueue() {
    const [contracts,   setContracts]   = useState([]);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);
    const [page,        setPage]        = useState(1);
    const [totalPages,  setTotalPages]  = useState(1);
    const [total,       setTotal]       = useState(0);

    const [riskLevel,    setRiskLevel]    = useState("");
    const [minScore,     setMinScore]     = useState("");
    const [search,       setSearch]       = useState("");
    const [searchInput,  setSearchInput]  = useState("");

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getHighRiskQueue({
                page: page - 1,
                size: PAGE_SIZE,
                ...(riskLevel && { riskLevel }),
            });
            setContracts(data.items || []);
            setTotal(data.totalElements || 0);
            setTotalPages(data.totalPages || 1);
        } catch {
            setError("Failed to load contracts.");
        } finally {
            setLoading(false);
        }
    }, [page, riskLevel, minScore, search]);

    useEffect(() => { fetch(); }, [fetch]);

    const handleSearch = () => { setPage(1); setSearch(searchInput); };
    const handleClear  = () => {
        setSearchInput(""); setSearch(""); setRiskLevel(""); setMinScore(""); setPage(1);
    };

    return {
        contracts, loading, error,
        total, page, setPage, totalPages,
        riskLevel, setRiskLevel,
        minScore,  setMinScore,
        searchInput, setSearchInput,
        handleSearch, handleClear,
    };
}
