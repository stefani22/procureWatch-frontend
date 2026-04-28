

const BASE_URL = "http://localhost:8080/api";

async function request(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json();
}


export async function getContracts(filters = {}) {
    const params = new URLSearchParams();


    if (filters.institution) params.append("searchText", filters.institution);
    if (filters.dateFrom)    params.append("dateFrom",   filters.dateFrom);
    if (filters.dateTo)      params.append("dateTo",     filters.dateTo);
    if (filters.minValue)    params.append("minValue",   filters.minValue);
    if (filters.maxValue)    params.append("maxValue",   filters.maxValue);

    params.append("page",    filters.page    ?? 0);
    params.append("size",    filters.size    ?? 20);
    params.append("sortBy",  filters.sortBy  ?? "contractDate");
    params.append("sortDir", filters.sortDir ?? "desc");

    const data = await request(`/contracts/search?${params}`);

    // backend полиња → frontend полиња
    return {
        items: data.content.map(mapContractRow),
        totalElements: data.totalElements,
        totalPages:    data.totalPages,
        page:          data.page,
    };
}

// Помошна функција — преведува еден ред од backend во frontend формат
function mapContractRow(c) {
    return {
        id:          c.contractId,
        institution: c.institutionName  ?? "—",
        supplier:    c.supplierName     ?? "—",
        amount:      c.contractValueVat ? Number(c.contractValueVat) : 0,
        currency:    "MKD",
        date:        c.contractDate     ?? "—",
        year:        c.contractDate ? new Date(c.contractDate).getFullYear() : null,
        riskScore:   c.riskScore        ? Math.round(Number(c.riskScore)) : 0,
        riskLevel:   c.riskLevel        ?? "UNKNOWN",
        // redFlags доаѓаат од risk assessment — се вчитуваат посебно
        redFlags:    [],
        type:        c.contractType     ?? "—",
        description: c.subject          ?? "—",
        noticeNumber: c.noticeNumber    ?? "—",
    };
}

// ── DASHBOARD: Stats ──────────────────────────────────────────────────────────
// Broime od vkupniot broj na contracts, notices, decisions
// Backend: GET /api/contracts/search (samo za vkupen broj)
export async function getDashboardStats() {
    const params = new URLSearchParams({ page: 0, size: 1 });
    const contracts = await request(`/contracts/search?${params}`);
    const notices   = await request(`/notices/paged?page=0&size=1`);
    const decisions = await request(`/decisions/paged?page=0&size=1`);

    return {
        plannedProcurements: contracts.totalElements ?? 0,
        tenderNotices:       notices.totalElements   ?? 0,
        decisions:           decisions.totalElements ?? 0,
        signedContracts:     contracts.totalElements ?? 0,
    };
}

// ── DASHBOARD: Red Flags count ────────────────────────────────────────────────
// Backend: GET /api/risk-assessments/risk-level/{riskLevel}
export async function getRedFlagCounts() {
    const high   = await request(`/risk-assessments/risk-level/HIGH`);
    const medium = await request(`/risk-assessments/risk-level/MEDIUM`);
    return {
        high:   high.length   ?? 0,
        medium: medium.length ?? 0,
        total:  high.length + medium.length,
    };
}

// ── RISK ASSESSMENT за еден contract ─────────────────────────────────────────
// Backend: GET /api/risk-assessments/contract/{contractId}
// GetRiskAssessmentDto со triggeredFlags листа
export async function getRiskAssessment(contractId) {
    try {
        const data = await request(`/risk-assessments/contract/${contractId}`);
        return {
            riskScore:    data.finalRiskScore ? Math.round(Number(data.finalRiskScore)) : 0,
            riskLevel:    data.riskLevel ?? "UNKNOWN",
            // triggeredFlags: [{ flagCode, flagName, flagDescription, weight }]
            redFlags:     (data.triggeredFlags ?? []).map(f => ({
                code:        f.flagCode,
                name:        f.flagName,
                description: f.flagDescription,
                weight:      f.weight,
            })),
        };
    } catch {
        return { riskScore: 0, riskLevel: "UNKNOWN", redFlags: [] };
    }
}

// ── PLANNED PROCUREMENTS: Institutions листа ──────────────────────────────────
// Backend: GET /api/institutions/getAll
// List<GetInstitutionDto>
// GetInstitutionDto: id, externalId, officialName, normalizedName,
//   institutionType, city, postalCode, category, sourceUrl
export async function getInstitutions() {
    const data = await request(`/institutions/getAll`);
    return data.map(inst => ({
        id:       inst.id,
        name:     inst.officialName   ?? inst.normalizedName ?? "—",
        type:     inst.institutionType ?? "—",
        city:     inst.city            ?? "—",
        category: inst.category        ?? "—",
        sourceUrl: inst.sourceUrl      ?? "",
    }));
}

// ── INSTITUTION DETAIL: Procurement Plans ────────────────────────────────────
// Backend: GET /api/procurement-plans/getByInstitutionId/{institutionId}
// List<GetProcurementPlanDto>
// GetProcurementPlanDto: id, institutionId, planYear, publicationDate,
//   sourceUrl, planItems[]
export async function getProcurementPlansByInstitution(institutionId) {
    const data = await request(`/procurement-plans/getByInstitutionId/${institutionId}`);
    return data.map(plan => ({
        id:              plan.id,
        year:            plan.planYear,
        publicationDate: plan.publicationDate,
        sourceUrl:       plan.sourceUrl,
        planItems:       (plan.planItems ?? []).map(item => ({
            id:          item.id,
            subject:     item.subject,
            contractType: item.contractType,
            procedureType: item.procedureType,
            cpvCode:     item.cpvCode,
            hasNotice:   item.hasNotice,
        })),
    }));
}

// ── INSTITUTION DETAIL: Notices ───────────────────────────────────────────────
// Backend: GET /api/notices/allByInstitution/{institutionId}
// List<GetNoticeDto>
// GetNoticeDto: id, institutionId, planItemId, decisionIds[],
//   noticeNumber, subject, contractType, procedureType, deadlineDate, sourceUrl
export async function getNoticesByInstitution(institutionId) {
    const data = await request(`/notices/allByInstitution/${institutionId}`);
    return data.map(notice => ({
        id:           notice.id,
        noticeNumber: notice.noticeNumber ?? "—",
        title:        notice.subject      ?? "—",
        contractType: notice.contractType ?? "—",
        deadline:     notice.deadlineDate ?? "—",
        sourceUrl:    notice.sourceUrl    ?? "",
    }));
}

// ── INSTITUTION DETAIL: Contracts po institucija ──────────────────────────────
// Backend: GET /api/contracts/getAllByInstitution/{institutionId}
export async function getContractsByInstitution(institutionId) {
    const data = await request(`/contracts/getAllByInstitution/${institutionId}`);
    return data.map(c => ({
        id:           c.id,
        noticeNumber: c.noticeNumber     ?? "—",
        subject:      c.subject          ?? "—",
        amount:       c.contractValueVat ? Number(c.contractValueVat) : 0,
        date:         c.contractDate     ?? "—",
        currency:     c.currency         ?? "MKD",
    }));
}

// ── INSTITUTION DETAIL: Decisions po institucija ──────────────────────────────
// Backend: GET /api/decisions/getAllForInstitution/{institutionId}
export async function getDecisionsByInstitution(institutionId) {
    const data = await request(`/decisions/getAllForInstitution/${institutionId}`);
    return data.map(d => ({
        id:           d.id,
        noticeNumber: d.noticeNumber  ?? "—",
        subject:      d.subject       ?? "—",
        date:         d.decisionDate  ?? "—",
        procedureType: d.procedureType ?? "—",
    }));
}