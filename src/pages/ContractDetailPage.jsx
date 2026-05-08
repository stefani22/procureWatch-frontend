import { useEffect, useState } from "react";
import {
    getContractDetail,
    getContractLifecycle,
    getSimilarDocuments,
    getAIExplanation,
    generateAIExplanation,
    evaluateContract,
} from "../services/api";
import RiskGauge from "../components/RiskGauge";
import RiskBar from "../components/RiskBar";

export default function ContractDetailPage({ contractId, onBack }) {
    const [contract, setContract] = useState(null);
    const [lifecycle, setLifecycle] = useState(null);
    const [similarDocs, setSimilarDocs] = useState({});
    const [aiExplanation, setAiExplanation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);

    useEffect(() => {
        loadData();
    }, [contractId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [detail, lc, sm, ai] = await Promise.all([
                getContractDetail(contractId),
                getContractLifecycle(contractId),
                getSimilarDocuments(contractId),
                getAIExplanation(contractId).catch(() => null)
            ]);
            setContract(detail);
            setLifecycle(lc);
            setSimilarDocs(sm);
            setAiExplanation(ai);
        } catch (error) {
            console.error("Error loading contract details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluateRisk = async () => {
        setEvaluating(true);
        try {
            await evaluateContract(contractId);
            await loadData(); // Reload all data to get updated risk assessment
        } catch (error) {
            console.error("Error evaluating risk:", error);
            alert("Risk evaluation failed. Please try again.");
        } finally {
            setEvaluating(false);
        }
    };

    const handleGenerateAI = async () => {
        setGeneratingAI(true);
        try {
            await generateAIExplanation(contractId);
            await loadData(); // Reload to get new explanation
        } catch (error) {
            console.error("Error generating AI explanation:", error);
            alert("AI explanation generation failed. Please try again.");
        } finally {
            setGeneratingAI(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <p style={{ fontSize: 16, color: "#6b7280" }}>Loading contract details...</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <p style={{ fontSize: 16, color: "#dc2626" }}>Contract not found.</p>
            </div>
        );
    }

    const ra = contract.riskAssessment || {};
    const flags = ra.triggeredFlags || [];

    return (
        <div style={{ padding: "32px", background: "#f0f4fa", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <button
                    onClick={onBack}
                    style={{
                        background: "white",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        padding: "8px 16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginBottom: 16
                    }}
                >
                    ← Back to Contracts
                </button>
                <h1 style={{ color: "#1e3a5f", margin: 0, fontSize: 28, fontWeight: 900 }}>
                    Contract Details
                </h1>
            </div>

            {/* Basic Info */}
            <section style={{
                background: "white",
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    <div>
                        <p><strong>Subject:</strong> {contract.subject}</p>
                        <p><strong>Institution:</strong> {contract.institution}</p>
                        <p><strong>Supplier:</strong> {contract.supplier}</p>
                    </div>

                    <div>
                        <p><strong>Contract Date:</strong> {contract.contractDate}</p>

                        <p>
                            <strong>Value (MKD):</strong>{" "}
                            {contract.contractValueVat?.toLocaleString()}
                        </p>

                        <p><strong>Procedure Type:</strong> {contract.procedureType}</p>
                    </div>

                </div>
            </section>

            {/* RISK ASSESSMENT */}
            <section
                style={{
                    background: "white",
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 30,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.08)"
                }}
            >
                <h3 style={{ color: "#1e3a5f", marginBottom: 16 }}>
                    📊 Risk Assessment
                </h3>

                <div style={{ marginBottom: 24 }}>
                    <RiskGauge
                        score={ra.finalRiskScore ?? 0}
                        level={ra.riskLevel ?? "UNKNOWN"}
                    />
                </div>

                {flags.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ color: "#dc2626", marginBottom: 10 }}>
                            🚩 Triggered Flags
                        </h4>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {flags.map((flag, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: "#fef2f2",
                                        border: "1px solid #fecaca",
                                        borderRadius: 8,
                                        padding: "8px 12px",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#dc2626"
                                    }}
                                >
                                    {flag.flagName}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </section>
            {/* Lifecycle */}
            <section style={{
                background: "white",
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ color: "#1e3a5f", margin: "0 0 16px", fontSize: 20, fontWeight: 700 }}>
                    📋 Lifecycle Linking
                </h2>
                {lifecycle ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                        {[
                            { key: "plan", label: "Plan" },
                            { key: "planItem", label: "Plan Item" },
                            { key: "notice", label: "Notice" },
                            { key: "decision", label: "Decision" },
                            { key: "realizedContract", label: "Realized" }
                        ].map(({ key, label }) => (
                            <div
                                key={key}
                                style={{
                                    textAlign: "center",
                                    padding: 16,
                                    borderRadius: 8,
                                    background: lifecycle[key] ? "#f0fdf4" : "#fef2f2",
                                    border: `1px solid ${lifecycle[key] ? "#bbf7d0" : "#fecaca"}`
                                }}
                            >
                                <div style={{ fontSize: 24, marginBottom: 8 }}>
                                    {lifecycle[key] ? "✅" : "❌"}
                                </div>
                                <div style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: lifecycle[key] ? "#15803d" : "#dc2626"
                                }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: "#6b7280" }}>No lifecycle information available.</p>
                )}
            </section>

            {/* Similar Documents */}
            <section style={{
                background: "white",
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ color: "#1e3a5f", margin: "0 0 16px", fontSize: 20, fontWeight: 700 }}>
                    🧩 Similar Documents
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    {/* Notices */}
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
                            Notices ({similarDocs.notices?.length || 0})
                        </h3>
                        {similarDocs.notices?.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {similarDocs.notices.slice(0, 5).map(notice => (
                                    <li key={notice.id} style={{ marginBottom: 8 }}>
                                        <a
                                            href={notice.sourceUrl || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: "#2563eb",
                                                textDecoration: "none",
                                                fontSize: 14
                                            }}
                                        >
                                            {notice.subject}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ fontSize: 14, color: "#6b7280" }}>No similar notices found.</p>
                        )}
                    </div>

                    {/* Plan Items */}
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
                            Plan Items ({similarDocs.planItems?.length || 0})
                        </h3>
                        {similarDocs.planItems?.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {similarDocs.planItems.slice(0, 5).map(item => (
                                    <li key={item.id} style={{ marginBottom: 8 }}>
                                        <a
                                            href={item.sourceUrl || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: "#2563eb",
                                                textDecoration: "none",
                                                fontSize: 14
                                            }}
                                        >
                                            {item.subject}
                                        </a>
                                        <span style={{ color: "#6b7280", fontSize: 12, marginLeft: 8 }}>
                                            (CPV: {item.cpvCode})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ fontSize: 14, color: "#6b7280" }}>No similar plan items found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* AI Explanation */}
            <section style={{
                background: "white",
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ color: "#1e3a5f", margin: 0, fontSize: 20, fontWeight: 700 }}>
                        🤖 AI Explanation
                    </h2>
                    <button type="button"
                        onClick={handleGenerateAI}
                        disabled={generatingAI}
                        style={{
                            background: generatingAI ? "#9ca3af" : "#16a34a",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 20px",
                            fontWeight: 600,
                            cursor: generatingAI ? "not-allowed" : "pointer"
                        }}
                    >
                        {generatingAI ? "Generating..." : "Generate Explanation"}
                    </button>
                </div>

                {aiExplanation ? (
                    <div style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: 20,
                        lineHeight: 1.6
                    }}>
                        <h3 style={{ color: "#1e40af", marginTop: 0, fontSize: 18, fontWeight: 600 }}>
                            {aiExplanation.summaryText}
                        </h3>
                        <p style={{ marginBottom: 16, color: "#374151" }}>
                            {aiExplanation.explanationText}
                        </p>
                        <div style={{
                            background: "#dbeafe",
                            padding: 16,
                            borderRadius: 6,
                            borderLeft: "4px solid #2563eb"
                        }}>
                            <strong style={{ color: "#1e40af" }}>Recommendation:</strong>
                            <p style={{ margin: "8px 0 0", color: "#374151" }}>
                                {aiExplanation.recommendationText}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#6b7280",
                        background: "#f9fafb",
                        borderRadius: 8,
                        border: "1px solid #f3f4f6"
                    }}>
                        <p>No AI explanation generated yet.</p>
                        <p style={{ fontSize: 14 }}>Click "Generate Explanation" to create one.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
