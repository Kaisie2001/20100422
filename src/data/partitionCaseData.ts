export type LocalizationStatus =
  | 'HK verified'
  | 'International EPD + HK CAT check required'
  | 'Screening only';

export type MaterialFamily =
  | 'Traditional'
  | 'Bio-based'
  | 'Composite'
  | 'HK common';

export interface OptionRow {
  id: string;
  name: string;
  family: MaterialFamily;
  wallType: string;
  boardEvidence: string;
  declaredUnit: string;
  localizationStatus: LocalizationStatus;
  hkCheckLogic: string;
  screeningOnly?: boolean;
  systemCarbonKgM2: number; // demo system-level output for UI
  deltaVsBaselinePct: number;
  notes: string;
}

export type ClaimReadiness = 'screening' | 'local-check' | 'claim-ready';

export interface PlanZoneAllocation {
  zoneName: string;
  areaM2: number;
  systemId: string;
}

export interface PlanScenario {
  id: string;
  name: string;
  intent: string;
  evidenceSummary: string;
  claimReadiness: ClaimReadiness;
  aggregatedTotalKg: number;
  deltaVsBaselinePct: number;
  zoneAllocations: PlanZoneAllocation[];
}

export interface CaseData {
  slug: 'central' | 'harbour' | 'kowloon';
  title: string;
  subtitle: string;
  location: string;
  projectType: string;
  partitionAreaM2: number;
  partitionTypes: number;
  baselineLabel: string;
  baselineTotalKg: number;
  bestOptionLabel: string;
  bestOptionTotalKg: number;
  totalSavingKg: number;
  totalSavingPct: number;
  evidenceCoverage: string;
  recommendation: string;
  baselinePlanId?: string;
  recommendedPlanId?: string;
  plans?: PlanScenario[];
  localizationRule: string[];
  options: OptionRow[];
}

export const partitionCases: Record<string, CaseData> = {
  central: {
    slug: 'central',
    title: 'Central Tower – Level 18 Tenant Reinstatement',
    subtitle:
      'Compare like-for-like dry partition options for a reinstatement scope with moderate area and fast turnover.',
    location: 'Central, Hong Kong',
    projectType: 'Tenant Reinstatement Fit-out',
    partitionAreaM2: 320,
    partitionTypes: 3,
    baselineLabel: 'Gypsum + steel dry partition',
    baselineTotalKg: 6840,
    bestOptionLabel: 'CLT hybrid partition',
    bestOptionTotalKg: 4280,
    totalSavingKg: 2560,
    totalSavingPct: 37,
    evidenceCoverage: '2 verified / 3 localized / 1 screening proxy',
    recommendation:
      'Use this case to show a standard office reinstatement baseline, then compare how alternative board layers change wall-level and project-level carbon under the same framing logic.',
    baselinePlanId: 'plan-a',
    recommendedPlanId: 'plan-c',
    plans: [
      {
        id: 'plan-a',
        name: 'Plan A / Baseline',
        intent: 'Conventional reinstatement',
        evidenceSummary: 'Traditional board + steel stud, standard local-check path.',
        claimReadiness: 'local-check',
        aggregatedTotalKg: 6840,
        deltaVsBaselinePct: 0,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 180, systemId: 'gypsum' },
          { zoneName: 'Meeting rooms', areaM2: 90, systemId: 'gypsum' },
          { zoneName: 'Corridor', areaM2: 50, systemId: 'gypsum' },
        ],
      },
      {
        id: 'plan-b',
        name: 'Plan B / Lower-carbon upgrade',
        intent: 'Conservative lower-carbon replacement',
        evidenceSummary: 'HK common board route with CAT check; lower risk transition.',
        claimReadiness: 'local-check',
        aggregatedTotalKg: 6110,
        deltaVsBaselinePct: -11,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 180, systemId: 'calsil' },
          { zoneName: 'Meeting rooms', areaM2: 90, systemId: 'calsil' },
          { zoneName: 'Corridor', areaM2: 50, systemId: 'gypsum' },
        ],
      },
      {
        id: 'plan-c',
        name: 'Plan C / Bio-based pathway',
        intent: 'Aggressive carbon reduction pathway',
        evidenceSummary: 'CLT hybrid used for major areas, still pending HK localization checks.',
        claimReadiness: 'local-check',
        aggregatedTotalKg: 4280,
        deltaVsBaselinePct: -37,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 180, systemId: 'clt' },
          { zoneName: 'Meeting rooms', areaM2: 90, systemId: 'clt' },
          { zoneName: 'Corridor', areaM2: 50, systemId: 'gypsum' },
        ],
      },
    ],
    localizationRule: [
      'Keep original EPD data as product evidence; do not overwrite foreign EPD values.',
      'For conventional materials, add Hong Kong CAT/local-check layer before presenting project results.',
      'Board-like materials can be normalized for early screening, but final claims must stay at partition-system level.',
      'If the product is not a dedicated partition-board EPD, mark it as screening only.',
    ],
    options: [
      {
        id: 'gypsum',
        name: 'Gyproc FireLine + steel stud',
        family: 'Traditional',
        wallType: 'Conventional dry partition baseline',
        boardEvidence: 'Gyproc FireLine 12.5 mm board baseline + visible steel framing',
        declaredUnit: 'Board: 1 m² installed / Framing: 1 kg',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Check conventional board and steel against CAT-compatible Hong Kong assumptions before final project output.',
        systemCarbonKgM2: 21.4,
        deltaVsBaselinePct: 0,
        notes:
          'Use as the comparison anchor. Traditional baseline, directly relevant for office partition use.',
      },
      {
        id: 'calsil',
        name: 'Calcium silicate board + steel stud',
        family: 'HK common',
        wallType: 'HK common wet-area / robust board option',
        boardEvidence: 'No auditable row loaded yet; use local-check placeholder',
        declaredUnit: 'To be replaced by board-specific EPD / CAT row',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Keep as a Hong Kong-common partition option but mark as pending auditable CAT / EPD data.',
        systemCarbonKgM2: 19.8,
        deltaVsBaselinePct: -7,
        notes:
          'Added because it is common in Hong Kong practice, but current numbers are prototype placeholders.',
      },
      {
        id: 'clt',
        name: 'CLT panel + light steel hybrid',
        family: 'Bio-based',
        wallType: 'Bio-based timber reference system',
        boardEvidence: 'CLT by Stora Enso; board-like screening normalization available',
        declaredUnit: 'EPD declared unit 1 m³; screening normalized to 1 m² @ 12.5 mm',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Keep biogenic split visible, then add Hong Kong transport / project assumptions separately.',
        systemCarbonKgM2: 13.4,
        deltaVsBaselinePct: -37,
        notes:
          'Best reduction in this demo case, but should still be discussed with assembly and performance checks.',
      },
      {
        id: 'bamboo',
        name: 'Bamboo composite + steel stud',
        family: 'Composite',
        wallType: 'Bamboo-based composite screening option',
        boardEvidence: 'Holse & Wibroe bamboo wood composite',
        declaredUnit: 'EPD declared unit 1 kg; screening normalized for board-like comparison',
        localizationStatus: 'Screening only',
        hkCheckLogic:
          'Do not present as a verified one-to-one substitute for gypsum partition board.',
        screeningOnly: true,
        systemCarbonKgM2: 18.9,
        deltaVsBaselinePct: -12,
        notes:
          'Useful to show carbon directionality for bamboo composites, but not a final equivalent-wall claim.',
      },
      {
        id: 'glass',
        name: 'Glazed aluminium partition',
        family: 'HK common',
        wallType: 'HK common commercial office partition type',
        boardEvidence: 'Project placeholder row for glass/aluminium system',
        declaredUnit: 'To be replaced by auditable system-level product data',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Requires Hong Kong-specific product and transport assumptions before final carbon disclosure.',
        systemCarbonKgM2: 24.6,
        deltaVsBaselinePct: 15,
        notes:
          'Included because it is common in office interiors, but current values are prototype placeholders.',
      },
    ],
  },

  harbour: {
    slug: 'harbour',
    title: 'Harbour Business Centre – Low-Carbon Fit-out Upgrade',
    subtitle:
      'A design-option case focused on reducing fit-out carbon while keeping stronger acoustic and fire requirements visible.',
    location: 'Wan Chai, Hong Kong',
    projectType: 'ESG-led Fit-out Upgrade',
    partitionAreaM2: 540,
    partitionTypes: 4,
    baselineLabel: 'Gypsum + steel dry partition',
    baselineTotalKg: 11880,
    bestOptionLabel: 'Calcium silicate optimized system',
    bestOptionTotalKg: 10420,
    totalSavingKg: 1460,
    totalSavingPct: 12,
    evidenceCoverage: '1 verified / 4 localized / 1 screening proxy',
    recommendation:
      'Use this case to show that the “best” option is not always the most negative board number. Once performance requirements increase, the recommended system may shift toward a more conservative low-carbon upgrade rather than a pure bio-based swap.',
    baselinePlanId: 'plan-a',
    recommendedPlanId: 'plan-b',
    plans: [
      {
        id: 'plan-a',
        name: 'Plan A / Baseline',
        intent: 'Performance baseline under stricter constraints',
        evidenceSummary: 'Conventional gypsum benchmark retained for compliance and comparability.',
        claimReadiness: 'local-check',
        aggregatedTotalKg: 11880,
        deltaVsBaselinePct: 0,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 300, systemId: 'gypsum' },
          { zoneName: 'Meeting rooms', areaM2: 160, systemId: 'gypsum' },
          { zoneName: 'Service areas', areaM2: 80, systemId: 'gypsum' },
        ],
      },
      {
        id: 'plan-b',
        name: 'Plan B / Recommended low-carbon',
        intent: 'Balanced carbon + performance route',
        evidenceSummary: 'Calcium silicate dominant mix chosen for practicality and lower risk.',
        claimReadiness: 'local-check',
        aggregatedTotalKg: 10420,
        deltaVsBaselinePct: -12,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 300, systemId: 'calsil' },
          { zoneName: 'Meeting rooms', areaM2: 160, systemId: 'calsil' },
          { zoneName: 'Service areas', areaM2: 80, systemId: 'gypsum' },
        ],
      },
      {
        id: 'plan-c',
        name: 'Plan C / Screening bio-based',
        intent: 'Carbon-leading but lower claim certainty',
        evidenceSummary: 'CLT route shows strong reduction but still treated as screening-sensitive.',
        claimReadiness: 'screening',
        aggregatedTotalKg: 9020,
        deltaVsBaselinePct: -24,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 300, systemId: 'clt' },
          { zoneName: 'Meeting rooms', areaM2: 160, systemId: 'clt' },
          { zoneName: 'Service areas', areaM2: 80, systemId: 'calsil' },
        ],
      },
    ],
    localizationRule: [
      'Do not compare raw EPD numbers as if they were interchangeable design results.',
      'Keep frame spacing, wall logic, and performance assumptions visible at system level.',
      'Use Hong Kong localization as a second layer after product evidence, not as a replacement for product evidence.',
      'Mark missing Hong Kong-common product rows as placeholders until auditable values are available.',
    ],
    options: [
      {
        id: 'gypsum',
        name: 'Gyproc FireLine + steel stud',
        family: 'Traditional',
        wallType: 'Conventional acoustic/fire baseline',
        boardEvidence: 'Directly relevant board baseline + visible steel framing',
        declaredUnit: 'Board: 1 m² installed / Framing: 1 kg',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Conventional baseline still needs Hong Kong transport and local-check layer.',
        systemCarbonKgM2: 22.0,
        deltaVsBaselinePct: 0,
        notes: 'Baseline retained for like-for-like comparison.',
      },
      {
        id: 'calsil',
        name: 'Calcium silicate board + steel stud',
        family: 'HK common',
        wallType: 'Performance-oriented HK common system',
        boardEvidence: 'Pending board-specific auditable row',
        declaredUnit: 'Replace with CAT / EPD source later',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Current result is demo-only until Hong Kong-checkable row is added.',
        systemCarbonKgM2: 19.3,
        deltaVsBaselinePct: -12,
        notes:
          'Recommended in this case because the design story is “lower carbon under stronger performance constraints”, not purely “lowest possible board value”.',
      },
      {
        id: 'clt',
        name: 'CLT panel + hybrid frame',
        family: 'Bio-based',
        wallType: 'Timber screening option',
        boardEvidence: 'CLT reference with strong biogenic effect',
        declaredUnit: 'EPD 1 m³; normalized for board-like screening only',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Keep as comparison option, but do not overstate equivalence without full assembly validation.',
        systemCarbonKgM2: 15.1,
        deltaVsBaselinePct: -31,
        notes:
          'Lower carbon in screening, but this case is intentionally more conservative in its recommendation.',
      },
      {
        id: 'bamboo',
        name: 'Bamboo composite + steel stud',
        family: 'Composite',
        wallType: 'Composite screening option',
        boardEvidence: 'Bamboo composite flooring EPD proxy',
        declaredUnit: 'EPD 1 kg; board-like normalization only',
        localizationStatus: 'Screening only',
        hkCheckLogic:
          'Keep visible, but do not treat as a verified partition-board result.',
        screeningOnly: true,
        systemCarbonKgM2: 20.1,
        deltaVsBaselinePct: -9,
        notes:
          'Included to show directionality for composite-based substitution, not final specification.',
      },
      {
        id: 'glass',
        name: 'Glazed aluminium partition',
        family: 'HK common',
        wallType: 'Commercial meeting-room / office glazing option',
        boardEvidence: 'System placeholder',
        declaredUnit: 'System-level row needed',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Requires auditable glass/aluminium row before final reporting.',
        systemCarbonKgM2: 26.1,
        deltaVsBaselinePct: 19,
        notes:
          'Useful as a visible “not all premium systems are lower-carbon” comparator.',
      },
    ],
  },

  kowloon: {
    slug: 'kowloon',
    title: 'Kowloon Bay Flex Office – Decommissioning Pilot',
    subtitle:
      'A decommissioning and circularity case that emphasizes removability, reuse logic, and evidence-linked end-of-life outcomes.',
    location: 'Kowloon Bay, Hong Kong',
    projectType: 'Decommissioning Pilot',
    partitionAreaM2: 410,
    partitionTypes: 5,
    baselineLabel: 'Gypsum + steel dry partition',
    baselineTotalKg: 8610,
    bestOptionLabel: 'Modular glazed aluminium reuse case',
    bestOptionTotalKg: 6720,
    totalSavingKg: 1890,
    totalSavingPct: 22,
    evidenceCoverage: '2 verified / 3 localized / 1 screening proxy',
    recommendation:
      'Use this case to show that the best case is not always the lowest upfront product number. In decommissioning, removability and route-to-reuse can materially change the recommended system story.',
    baselinePlanId: 'plan-a',
    recommendedPlanId: 'plan-c',
    plans: [
      {
        id: 'plan-a',
        name: 'Plan A / Demolition baseline',
        intent: 'Conventional replacement benchmark',
        evidenceSummary: 'Traditional gypsum + steel route under conservative end-of-life assumptions.',
        claimReadiness: 'local-check',
        aggregatedTotalKg: 8610,
        deltaVsBaselinePct: 0,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 220, systemId: 'gypsum' },
          { zoneName: 'Meeting rooms', areaM2: 120, systemId: 'gypsum' },
          { zoneName: 'Corridor', areaM2: 70, systemId: 'gypsum' },
        ],
      },
      {
        id: 'plan-b',
        name: 'Plan B / Conservative improvement',
        intent: 'Minor reduction with familiar materials',
        evidenceSummary: 'HK common board route, moderate gains and straightforward execution.',
        claimReadiness: 'local-check',
        aggregatedTotalKg: 8080,
        deltaVsBaselinePct: -6,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 220, systemId: 'calsil' },
          { zoneName: 'Meeting rooms', areaM2: 120, systemId: 'gypsum' },
          { zoneName: 'Corridor', areaM2: 70, systemId: 'calsil' },
        ],
      },
      {
        id: 'plan-c',
        name: 'Plan C / Reuse-led modular',
        intent: 'Decommissioning + reuse-focused strategy',
        evidenceSummary: 'Demountable modular glazing prioritized for route-to-reuse evidence.',
        claimReadiness: 'claim-ready',
        aggregatedTotalKg: 6720,
        deltaVsBaselinePct: -22,
        zoneAllocations: [
          { zoneName: 'Open office', areaM2: 220, systemId: 'glass' },
          { zoneName: 'Meeting rooms', areaM2: 120, systemId: 'glass' },
          { zoneName: 'Corridor', areaM2: 70, systemId: 'calsil' },
        ],
      },
    ],
    localizationRule: [
      'Keep upfront product evidence and end-of-life evidence visibly separate.',
      'A lower-carbon claim should not unlock unless the downstream route is evidenced.',
      'For reuse-oriented options, the project page should show evidence status, not just a better carbon total.',
      'Hong Kong end-of-life assumptions should remain conservative unless real destination proof exists.',
    ],
    options: [
      {
        id: 'gypsum',
        name: 'Gyproc FireLine + steel stud',
        family: 'Traditional',
        wallType: 'Conventional demolition baseline',
        boardEvidence: 'Directly relevant board baseline + steel framing',
        declaredUnit: 'Board: 1 m² installed / Framing: 1 kg',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Use as the demolition baseline under conservative Hong Kong end-of-life assumptions.',
        systemCarbonKgM2: 21.0,
        deltaVsBaselinePct: 0,
        notes: 'Baseline for demolition-oriented office fit-out replacement.',
      },
      {
        id: 'calsil',
        name: 'Calcium silicate board + steel stud',
        family: 'HK common',
        wallType: 'HK common robust board option',
        boardEvidence: 'Pending auditable row',
        declaredUnit: 'Replace with local board row later',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Still a placeholder, but useful as a local common option.',
        systemCarbonKgM2: 20.2,
        deltaVsBaselinePct: -4,
        notes: 'Minor reduction only in this decommissioning case.',
      },
      {
        id: 'clt',
        name: 'CLT panel + hybrid frame',
        family: 'Bio-based',
        wallType: 'Bio-based screening option',
        boardEvidence: 'CLT screening reference',
        declaredUnit: 'EPD 1 m³; normalized for board-like screening',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Biogenic benefit is visible, but circular recommendation depends on actual route.',
        systemCarbonKgM2: 16.0,
        deltaVsBaselinePct: -24,
        notes:
          'Strong upfront screening result, but this case emphasizes reuse pathway evidence, not just upfront delta.',
      },
      {
        id: 'bamboo',
        name: 'Bamboo composite + steel stud',
        family: 'Composite',
        wallType: 'Composite screening option',
        boardEvidence: 'Proxy EPD only',
        declaredUnit: 'EPD 1 kg; screening-only normalization',
        localizationStatus: 'Screening only',
        hkCheckLogic:
          'Not a final claim row. Keep as visible proxy only.',
        screeningOnly: true,
        systemCarbonKgM2: 19.6,
        deltaVsBaselinePct: -7,
        notes: 'Screening-only comparator in the decommissioning story.',
      },
      {
        id: 'glass',
        name: 'Modular glazed aluminium partition',
        family: 'HK common',
        wallType: 'Demountable / reusable office partition system',
        boardEvidence: 'Prototype system row with reuse-first logic',
        declaredUnit: 'System-level placeholder until auditable row is added',
        localizationStatus: 'International EPD + HK CAT check required',
        hkCheckLogic:
          'Best used in decommissioning pilot because route-to-reuse can be evidenced at system level.',
        systemCarbonKgM2: 16.4,
        deltaVsBaselinePct: -22,
        notes:
          'Recommended here because the case is about decommissioning and reuse evidence, not just lowest board-level carbon.',
      },
    ],
  },
};