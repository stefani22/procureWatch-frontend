import { useState, useEffect } from "react";
import { getInstitutions } from "../services/api";

export function useInstitutions() {
    const [institutions, setInstitutions] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);

    useEffect(() => {
        getInstitutions()
            .then(data => setInstitutions(data))
            .catch(err  => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { institutions, loading, error };
}
