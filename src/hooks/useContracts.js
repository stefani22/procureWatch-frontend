import { useState, useEffect } from "react";
import { getContracts } from "../services/api";

const DEFAULT_FILTERS = {
    searchText: "",
    dateFrom:   "",
    dateTo:     "",
    minValue:   "",
    maxValue:   "",
    riskLevel:  "",
};

export function useContracts() {
    const [contracts,   setContracts]   = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [total,       setTotal]       = useState(0);
    const [page,        setPage]        = useState(0);
    const [totalPages,  setTotalPages]  = useState(0);
    const [filters,     setFilters]     = useState(DEFAULT_FILTERS);

    const load = (p = 0, overrideFilters = null) => {
        const f = overrideFilters ?? filters;
        setLoading(true);
        getContracts({
            institution: f.searchText || undefined,
            dateFrom:    f.dateFrom   || undefined,
            dateTo:      f.dateTo     || undefined,
            minValue:    f.minValue   || undefined,
            maxValue:    f.maxValue   || undefined,
            riskLevel:   f.riskLevel  || undefined,
            page: p,
            size: 20,
        })
            .then(res => {
                setContracts(res.items);
                setTotal(res.totalElements);
                setTotalPages(res.totalPages);
                setPage(p);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(0); }, []);

    const search = () => load(0);

    const clear = () => {
        setFilters(DEFAULT_FILTERS);
        load(0, DEFAULT_FILTERS);
    };

    const goToPage = (p) => load(p);

    return {
        contracts, loading, error,
        total, page, totalPages,
        filters, setFilters,
        search, clear, goToPage,
    };
}
