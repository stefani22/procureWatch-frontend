export const getRiskColor = (score) => {
    if (score >= 75) return "#ef4444";
    if (score >= 50) return "#f97316";
    if (score >= 25) return "#eab308";
    return "#22c55e";
};

export const getRiskLabel = (score) => {
    if (score >= 75) return "High";
    if (score >= 50) return "Medium";
    if (score >= 25) return "Low";
    return "Minimal";
};

export const flagColor = (flag) => {
    if (flag === "Single Bidder")     return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" };
    if (flag === "Repeated Supplier") return { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" };
    if (flag === "High Value")        return { bg: "#fefce8", text: "#a16207", border: "#fef08a" };
    return                                   { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" };
};
