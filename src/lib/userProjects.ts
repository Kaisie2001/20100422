export interface ScenarioInput {
  id: string;
  name: string;
  frame: string;
  board: string;
  infill: string;
  connection: string;
  reusableLogic: string;
  areaM2?: string;
  applicationZone?: string;
  epdAvailable?: 'yes' | 'no';
  productName?: string;
  manufacturer?: string;
  originCountry?: string;
  declaredUnit?: string;
  supplierDocsAvailable?: 'yes' | 'no';
  shipmentOriginKnown?: 'yes' | 'no';
}

export type UserClaimReadiness = 'screening' | 'local-check' | 'claim-ready';

export interface UserPlanZoneAllocation {
  zoneName: string;
  areaM2: number;
  systemId: string;
}

export interface UserPlanScenario {
  id: string;
  name: string;
  intent: string;
  evidenceSummary: string;
  claimReadiness: UserClaimReadiness;
  hkLocalizationStatus: 'HK verified' | 'International EPD + HK CAT check required' | 'Screening only';
  hkCheckLogic: string;
  baseIntensityKgM2: number;
  hkAdjustedIntensityKgM2: number;
  transportFactor: number;
  dataQualityFactor: number;
  circularFactor: number;
  aggregatedTotalKg: number;
  deltaVsBaselinePct: number;
  zoneAllocations: UserPlanZoneAllocation[];
}

export interface UserProject {
  id: string;
  projectName: string;
  location: string;
  projectType: string;
  partitionArea: string;
  status: string;
  claimState: string;
  claimStateColor: string;
  completeness: number;
  evidence: string;
  createdAt: string;
  scenarios: ScenarioInput[];
  baselinePlanId: string;
  recommendedPlanId: string;
  plans: UserPlanScenario[];
}

const STORAGE_KEY = 'tracewall-user-projects';

export function getUserProjects(): UserProject[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Partial<UserProject>[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, idx) => ({
      id: item.id ?? `legacy-${idx}`,
      projectName: item.projectName ?? 'Untitled project',
      location: item.location ?? 'Hong Kong',
      projectType: item.projectType ?? 'Refurbishment',
      partitionArea: item.partitionArea ?? '0',
      status: item.status ?? 'In setup',
      claimState: item.claimState ?? 'In Setup',
      claimStateColor: item.claimStateColor ?? 'bg-orange-100 text-orange-700',
      completeness: item.completeness ?? 40,
      evidence: item.evidence ?? 'Basic',
      createdAt: item.createdAt ?? new Date(0).toISOString(),
      scenarios: item.scenarios ?? [],
      baselinePlanId: item.baselinePlanId ?? item.scenarios?.[0]?.id ?? 'baseline',
      recommendedPlanId:
        item.recommendedPlanId ?? item.scenarios?.[0]?.id ?? item.baselinePlanId ?? 'baseline',
      plans: (item.plans ?? []).map((plan, planIdx) => ({
        id: plan.id ?? `plan-${planIdx}`,
        name: plan.name ?? `Plan ${String.fromCharCode(65 + planIdx)}`,
        intent: plan.intent ?? 'Legacy plan',
        evidenceSummary: plan.evidenceSummary ?? 'Legacy evidence',
        claimReadiness: plan.claimReadiness ?? 'local-check',
        hkLocalizationStatus:
          plan.hkLocalizationStatus ?? 'International EPD + HK CAT check required',
        hkCheckLogic: plan.hkCheckLogic ?? 'Legacy data without explicit HK localization formula.',
        baseIntensityKgM2: plan.baseIntensityKgM2 ?? 0,
        hkAdjustedIntensityKgM2: plan.hkAdjustedIntensityKgM2 ?? 0,
        transportFactor: plan.transportFactor ?? 1,
        dataQualityFactor: plan.dataQualityFactor ?? 1,
        circularFactor: plan.circularFactor ?? 1,
        aggregatedTotalKg: plan.aggregatedTotalKg ?? 0,
        deltaVsBaselinePct: plan.deltaVsBaselinePct ?? 0,
        zoneAllocations: plan.zoneAllocations ?? [],
      })),
    }));
  } catch {
    return [];
  }
}

export function saveUserProjects(projects: UserProject[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addUserProject(project: UserProject) {
  const existing = getUserProjects();
  saveUserProjects([project, ...existing]);
}

export function getUserProjectById(id: string): UserProject | null {
  return getUserProjects().find((item) => item.id === id) ?? null;
}
