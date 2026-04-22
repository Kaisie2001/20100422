import { useMemo, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, BarChart3, MapPin } from 'lucide-react';
import type { CaseData } from '../data/partitionCaseData';
import { useLocale } from '../lib/locale';

const copy = {
  en: {
    back: 'Back to Projects',
    demo: 'Demo Case / Partition Comparison',
    metrics: {
      baseline: 'Baseline total',
      best: 'Best option total',
      saving: 'Potential saving',
      coverage: 'Evidence coverage',
      vsBaseline: 'vs baseline',
    },
    recommendationTitle: 'Recommended reading of this case',
    evidenceCenter: {
      title: 'Shared Evidence & Localization Library',
      subtitle:
        'Project-scoped evidence center combining original product evidence, Hong Kong localization judgement, and project plan usage.',
      totalRows: 'Evidence rows',
      verifiedRows: 'HK verified',
      localCheckRows: 'Local-check required',
      screeningRows: 'Screening-only',
      searchPlaceholder: 'Search product, EPD evidence, localization notes...',
      allStatus: 'All status',
      allFamily: 'All families',
      expand: 'Show detail',
      collapse: 'Hide detail',
      noResult: 'No evidence rows match current search/filter.',
      product: 'Product',
      manufacturer: 'Manufacturer',
      family: 'Material Family',
      epdSource: 'Original EPD Source / Evidence',
      origin: 'Origin Country / Region',
      declaredUnit: 'Declared Unit',
      hkStatus: 'HK Localization Status',
      cat: 'CAT / Local-check Requirement',
      status: 'Status',
      usedInPlan: 'Used in Plan',
      usedInProject: 'Used in Project',
      notes: 'Notes',
      detailOriginal: 'Original evidence summary',
      detailHk: 'Hong Kong localization note',
      detailWhy: 'Why this status',
      detailUsage: 'Used by plans',
      unknownManufacturer: 'Not specified in source evidence',
      unknownOrigin: 'Not specified in source evidence',
      statusVerified: 'Verified',
      statusLocalCheck: 'Local-check',
      statusScreening: 'Screening',
    },
    pipeline: {
      title: '3-layer evidence pipeline',
      subtitle:
        'Separate original product evidence from Hong Kong localization logic and final scenario outputs.',
      option: 'Scenario / Option',
      productEvidence: '1) Product Evidence',
      hkStatus: '2) HK Localization Status',
      output: '3) Localized Scenario Output',
      declaredUnit: 'Declared unit',
      epdBasis: 'EPD basis',
      notes: 'Notes',
      status: 'Status',
      logic: 'HK check logic',
      claimReadiness: 'Claim readiness',
      systemCarbon: 'System carbon',
      delta: 'Delta vs baseline',
      projectTotal: 'Project total (demo aggregate)',
      localCheck: 'Needs local check',
      claimReady: 'Claim-ready',
      screening: 'Screening only',
    },
    plans: {
      title: 'Plan scenario comparison',
      subtitle: 'Compare baseline and alternatives as complete plans, not only isolated options.',
      intent: 'Intent',
      claim: 'Claim readiness',
      baselineTag: 'Baseline',
      recommendedTag: 'Recommended',
      zones: 'Area allocation',
    },
    localiseTitle: 'How this page localises EPD data for Hong Kong',
    platformDoes: 'What the platform does',
    boundaryTitle: 'Important boundary',
    boundaryText:
      'This case page treats official EPD values as product evidence, then adds a Hong Kong scenario layer. It does not rewrite international EPDs into fake "Hong Kong EPDs". Screening-only proxies remain clearly marked.',
    table: {
      title: 'Partition option comparison',
      subtitle:
        'Compare system-level demo outputs under the same project scope. Values are prototype comparison outputs for UI demonstration.',
      option: 'Option',
      family: 'Family',
      wallType: 'Wall type',
      epd: 'EPD basis',
      status: 'HK localisation status',
      carbon: 'System carbon',
      delta: 'Delta vs baseline',
    },
    aggregation: {
      title: 'Project aggregation',
      type: 'Project type',
      area: 'Partition area',
      types: 'Partition types',
      baseline: 'Baseline scheme',
      best: 'Best visible option',
      reduction: 'Potential reduction',
    },
    teaching: {
      title: 'What this case is teaching',
      points: [
        'Do not compare isolated materials without visible system logic.',
        'Keep framing visible in all dry partition comparisons.',
        'Treat imported EPDs as product evidence, then localise for Hong Kong at scenario level.',
        'Distinguish between verified rows, local-check rows, and screening proxies.',
        'Use project aggregation to show how a wall-level delta becomes a tenant/project-level carbon decision.',
      ],
    },
  },
  zh: {
    back: '返回專案列表',
    demo: '示範案例 / 隔間比較',
    metrics: {
      baseline: '基準總量',
      best: '最佳方案總量',
      saving: '潛在減量',
      coverage: '證據覆蓋率',
      vsBaseline: '相較基準',
    },
    recommendationTitle: '本案例建議閱讀方式',
    evidenceCenter: {
      title: 'Shared Evidence & Localization Library（專案範圍）',
      subtitle: '以專案為範圍整合原始產品證據、香港在地化判斷與方案使用關係。',
      totalRows: '證據筆數',
      verifiedRows: '香港已驗證',
      localCheckRows: '需本地檢核',
      screeningRows: '僅供篩選',
      searchPlaceholder: '搜尋產品、EPD 依據、在地化註記...',
      allStatus: '全部狀態',
      allFamily: '全部類別',
      expand: '展開明細',
      collapse: '收合明細',
      noResult: '目前搜尋或篩選條件下沒有符合的證據資料。',
      product: '產品',
      manufacturer: '製造商',
      family: '材料類別',
      epdSource: '原始 EPD 來源 / 證據',
      origin: '來源國家 / 區域',
      declaredUnit: '宣告單位',
      hkStatus: '香港在地化狀態',
      cat: 'CAT / 本地檢核要求',
      status: '狀態',
      usedInPlan: '使用於方案',
      usedInProject: '使用於專案',
      notes: '備註',
      detailOriginal: '原始證據摘要',
      detailHk: '香港在地化註記',
      detailWhy: '狀態原因',
      detailUsage: '使用於哪些方案',
      unknownManufacturer: '來源證據未明確提供',
      unknownOrigin: '來源證據未明確提供',
      statusVerified: '已驗證',
      statusLocalCheck: '需本地檢核',
      statusScreening: '僅供篩選',
    },
    pipeline: {
      title: '三層證據流程',
      subtitle: '將原始產品證據、香港在地化邏輯與最終情境輸出清楚分層呈現。',
      option: '方案 / 選項',
      productEvidence: '1) Product Evidence（原始證據）',
      hkStatus: '2) HK Localization Status（香港化狀態）',
      output: '3) Localized Scenario Output（情境輸出）',
      declaredUnit: '宣告單位',
      epdBasis: 'EPD 依據',
      notes: '備註',
      status: '狀態',
      logic: '香港檢核邏輯',
      claimReadiness: '可主張成熟度',
      systemCarbon: '系統碳排',
      delta: '相較基準差異',
      projectTotal: '專案總量（示範聚合）',
      localCheck: '需本地檢核',
      claimReady: '可主張',
      screening: '僅供篩選',
    },
    plans: {
      title: '方案情境比較',
      subtitle: '以完整方案比較基準與替代路徑，而不只比較單一選項。',
      intent: '方案目的',
      claim: '可主張成熟度',
      baselineTag: '基準',
      recommendedTag: '建議方案',
      zones: '面積分配',
    },
    localiseTitle: '本頁如何將 EPD 資料在香港情境下在地化',
    platformDoes: '平台做了什麼',
    boundaryTitle: '重要邊界',
    boundaryText:
      '本案例頁將官方 EPD 數值視為產品證據，再疊加香港情境層。系統不會把國際 EPD 竄改成虛構的「香港 EPD」。僅供篩選的代理資料會被清楚標示。',
    table: {
      title: '隔間方案比較',
      subtitle: '在同一專案範圍下比較系統層級示範輸出。數值為 UI 展示用原型比較結果。',
      option: '方案',
      family: '類別',
      wallType: '牆體類型',
      epd: 'EPD 依據',
      status: '香港在地化狀態',
      carbon: '系統碳排',
      delta: '相較基準差異',
    },
    aggregation: {
      title: '專案聚合',
      type: '專案類型',
      area: '隔間面積',
      types: '隔間類型數',
      baseline: '基準方案',
      best: '最佳可見方案',
      reduction: '潛在減量',
    },
    teaching: {
      title: '本案例重點啟示',
      points: [
        '不要在缺乏系統邏輯可見性的情況下比較孤立材料。',
        '所有乾式隔間比較都應保留骨架結構資訊。',
        '進口 EPD 應先作為產品證據，再於情境層做香港在地化。',
        '需清楚區分已驗證資料、本地檢核資料與篩選代理資料。',
        '透過專案聚合說明牆體層級差異如何轉為租戶/專案層級決策。',
      ],
    },
  },
} as const;

const familyMap = {
  Traditional: { en: 'Traditional', zh: '傳統' },
  'Bio-based': { en: 'Bio-based', zh: '生物基' },
  Composite: { en: 'Composite', zh: '複合' },
  'HK common': { en: 'HK common', zh: '香港常見' },
} as const;

const statusMap = {
  'HK verified': { en: 'HK verified', zh: '香港已驗證' },
  'International EPD + HK CAT check required': {
    en: 'International EPD + HK CAT check required',
    zh: '國際 EPD + 香港 CAT 檢核',
  },
  'Screening only': { en: 'Screening only', zh: '僅供篩選' },
} as const;

const claimReadinessMap = {
  screening: { en: 'Screening only', zh: '僅供篩選' },
  'local-check': { en: 'Needs local check', zh: '需本地檢核' },
  'claim-ready': { en: 'Claim-ready', zh: '可主張' },
} as const;

const claimReadinessFromStatus = {
  'HK verified': { en: 'Claim-ready', zh: '可主張' },
  'International EPD + HK CAT check required': { en: 'Needs local check', zh: '需本地檢核' },
  'Screening only': { en: 'Screening only', zh: '僅供篩選' },
} as const;

export default function PartitionCasePage({
  data,
  hideTopNav = false,
}: {
  data: CaseData;
  hideTopNav?: boolean;
}) {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const t = copy[locale];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'HK verified' | 'International EPD + HK CAT check required' | 'Screening only'>('all');
  const [familyFilter, setFamilyFilter] = useState<'all' | 'Traditional' | 'Bio-based' | 'Composite' | 'HK common'>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const optionUsageMap = useMemo(() => {
    const map = new Map<string, string[]>();
    (data.plans ?? []).forEach((plan) => {
      plan.zoneAllocations.forEach((zone) => {
        const list = map.get(zone.systemId) ?? [];
        if (!list.includes(plan.name)) list.push(plan.name);
        map.set(zone.systemId, list);
      });
    });
    return map;
  }, [data.plans]);

  const evidenceRows = useMemo(() => {
    return data.options.map((row) => {
      const usedInPlans = optionUsageMap.get(row.id) ?? [];
      const manufacturer =
        row.name.toLowerCase().includes('gyproc')
          ? 'Gyproc (as referenced)'
          : row.name.toLowerCase().includes('clt')
          ? 'Stora Enso (as referenced)'
          : row.name.toLowerCase().includes('bamboo')
          ? 'Holse & Wibroe (as referenced)'
          : t.evidenceCenter.unknownManufacturer;

      const origin =
        row.boardEvidence.toLowerCase().includes('hong kong')
          ? 'Hong Kong context layer'
          : row.boardEvidence.toLowerCase().includes('stora enso')
          ? 'Europe (as referenced)'
          : row.boardEvidence.toLowerCase().includes('bamboo')
          ? 'Not explicitly stated (composite reference)'
          : t.evidenceCenter.unknownOrigin;

      const status =
        row.localizationStatus === 'HK verified'
          ? t.evidenceCenter.statusVerified
          : row.localizationStatus === 'Screening only'
          ? t.evidenceCenter.statusScreening
          : t.evidenceCenter.statusLocalCheck;

      return {
        ...row,
        manufacturer,
        origin,
        status,
        usedInPlans,
        usedInProject: data.title,
        estimatedProjectTotal: Math.round(row.systemCarbonKgM2 * data.partitionAreaM2),
      };
    });
  }, [data.options, data.partitionAreaM2, data.title, optionUsageMap, t.evidenceCenter]);

  const filteredEvidenceRows = useMemo(() => {
    return evidenceRows.filter((row) => {
      if (statusFilter !== 'all' && row.localizationStatus !== statusFilter) return false;
      if (familyFilter !== 'all' && row.family !== familyFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        row.name.toLowerCase().includes(q) ||
        row.boardEvidence.toLowerCase().includes(q) ||
        row.hkCheckLogic.toLowerCase().includes(q) ||
        row.notes.toLowerCase().includes(q) ||
        row.manufacturer.toLowerCase().includes(q)
      );
    });
  }, [evidenceRows, statusFilter, familyFilter, search]);

  const evidenceSummary = useMemo(() => {
    const total = evidenceRows.length;
    const verified = evidenceRows.filter((r) => r.localizationStatus === 'HK verified').length;
    const localCheck = evidenceRows.filter((r) => r.localizationStatus === 'International EPD + HK CAT check required').length;
    const screening = evidenceRows.filter((r) => r.localizationStatus === 'Screening only').length;
    return { total, verified, localCheck, screening };
  }, [evidenceRows]);

  return (
    <div className="space-y-8">
      {!hideTopNav && (
        <>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              {t.back}
            </span>
          </button>

          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              {t.demo}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {data.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={16} />
              {data.location}
            </div>
            <p className="text-slate-600 text-lg max-w-4xl">{data.subtitle}</p>
          </div>
        </>
      )}

      {/* KPI row */}
      <div className="grid md:grid-cols-4 gap-6">
        <MetricCard label={t.metrics.baseline} value={`${data.baselineTotalKg.toLocaleString()} kgCO₂e`} />
        <MetricCard label={t.metrics.best} value={`${data.bestOptionTotalKg.toLocaleString()} kgCO₂e`} />
        <MetricCard label={t.metrics.saving} value={`${data.totalSavingKg.toLocaleString()} kgCO₂e`} sub={`${data.totalSavingPct}% ${t.metrics.vsBaseline}`} />
        <MetricCard label={t.metrics.coverage} value={data.evidenceCoverage} />
      </div>

      {/* Recommendation */}
      <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-green-600 mt-1" size={20} />
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t.recommendationTitle}</h2>
            <p className="text-slate-600 leading-relaxed">{data.recommendation}</p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{t.evidenceCenter.title}</h2>
          <p className="mt-2 text-slate-500">{t.evidenceCenter.subtitle}</p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <MetricCard label={t.evidenceCenter.totalRows} value={String(evidenceSummary.total)} />
          <MetricCard label={t.evidenceCenter.verifiedRows} value={String(evidenceSummary.verified)} />
          <MetricCard label={t.evidenceCenter.localCheckRows} value={String(evidenceSummary.localCheck)} />
          <MetricCard label={t.evidenceCenter.screeningRows} value={String(evidenceSummary.screening)} />
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
            placeholder={t.evidenceCenter.searchPlaceholder}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option value="all">{t.evidenceCenter.allStatus}</option>
            <option value="HK verified">{statusMap['HK verified'][locale]}</option>
            <option value="International EPD + HK CAT check required">
              {statusMap['International EPD + HK CAT check required'][locale]}
            </option>
            <option value="Screening only">{statusMap['Screening only'][locale]}</option>
          </select>
          <select
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value as typeof familyFilter)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option value="all">{t.evidenceCenter.allFamily}</option>
            <option value="Traditional">{familyMap.Traditional[locale]}</option>
            <option value="Bio-based">{familyMap['Bio-based'][locale]}</option>
            <option value="Composite">{familyMap.Composite[locale]}</option>
            <option value="HK common">{familyMap['HK common'][locale]}</option>
          </select>
        </div>

        {filteredEvidenceRows.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
            {t.evidenceCenter.noResult}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1480px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="py-3 pr-4">{t.evidenceCenter.product}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.manufacturer}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.family}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.epdSource}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.origin}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.declaredUnit}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.hkStatus}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.cat}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.status}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.usedInPlan}</th>
                  <th className="py-3 pr-4">{t.evidenceCenter.usedInProject}</th>
                  <th className="py-3 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEvidenceRows.map((row) => {
                  const expanded = expandedRowId === row.id;
                  return (
                    <React.Fragment key={row.id}>
                      <tr key={row.id} className="border-b border-slate-100 align-top">
                        <td className="py-4 pr-4 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-4 pr-4 text-slate-600">{row.manufacturer}</td>
                        <td className="py-4 pr-4 text-slate-600">{familyMap[row.family][locale]}</td>
                        <td className="py-4 pr-4 text-slate-700">{row.boardEvidence}</td>
                        <td className="py-4 pr-4 text-slate-600">{row.origin}</td>
                        <td className="py-4 pr-4 text-slate-600">{row.declaredUnit}</td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              row.localizationStatus === 'HK verified'
                                ? 'bg-green-100 text-green-700'
                                : row.localizationStatus === 'Screening only'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {statusMap[row.localizationStatus][locale]}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-slate-600">{row.hkCheckLogic}</td>
                        <td className="py-4 pr-4 text-slate-700 font-semibold">{row.status}</td>
                        <td className="py-4 pr-4 text-slate-600">
                          {row.usedInPlans.length > 0 ? row.usedInPlans.join(', ') : '-'}
                        </td>
                        <td className="py-4 pr-4 text-slate-600">{row.usedInProject}</td>
                        <td className="py-4 pr-4">
                          <button
                            onClick={() => setExpandedRowId(expanded ? null : row.id)}
                            className="text-blue-700 text-xs font-semibold hover:underline"
                          >
                            {expanded ? t.evidenceCenter.collapse : t.evidenceCenter.expand}
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <td colSpan={12} className="py-4 px-4">
                            <div className="grid gap-4 md:grid-cols-2 text-xs text-slate-700">
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="font-semibold text-slate-900 mb-2">{t.evidenceCenter.detailOriginal}</div>
                                <div>{row.boardEvidence}</div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="font-semibold text-slate-900 mb-2">{t.evidenceCenter.detailHk}</div>
                                <div>{row.hkCheckLogic}</div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="font-semibold text-slate-900 mb-2">{t.evidenceCenter.detailWhy}</div>
                                <div>{row.notes}</div>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="font-semibold text-slate-900 mb-2">{t.evidenceCenter.detailUsage}</div>
                                <div>
                                  {row.usedInPlans.length > 0 ? row.usedInPlans.join(', ') : '-'}
                                </div>
                                <div className="mt-2 text-slate-500">
                                  {t.pipeline.projectTotal}: {row.estimatedProjectTotal.toLocaleString()} kgCO₂e
                                </div>
                                <div className="text-slate-500">
                                  {t.pipeline.delta}: {row.deltaVsBaselinePct > 0 ? '+' : ''}
                                  {row.deltaVsBaselinePct}%
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {data.plans && data.plans.length > 0 && (
        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{t.plans.title}</h2>
            <p className="mt-2 text-slate-500">{t.plans.subtitle}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {data.plans.map((plan) => {
              const isBaseline = data.baselinePlanId === plan.id;
              const isRecommended = data.recommendedPlanId === plan.id;
              return (
                <article key={plan.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    <div className="flex gap-1">
                      {isBaseline && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {t.plans.baselineTag}
                        </span>
                      )}
                      {isRecommended && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                          {t.plans.recommendedTag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <Row label={t.plans.intent} value={plan.intent} />
                    <Row
                      label={t.plans.claim}
                      value={claimReadinessMap[plan.claimReadiness][locale]}
                    />
                    <Row
                      label="Total"
                      value={`${plan.aggregatedTotalKg.toLocaleString()} kgCO₂e`}
                    />
                    <Row
                      label="Δ"
                      value={`${plan.deltaVsBaselinePct > 0 ? '+' : ''}${plan.deltaVsBaselinePct}%`}
                    />
                  </div>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {t.plans.zones}
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      {plan.zoneAllocations.map((zone) => (
                        <div key={`${plan.id}-${zone.zoneName}`} className="flex justify-between gap-3">
                          <span>{zone.zoneName}</span>
                          <span className="font-semibold">{zone.areaM2} m²</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* HK localization logic */}
      <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-blue-700" size={22} />
          <h2 className="text-2xl font-bold text-slate-900">{t.localiseTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <div className="text-sm font-bold text-slate-900 mb-3">{t.platformDoes}</div>
            <ul className="space-y-3 text-sm text-slate-600">
              {data.localizationRule.map((rule) => (
                <li key={rule}>• {rule}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
            <div className="flex items-center gap-2 text-amber-800 font-bold mb-3">
              <AlertTriangle size={16} />
              {t.boundaryTitle}
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              {t.boundaryText}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{t.pipeline.title}</h2>
          <p className="mt-2 text-slate-500">{t.pipeline.subtitle}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1220px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="py-3 pr-4">{t.pipeline.option}</th>
                <th className="py-3 pr-4">{t.pipeline.productEvidence}</th>
                <th className="py-3 pr-4">{t.pipeline.hkStatus}</th>
                <th className="py-3 pr-4">{t.pipeline.output}</th>
              </tr>
            </thead>
            <tbody>
              {data.options.map((row) => {
                const estimatedProjectTotal = Math.round(row.systemCarbonKgM2 * data.partitionAreaM2);
                return (
                  <tr key={`pipeline-${row.id}`} className="border-b border-slate-100 align-top">
                    <td className="py-4 pr-4">
                      <div className="font-semibold text-slate-900">{row.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{familyMap[row.family][locale]}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-1 text-xs text-slate-700">
                        <div>
                          <span className="text-slate-500">{t.pipeline.declaredUnit}: </span>
                          {row.declaredUnit}
                        </div>
                        <div>
                          <span className="text-slate-500">{t.pipeline.epdBasis}: </span>
                          {row.boardEvidence}
                        </div>
                        <div>
                          <span className="text-slate-500">{t.pipeline.notes}: </span>
                          {row.notes}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-2 text-xs">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 font-semibold ${
                            row.localizationStatus === 'HK verified'
                              ? 'bg-green-100 text-green-700'
                              : row.localizationStatus === 'Screening only'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {statusMap[row.localizationStatus][locale]}
                        </span>
                        <div className="text-slate-600">
                          <span className="text-slate-500">{t.pipeline.logic}: </span>
                          {row.hkCheckLogic}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-1 text-xs text-slate-700">
                        <div>
                          <span className="text-slate-500">{t.pipeline.claimReadiness}: </span>
                          {claimReadinessFromStatus[row.localizationStatus][locale]}
                        </div>
                        <div>
                          <span className="text-slate-500">{t.pipeline.systemCarbon}: </span>
                          {row.systemCarbonKgM2} kgCO₂e/m²
                        </div>
                        <div>
                          <span className="text-slate-500">{t.pipeline.delta}: </span>
                          {row.deltaVsBaselinePct > 0 ? '+' : ''}
                          {row.deltaVsBaselinePct}%
                        </div>
                        <div>
                          <span className="text-slate-500">{t.pipeline.projectTotal}: </span>
                          {estimatedProjectTotal.toLocaleString()} kgCO₂e
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm overflow-hidden">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{t.table.title}</h2>
          <p className="text-slate-500 mt-2">
            {t.table.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="py-3 pr-4 font-semibold text-slate-500">{t.table.option}</th>
                <th className="py-3 pr-4 font-semibold text-slate-500">{t.table.family}</th>
                <th className="py-3 pr-4 font-semibold text-slate-500">{t.table.wallType}</th>
                <th className="py-3 pr-4 font-semibold text-slate-500">{t.table.epd}</th>
                <th className="py-3 pr-4 font-semibold text-slate-500">{t.table.status}</th>
                <th className="py-3 pr-4 font-semibold text-slate-500">{t.table.carbon}</th>
                <th className="py-3 pr-4 font-semibold text-slate-500">{t.table.delta}</th>
              </tr>
            </thead>
            <tbody>
              {data.options.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 align-top">
                  <td className="py-4 pr-4">
                    <div className="font-semibold text-slate-900">{row.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{row.declaredUnit}</div>
                  </td>
                  <td className="py-4 pr-4">{familyMap[row.family][locale]}</td>
                  <td className="py-4 pr-4">{row.wallType}</td>
                  <td className="py-4 pr-4">
                    <div className="text-slate-700">{row.boardEvidence}</div>
                    <div className="text-xs text-slate-500 mt-1">{row.notes}</div>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        row.localizationStatus === 'HK verified'
                          ? 'bg-green-100 text-green-700'
                          : row.localizationStatus === 'Screening only'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {statusMap[row.localizationStatus][locale]}
                    </span>
                    <div className="text-xs text-slate-500 mt-2">{row.hkCheckLogic}</div>
                  </td>
                  <td className="py-4 pr-4 font-semibold text-slate-900">
                    {row.systemCarbonKgM2} kgCO₂e/m²
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`font-semibold ${
                        row.deltaVsBaselinePct < 0 ? 'text-green-700' : row.deltaVsBaselinePct > 0 ? 'text-red-600' : 'text-slate-700'
                      }`}
                    >
                      {row.deltaVsBaselinePct > 0 ? '+' : ''}
                      {row.deltaVsBaselinePct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Project-level aggregation */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.aggregation.title}</h2>
          <div className="space-y-4 text-sm">
            <Row label={t.aggregation.type} value={data.projectType} />
            <Row label={t.aggregation.area} value={`${data.partitionAreaM2} m²`} />
            <Row label={t.aggregation.types} value={String(data.partitionTypes)} />
            <Row label={t.aggregation.baseline} value={data.baselineLabel} />
            <Row label={t.aggregation.best} value={data.bestOptionLabel} />
            <Row label={t.aggregation.reduction} value={`${data.totalSavingKg.toLocaleString()} kgCO₂e (${data.totalSavingPct}%)`} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.teaching.title}</h2>
          <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
            {t.teaching.points.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
        {label}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-sm text-slate-500 mt-2">{sub}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-900 text-right">{value}</span>
    </div>
  );
}