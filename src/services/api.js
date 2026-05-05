const BASE_URL = "http://localhost:8080/api";

async function request(path, token) {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, { headers });
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json();
}

async function post(path, body, token) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json();
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { usernameOrEmail, password }
// Returns: { token, userId, username, email, role }
export async function login(usernameOrEmail, password) {
    return post("/auth/login", { usernameOrEmail, password });
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
// GET /api/dashboard/overview
// Returns: { kpis, topInstitutions, topSuppliers, procedureTypeDistribution,
//            contractTypeDistribution, monthlyTrends }
export async function getDashboardOverview(filters = {}) {
    const params = new URLSearchParams();
    if (filters.dateFrom)      params.append("dateFrom",      filters.dateFrom);
    if (filters.dateTo)        params.append("dateTo",        filters.dateTo);
    if (filters.institutionId) params.append("institutionId", filters.institutionId);
    if (filters.supplierId)    params.append("supplierId",    filters.supplierId);
    if (filters.procedureType) params.append("procedureType", filters.procedureType);
    if (filters.contractType)  params.append("contractType",  filters.contractType);
    if (filters.riskLevel)     params.append("riskLevel",     filters.riskLevel);
    params.append("limit", filters.limit ?? 5);
    return request(`/dashboard/overview?${params}`);
}

// ── HIGH RISK QUEUE ───────────────────────────────────────────────────────────
// GET /api/high-risk-queue
// Returns: PagedResponseDto<HighRiskQueueItemDto>
// HighRiskQueueItemDto: contractId, noticeNumber, subject, institutionId,
//   institutionName, supplierId, supplierName, contractValueVat, contractDate,
//   finalRiskScore, riskLevel, priorityRank, flagCount, flagNames[], explanationPreview
export async function getHighRiskQueue(filters = {}) {
    const params = new URLSearchParams();
    if (filters.riskLevel)     params.append("riskLevel",     filters.riskLevel);
    if (filters.institutionId) params.append("institutionId", filters.institutionId);
    if (filters.supplierId)    params.append("supplierId",    filters.supplierId);
    if (filters.dateFrom)      params.append("dateFrom",      filters.dateFrom);
    if (filters.dateTo)        params.append("dateTo",        filters.dateTo);
    if (filters.minValue)      params.append("minValue",      filters.minValue);
    if (filters.maxValue)      params.append("maxValue",      filters.maxValue);
    if (filters.flagCode)      params.append("flagCode",      filters.flagCode);
    params.append("page",    filters.page    ?? 0);
    params.append("size",    filters.size    ?? 20);
    params.append("sortBy",  "priorityRank");
    params.append("sortDir", "asc");

    const data = await request(`/high-risk-queue?${params}`);
    return {
        items: (data.content || []).map(item => ({
            id:           item.contractId,
            noticeNumber: item.noticeNumber       ?? "—",
            subject:      item.subject            ?? "—",
            institution:  item.institutionName    ?? "—",
            institutionId: item.institutionId,
            supplier:     item.supplierName       ?? "—",
            supplierId:   item.supplierId,
            amount:       item.contractValueVat ? Number(item.contractValueVat) : 0,
            date:         item.contractDate       ?? "—",
            riskScore:    item.finalRiskScore ? Math.round(Number(item.finalRiskScore)) : 0,
            riskLevel:    item.riskLevel          ?? "UNKNOWN",
            priorityRank: item.priorityRank       ?? 0,
            flagCount:    item.flagCount           ?? 0,
            flagNames:    item.flagNames           ?? [],
            explanation:  item.explanationPreview ?? "",
        })),
        totalElements: data.totalElements ?? 0,
        totalPages:    data.totalPages    ?? 0,
    };
}

// ── CONTRACTS ─────────────────────────────────────────────────────────────────
// GET /api/contracts/search
export async function getContracts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.institution) params.append("searchText",   filters.institution);
    if (filters.dateFrom)    params.append("dateFrom",     filters.dateFrom);
    if (filters.dateTo)      params.append("dateTo",       filters.dateTo);
    if (filters.minValue)    params.append("minValue",     filters.minValue);
    if (filters.maxValue)    params.append("maxValue",     filters.maxValue);
    if (filters.riskLevel)   params.append("riskLevel",    filters.riskLevel);
    params.append("page",    filters.page    ?? 0);
    params.append("size",    filters.size    ?? 20);
    params.append("sortBy",  filters.sortBy  ?? "contractDate");
    params.append("sortDir", filters.sortDir ?? "desc");

    const data = await request(`/contracts/search?${params}`);
    return {
        items: (data.content || []).map(c => ({
            id:           c.contractId,
            institution:  c.institutionName  ?? "—",
            supplier:     c.supplierName     ?? "—",
            amount:       c.contractValueVat ? Number(c.contractValueVat) : 0,
            currency:     "MKD",
            date:         c.contractDate     ?? "—",
            year:         c.contractDate ? new Date(c.contractDate).getFullYear() : null,
            riskScore:    c.riskScore ? Math.round(Number(c.riskScore)) : 0,
            riskLevel:    c.riskLevel        ?? "UNKNOWN",
            redFlags:     c.flagNames        ?? [],
            type:         c.contractType     ?? "—",
            description:  c.subject          ?? "—",
            noticeNumber: c.noticeNumber     ?? "—",
        })),
        totalElements: data.totalElements ?? 0,
        totalPages:    data.totalPages    ?? 0,
        page:          data.page          ?? 0,
    };
}

// ── INSTITUTIONS ──────────────────────────────────────────────────────────────
// GET /api/institutions/getAll
export async function getInstitutions() {
    const data = await request(`/institutions/getAll`);
    return data.map(inst => ({
        id:       inst.id,
        name:     inst.officialName    ?? inst.normalizedName ?? "—",
        type:     inst.institutionType ?? "—",
        city:     inst.city            ?? "—",
        category: inst.category        ?? "—",
        sourceUrl: inst.sourceUrl      ?? "",
    }));
}

// ── INSTITUTION DETAIL ────────────────────────────────────────────────────────
export async function getProcurementPlansByInstitution(institutionId) {
    const data = await request(`/procurement-plans/getByInstitutionId/${institutionId}`);
    return data.map(plan => ({
        id:              plan.id,
        year:            plan.planYear,
        publicationDate: plan.publicationDate,
        sourceUrl:       plan.sourceUrl,
        planItems: (plan.planItems ?? []).map(item => ({
            id:           item.id,
            subject:      item.subject,
            contractType: item.contractType,
            procedureType: item.procedureType,
            cpvCode:      item.cpvCode,
            hasNotice:    item.hasNotice,
        })),
    }));
}

export async function getNoticesByInstitution(institutionId) {
    const data = await request(`/notices/allByInstitution/${institutionId}`);
    return data.map(n => ({
        id:           n.id,
        noticeNumber: n.noticeNumber ?? "—",
        title:        n.subject      ?? "—",
        contractType: n.contractType ?? "—",
        deadline:     n.deadlineDate ?? "—",
        sourceUrl:    n.sourceUrl    ?? "",
    }));
}

export async function getContractsByInstitution(institutionId) {
    const data = await request(`/contracts/getAllByInstitution/${institutionId}`);
    return data.map(c => ({
        id:           c.id,
        noticeNumber: c.noticeNumber     ?? "—",
        subject:      c.subject          ?? "—",
        amount:       c.contractValueVat ? Number(c.contractValueVat) : 0,
        date:         c.contractDate     ?? "—",
        currency:     "MKD",
    }));
}

export async function getDecisionsByInstitution(institutionId) {
    const data = await request(`/decisions/getAllForInstitution/${institutionId}`);
    return data.map(d => ({
        id:           d.id,
        noticeNumber: d.noticeNumber   ?? "—",
        subject:      d.subject        ?? "—",
        date:         d.decisionDate   ?? "—",
        procedureType: d.procedureType ?? "—",
    }));
}
// ── RISK ASSESSMENTS ──────────────────────────────────────────────────────────
export async function getRiskAssessmentsByLevel(riskLevel, page = 0, size = 20) {
    const params = new URLSearchParams({ page, size });
    const data = await request(`/risk-assessments/risk-level/${riskLevel}?${params}`);
    return {
        items: (data.content || []).map(a => ({
            id:               a.id,
            contractId:       a.contractId,
            ruleScore:        a.ruleScore        ? Math.round(Number(a.ruleScore))        : 0,
            anomalyScore:     a.anomalyScore     ? Math.round(Number(a.anomalyScore))     : 0,
            similarityScore:  a.similarityScore  ? Math.round(Number(a.similarityScore))  : 0,
            clusterScore:     a.clusterScore     ? Math.round(Number(a.clusterScore))     : 0,
            finalRiskScore:   a.finalRiskScore   ? Math.round(Number(a.finalRiskScore))   : 0,
            riskLevel:        a.riskLevel        ?? "UNKNOWN",
            priorityRank:     a.priorityRank     ?? 0,
            modelVersion:     a.modelVersion     ?? "—",
            evaluatedAt:      a.evaluatedAt      ?? null,
            triggeredFlags:   a.triggeredFlags   ?? [],
        })),
        totalElements: data.totalElements ?? 0,
        totalPages:    data.totalPages    ?? 0,
    };
}

export async function evaluateAllContracts() {
    return request(`/risk-assessments/evaluate/all`, { method: "POST" });
}

export async function evaluateContract(contractId) {
    return request(`/risk-assessments/evaluate/contract/${contractId}`, { method: "POST" });
}