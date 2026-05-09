import { useState, useEffect } from "react";
import { getHighRiskReport, downloadHighRiskCsv } from "../services/api";

export function useReports() {
    const [data,    setData]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getHighRiskReport();
            setData(result.items || result || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleExport = async () => {
        try {
            await downloadHighRiskCsv();
        } catch (err) {
            alert("Export failed: " + err.message);
        }
    };

    return { data, loading, error, handleExport };
}
