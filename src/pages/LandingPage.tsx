import { ArrowRight, Building2, ChartColumn, CircleCheck, Files, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { partitionCases } from '../data/partitionCaseData';
import { useLocale } from '../lib/locale';

const valueCards = [{ icon: Scale }, { icon: Building2 }, { icon: Files }];

const featuredCaseNames = {
  en: {
    central: 'Central Tower',
    harbour: 'Harbour Business Centre',
    kowloon: 'Kowloon Bay Flex Office',
  },
  zh: {
    central: '中環大廈',
    harbour: '港灣商務中心',
    kowloon: '九龍灣彈性辦公室',
  },
} as const;

const featuredCases = [
  {
    name: 'Central Tower',
    caseKey: 'central',
    route: '/projects/demo/central',
  },
  {
    name: 'Harbour Business Centre',
    caseKey: 'harbour',
    route: '/projects/demo/harbour',
  },
  {
    name: 'Kowloon Bay Flex Office',
    caseKey: 'kowloon',
    route: '/projects/demo/kowloon',
  },
];

const copy = {
  en: {
    hero: {
      title: 'Compare partition-system carbon with confidence.',
      subtitle:
        'TraceWall-HK helps landlords, tenants, consultants, and contractors make data-backed fit-out decisions with local assumptions and evidence visibility.',
      ctaExplore: 'Explore Projects',
      ctaNew: 'Start New Project',
      snapshot: 'Sample Decision Snapshot',
    },
    badges: {
      hkNative: 'HK Native',
      enterprise: 'Enterprise B2B SaaS',
      carbon: 'Carbon Comparison',
    },
    snapshot: {
      baseline: 'Baseline',
      bestOption: 'Best Option',
      reduction: 'Estimated Reduction',
      coverage: 'Evidence Coverage',
    },
    chart: {
      label: 'Carbon Profile Preview',
      title: 'Baseline vs low-carbon pathways',
      subtitle: 'Embodied carbon intensity (kgCO2e/m2, indicative)',
      legendA: 'Traditional',
      legendB: 'Bio-based Hybrid',
      legendC: 'Composite Optimized',
    },
    featured: {
      label: 'Featured Cases',
      title: 'Real Hong Kong fit-out scenarios',
      viewAll: 'View All',
      openCase: 'Open case',
      viewAllMobile: 'View All Cases',
      score: 'Decarbonization score',
      statuses: {
        baselineUpgrade: 'Baseline Upgrade',
        scenarioStudy: 'Scenario Study',
        pilotProgram: 'Pilot Program',
      },
    },
    metrics: {
      dataScale: 'Data Scale',
      dataScaleDesc: 'Partition option combinations per project.',
      governance: 'Governance',
      governanceValue: 'Audit-ready',
      governanceDesc: 'Evidence status visible at component level.',
      localization: 'Localization',
      localizationValue: 'HK-first',
      localizationDesc: 'Transport and sourcing assumptions for Hong Kong.',
    },
    capabilities: {
      label: 'Core Capabilities',
      title: 'Premium workflow for enterprise fit-out teams',
      items: [
        {
          title: 'System-first Comparison',
          desc: 'Compare full partition assemblies under one boundary, not disconnected materials.',
        },
        {
          title: 'Hong Kong Localization',
          desc: 'Keep original EPD evidence and apply local transport, sourcing, and CAT logic.',
        },
        {
          title: 'Audit-ready Output',
          desc: 'Produce clear carbon deltas, assumptions, and evidence status for decision teams.',
        },
      ],
    },
    how: {
      label: 'How It Works',
      title: 'From scope to decision in 3 steps',
      flow: 'Operational Flow',
      stepLabel: 'Step',
      steps: [
        {
          title: 'Define project boundary',
          desc: 'Set fit-out scope, partition types, and baseline assumptions.',
        },
        {
          title: 'Run option scenarios',
          desc: 'Compare traditional, low-carbon, and hybrid pathways in one model.',
        },
        {
          title: 'Publish decision pack',
          desc: 'Export summary metrics, evidence trail, and recommendation notes.',
        },
      ],
    },
    cta: {
      title: 'Ready to model your first project?',
      subtitle:
        'Create a new workspace and start comparing partition systems with HK-localized carbon logic.',
      createWorkspace: 'Create Workspace',
      viewCases: 'View Cases',
    },
  },
  zh: {
    hero: {
      title: '以系統維度比較隔間碳排，更快做出可信決策。',
      subtitle:
        'TraceWall-HK 協助業主、租戶、顧問與承建商在香港情境下完成具證據的低碳裝修決策。',
      ctaExplore: '查看專案',
      ctaNew: '建立新專案',
      snapshot: '決策快照',
    },
    badges: {
      hkNative: '香港原生流程',
      enterprise: '企業級 B2B SaaS',
      carbon: '碳排比較',
    },
    snapshot: {
      baseline: '基準方案',
      bestOption: '最佳方案',
      reduction: '預估降幅',
      coverage: '證據覆蓋率',
    },
    chart: {
      label: '碳排圖譜預覽',
      title: '基準方案與低碳路徑對比',
      subtitle: '單位面積隱含碳（kgCO2e/m2，示意）',
      legendA: '傳統方案',
      legendB: '生物基混合',
      legendC: '複合優化',
    },
    featured: {
      label: '精選案例',
      title: '真實香港裝修情境',
      viewAll: '查看全部',
      openCase: '開啟案例',
      viewAllMobile: '查看全部案例',
      score: '減碳評分',
      statuses: {
        baselineUpgrade: '基準優化',
        scenarioStudy: '方案研究',
        pilotProgram: '試點專案',
      },
    },
    metrics: {
      dataScale: '數據規模',
      dataScaleDesc: '每個專案可比較的隔間方案組合。',
      governance: '治理合規',
      governanceValue: '可審計',
      governanceDesc: '構件層級可見證據狀態。',
      localization: '在地化',
      localizationValue: '香港優先',
      localizationDesc: '納入香港運輸與採購假設。',
    },
    capabilities: {
      label: '核心能力',
      title: '為企業級裝修團隊打造的高品質流程',
      items: [
        {
          title: '系統優先比較',
          desc: '在同一邊界下比較完整隔間系統，而非割裂的單一材料。',
        },
        {
          title: '香港在地化',
          desc: '保留原始 EPD 證據，再疊加本地運輸、採購與 CAT 邏輯。',
        },
        {
          title: '可審計輸出',
          desc: '輸出清晰的碳差值、假設條件與證據狀態，支援決策與匯報。',
        },
      ],
    },
    how: {
      label: '運作方式',
      title: '三步完成從範圍定義到決策輸出',
      flow: '作業流程',
      stepLabel: '步驟',
      steps: [
        {
          title: '定義專案邊界',
          desc: '設定裝修範圍、隔間類型與基準假設。',
        },
        {
          title: '執行方案比較',
          desc: '在同一模型下比較傳統、低碳與混合路徑。',
        },
        {
          title: '輸出決策文件',
          desc: '匯出摘要指標、證據脈絡與建議說明。',
        },
      ],
    },
    cta: {
      title: '準備開始你的第一個專案了嗎？',
      subtitle: '建立新工作區，開始基於香港在地化邏輯進行隔間系統碳排比較。',
      createWorkspace: '建立工作區',
      viewCases: '查看案例',
    },
  },
} as const;

export default function LandingPage() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const t = copy[locale];
  const caseList = Object.values(partitionCases);

  const familyAverages = {
    traditional: averageOfFamily('Traditional'),
    bioBased: averageOfFamily('Bio-based'),
    composite: averageOfFamily('Composite'),
  };
  const maxFamilyValue = Math.max(
    familyAverages.traditional,
    familyAverages.bioBased,
    familyAverages.composite,
  );

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white px-6 py-10 md:px-10 md:py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-brand-100 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-info-100 blur-3xl" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="relative mb-5 flex flex-wrap gap-2">
          <span className="badge badge-info">{t.badges.hkNative}</span>
          <span className="badge badge-neutral">{t.badges.enterprise}</span>
          <span className="badge badge-success">{t.badges.carbon}</span>
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-6xl">{t.hero.title}</h1>
            <p className="max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">{t.hero.subtitle}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="btn btn-primary w-full sm:w-auto" onClick={() => navigate('/projects')}>
                {t.hero.ctaExplore}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="btn btn-secondary w-full sm:w-auto" onClick={() => navigate('/projects/new')}>
                {t.hero.ctaNew}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              {t.hero.snapshot}
            </div>
            <div className="mb-5 space-y-3">
              <MetricRow label={t.snapshot.baseline} value={caseList[0].baselineLabel} />
              <MetricRow label={t.snapshot.bestOption} value={caseList[0].bestOptionLabel} highlight />
              <MetricRow label={t.snapshot.reduction} value={`-${caseList[0].totalSavingPct}%`} />
              <MetricRow label={t.snapshot.coverage} value={caseList[0].evidenceCoverage} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md bg-white p-3 border border-neutral-200">
                <div className="text-xs text-neutral-500">{t.chart.legendA}</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">{familyAverages.traditional}</div>
              </div>
              <div className="rounded-md bg-success-50 p-3 border border-success-100">
                <div className="text-xs text-success-700">{t.chart.legendB}</div>
                <div className="mt-1 text-lg font-semibold text-success-700">{familyAverages.bioBased}</div>
              </div>
              <div className="rounded-md bg-brand-50 p-3 border border-brand-100">
                <div className="text-xs text-brand-700">{t.chart.legendC}</div>
                <div className="mt-1 text-lg font-semibold text-brand-700">{familyAverages.composite}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">{t.chart.label}</p>
          <h2 className="text-2xl font-bold text-neutral-900">{t.chart.title}</h2>
          <p className="text-sm text-neutral-500">{t.chart.subtitle}</p>
        </div>
        <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex h-48 items-end gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <Bar
              label={t.chart.legendA}
              value={familyAverages.traditional}
              max={maxFamilyValue}
              tone="bg-neutral-500"
            />
            <Bar
              label={t.chart.legendB}
              value={familyAverages.bioBased}
              max={maxFamilyValue}
              tone="bg-success-500"
            />
            <Bar
              label={t.chart.legendC}
              value={familyAverages.composite}
              max={maxFamilyValue}
              tone="bg-brand-500"
            />
          </div>
          <div className="grid gap-2 text-xs text-neutral-600">
            <Legend tone="bg-neutral-500" label={t.chart.legendA} />
            <Legend tone="bg-success-500" label={t.chart.legendB} />
            <Legend tone="bg-brand-500" label={t.chart.legendC} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="mb-2 flex items-center gap-2 text-neutral-500">
            <ChartColumn className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-[0.1em]">{t.metrics.dataScale}</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">100+</p>
          <p className="text-sm text-neutral-600">{t.metrics.dataScaleDesc}</p>
        </div>
        <div className="card">
          <div className="mb-2 flex items-center gap-2 text-neutral-500">
            <CircleCheck className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-[0.1em]">{t.metrics.governance}</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{t.metrics.governanceValue}</p>
          <p className="text-sm text-neutral-600">{t.metrics.governanceDesc}</p>
        </div>
        <div className="card">
          <div className="mb-2 flex items-center gap-2 text-neutral-500">
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-[0.1em]">{t.metrics.localization}</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{t.metrics.localizationValue}</p>
          <p className="text-sm text-neutral-600">{t.metrics.localizationDesc}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-neutral-950 px-6 py-10 text-white md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              {locale === 'zh'
                ? '為何香港隔間碳排，不能只看單一材料數據'
                : 'Why partition carbon in Hong Kong cannot rely on generic material data'}
            </h2>
            <div className="mt-6 space-y-3 text-sm text-neutral-300">
              <p>01. {locale === 'zh' ? '隔間屬於系統，不是單點材料替換。' : 'Partitions are systems, not isolated swaps.'}</p>
              <p>02. {locale === 'zh' ? '進口 EPD 必須加上香港在地化情境。' : 'Imported EPDs need HK localization assumptions.'}</p>
              <p>03. {locale === 'zh' ? '專案決策需要可審計的證據路徑。' : 'Decisions require audit-ready evidence paths.'}</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <img
              src="https://picsum.photos/seed/hk-skyline/900/560"
              alt="Hong Kong skyline"
              className="h-full w-full rounded-lg object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">
            {t.capabilities.label}
          </p>
          <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
            {t.capabilities.title}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article key={idx} className="card relative overflow-hidden space-y-3">
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-100/60 blur-2xl" />
                <div className="inline-flex rounded-md bg-brand-50 p-2 text-brand-600 relative">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{t.capabilities.items[idx].title}</h3>
                <p className="text-sm leading-6 text-neutral-600">{t.capabilities.items[idx].desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">
              {t.featured.label}
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
              {t.featured.title}
            </h2>
          </div>
          <button className="btn btn-ghost hidden md:inline-flex" onClick={() => navigate('/projects')}>
            {t.featured.viewAll}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredCases.map((item) => {
            const realCase = partitionCases[item.caseKey];
            return (
            <article
              key={item.name}
              className="card cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              onClick={() => navigate(item.route)}
            >
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={`https://picsum.photos/seed/${item.caseKey}-cover/800/420`}
                  alt={featuredCaseNames[locale][item.caseKey]}
                  className="h-36 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="badge badge-neutral">
                  {item.caseKey === 'central'
                    ? t.featured.statuses.baselineUpgrade
                    : item.caseKey === 'harbour'
                      ? t.featured.statuses.scenarioStudy
                      : t.featured.statuses.pilotProgram}
                </span>
                <span className="text-lg font-semibold text-success-500">-{realCase.totalSavingPct}%</span>
              </div>
              <h3 className="text-base font-semibold text-neutral-900">
                {featuredCaseNames[locale][item.caseKey]}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">{realCase.location}</p>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-neutral-500">
                  <span>{t.featured.score}</span>
                  <span>{Math.min(100, realCase.totalSavingPct * 3)} / 100</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-success-500"
                    style={{ width: `${Math.min(100, realCase.totalSavingPct * 3)}%` }}
                  />
                </div>
              </div>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                {t.featured.openCase}
                <ArrowRight className="h-4 w-4" />
              </div>
            </article>
            );
          })}
        </div>
        <button className="btn btn-secondary w-full md:hidden" onClick={() => navigate('/projects')}>
          {t.featured.viewAllMobile}
        </button>
      </section>

      <section className="card space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">
              {t.how.label}
            </p>
            <h2 className="text-2xl font-bold text-neutral-900">{t.how.title}</h2>
          </div>
          <span className="badge badge-neutral">{t.how.flow}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {t.how.steps.map((step, idx) => (
            <div key={step.title} className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                {t.how.stepLabel} {idx + 1}
              </p>
              <h3 className="mb-2 text-base font-semibold text-neutral-900">{step.title}</h3>
              <p className="text-sm leading-6 text-neutral-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-white md:flex md:items-center md:justify-between md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
        <div>
          <h2 className="text-2xl font-bold">{t.cta.title}</h2>
          <p className="mt-2 text-sm text-brand-100">
            {t.cta.subtitle}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button className="btn w-full bg-white text-brand-700 hover:bg-brand-50 sm:w-auto" onClick={() => navigate('/projects/new')}>
            {t.cta.createWorkspace}
          </button>
          <button className="btn w-full border border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto" onClick={() => navigate('/projects')}>
            {t.cta.viewCases}
          </button>
        </div>
      </section>
    </div>
  );
}

function MetricRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 text-sm last:border-b-0">
      <span className="text-neutral-500">{label}</span>
      <span className={highlight ? 'font-semibold text-success-500' : 'font-semibold text-neutral-800'}>
        {value}
      </span>
    </div>
  );
}

function averageOfFamily(family: 'Traditional' | 'Bio-based' | 'Composite') {
  const caseList = Object.values(partitionCases);
  const values = caseList.flatMap((item) =>
    item.options.filter((option) => option.family === family).map((option) => option.systemCarbonKgM2),
  );
  if (values.length === 0) return 0;
  const avg = values.reduce((sum, current) => sum + current, 0) / values.length;
  return Number(avg.toFixed(1));
}

function Bar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: string;
}) {
  const heightPercent = max <= 0 ? 0 : (value / max) * 100;
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <div className="text-xs font-semibold text-neutral-600">{value}</div>
      <div className="relative flex h-36 w-full items-end rounded-sm bg-white px-2 pb-2">
        <div className={`w-full rounded-sm ${tone}`} style={{ height: `${heightPercent}%` }} />
      </div>
      <div className="truncate text-xs text-neutral-500">{label}</div>
    </div>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <span>{label}</span>
    </div>
  );
}