import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserProjectById } from '../lib/userProjects';
import { HK_LOCALIZATION_ASSUMPTIONS } from '../lib/hkLocalization';

const readinessColor = {
  screening: 'bg-amber-100 text-amber-700',
  'local-check': 'bg-blue-100 text-blue-700',
  'claim-ready': 'bg-green-100 text-green-700',
} as const;

const localizationBadgeColor = {
  'HK verified': 'bg-green-100 text-green-700',
  'International EPD + HK CAT check required': 'bg-blue-100 text-blue-700',
  'Screening only': 'bg-amber-100 text-amber-700',
} as const;

export default function UserProjectWorkspacePage() {
  const { id = '' } = useParams();
  const project = useMemo(() => getUserProjectById(id), [id]);

  if (!project) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Workspace not found</h1>
        <Link to="/projects" className="btn btn-secondary">
          Back to Projects
        </Link>
      </div>
    );
  }

  const effectivePlans =
    project.plans.length > 0
      ? project.plans
      : project.scenarios.map((item, idx) => ({
          id: item.id,
          name: item.name || `Plan ${String.fromCharCode(65 + idx)}`,
          intent: idx === 0 ? 'Baseline reference package' : 'Alternative comparison package',
          evidenceSummary: 'Legacy project without computed plan metrics',
          claimReadiness: 'local-check' as const,
          hkLocalizationStatus: 'International EPD + HK CAT check required' as const,
          hkCheckLogic: 'Legacy project without explicit localization formula.',
          baseIntensityKgM2: 0,
          hkAdjustedIntensityKgM2: 0,
          transportFactor: 1,
          dataQualityFactor: 1,
          circularFactor: 1,
          aggregatedTotalKg: 0,
          deltaVsBaselinePct: 0,
          zoneAllocations: [],
        }));

  const baselineTotal =
    effectivePlans.find((p) => p.id === project.baselinePlanId)?.aggregatedTotalKg ?? 1;
  const planById = new Map<string, (typeof effectivePlans)[number]>(
    effectivePlans.map((plan) => [plan.id, plan])
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">User Workspace</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{project.projectName}</h1>
          <p className="mt-2 text-slate-500">
            {project.location} · {project.projectType} · {project.partitionArea} m²
          </p>
        </div>
        <Link to="/projects" className="btn btn-secondary">
          Back to Projects
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Plan Scenario Comparison</h2>
        <p className="mt-2 text-slate-500">
          Baseline and alternatives initialized from New Project flow.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {effectivePlans.map((plan) => {
            const isBaseline = plan.id === project.baselinePlanId;
            const isRecommended = plan.id === project.recommendedPlanId;
            return (
              <article key={plan.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900">{plan.name}</h3>
                  <div className="flex gap-1">
                    {isBaseline && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        Baseline
                      </span>
                    )}
                    {isRecommended && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                <p className="mb-2 text-xs text-slate-500">{plan.intent}</p>
                <div className="text-sm text-slate-700">
                  <div>
                    Base intensity:{' '}
                    <span className="font-semibold">{plan.baseIntensityKgM2.toFixed(2)} kgCO₂e/m²</span>
                  </div>
                  <div>
                    HK adjusted intensity:{' '}
                    <span className="font-semibold">{plan.hkAdjustedIntensityKgM2.toFixed(2)} kgCO₂e/m²</span>
                  </div>
                  <div>Total: <span className="font-semibold">{plan.aggregatedTotalKg.toLocaleString()} kgCO₂e</span></div>
                  <div>
                    Δ vs baseline:{' '}
                    <span className="font-semibold">
                      {plan.deltaVsBaselinePct > 0 ? '+' : ''}
                      {plan.deltaVsBaselinePct}%
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${readinessColor[plan.claimReadiness]}`}>
                    {plan.claimReadiness}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${localizationBadgeColor[plan.hkLocalizationStatus]}`}>
                    {plan.hkLocalizationStatus}
                  </span>
                </div>
                <div className="mt-3 rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-600">
                  <div>Transport factor: {plan.transportFactor}</div>
                  <div>Data quality factor: {plan.dataQualityFactor}</div>
                  <div>Circular factor: {plan.circularFactor}</div>
                  <div className="mt-1 text-slate-500">{plan.hkCheckLogic}</div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">3-layer Evidence Pipeline</h2>
        <p className="mt-2 text-slate-500">
          Product Evidence → HK Localization Status → Localized Scenario Output
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1260px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="py-3 pr-4">Scenario</th>
                <th className="py-3 pr-4">Product Evidence</th>
                <th className="py-3 pr-4">HK Localization Status</th>
                <th className="py-3 pr-4">Localized Scenario Output</th>
              </tr>
            </thead>
            <tbody>
              {project.scenarios.map((item) => {
                const plan = planById.get(item.id);
                return (
                  <tr key={item.id} className="border-b border-slate-100 align-top">
                    <td className="py-4 pr-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-4 pr-4">
                      <div className="space-y-1 text-xs text-slate-700">
                        <div>EPD: {item.epdAvailable ?? '-'}</div>
                        <div>Product: {item.productName ?? '-'}</div>
                        <div>Origin: {item.originCountry ?? '-'}</div>
                        <div>Declared unit: {item.declaredUnit ?? '-'}</div>
                        <div>Supplier docs: {item.supplierDocsAvailable ?? '-'}</div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {plan ? (
                        <div className="space-y-2 text-xs">
                          <span className={`inline-flex rounded-full px-2 py-1 font-semibold ${localizationBadgeColor[plan.hkLocalizationStatus]}`}>
                            {plan.hkLocalizationStatus}
                          </span>
                          <div className="text-slate-600">
                            T:{plan.transportFactor} · DQ:{plan.dataQualityFactor} · C:{plan.circularFactor}
                          </div>
                          <div className="text-slate-500">{plan.hkCheckLogic}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      {plan ? (
                        <div className="space-y-1 text-xs text-slate-700">
                          <div>System carbon: {plan.hkAdjustedIntensityKgM2.toFixed(2)} kgCO₂e/m²</div>
                          <div>
                            Delta: {plan.deltaVsBaselinePct > 0 ? '+' : ''}
                            {plan.deltaVsBaselinePct}% vs baseline
                          </div>
                          <div>Project total: {plan.aggregatedTotalKg.toLocaleString()} kgCO₂e</div>
                          <div>Claim readiness: {plan.claimReadiness}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Scenario Inputs</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="py-3 pr-4">Scenario</th>
                <th className="py-3 pr-4">Frame</th>
                <th className="py-3 pr-4">Board</th>
                <th className="py-3 pr-4">Connection</th>
                <th className="py-3 pr-4">Infill</th>
                <th className="py-3 pr-4">Reusable logic</th>
              </tr>
            </thead>
            <tbody>
              {project.scenarios.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 pr-4">{item.frame || '-'}</td>
                  <td className="py-3 pr-4">{item.board || '-'}</td>
                  <td className="py-3 pr-4">{item.connection || '-'}</td>
                  <td className="py-3 pr-4">{item.infill || '-'}</td>
                  <td className="py-3 pr-4">{item.reusableLogic || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Baseline total reference: {baselineTotal.toLocaleString()} kgCO₂e
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">HK Localization Assumptions</h2>
        <p className="mt-2 text-sm text-slate-500">
          Calculation uses transparent factors instead of implicit black-box rewriting.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <AssumptionCard
            title="Transport Factor"
            lines={[
              `Hong Kong: ${HK_LOCALIZATION_ASSUMPTIONS.transport.hongKong}`,
              `Mainland China: ${HK_LOCALIZATION_ASSUMPTIONS.transport.mainlandChina}`,
              `Asia regional: ${HK_LOCALIZATION_ASSUMPTIONS.transport.asiaRegional}`,
              `Europe: ${HK_LOCALIZATION_ASSUMPTIONS.transport.europe}`,
              `America: ${HK_LOCALIZATION_ASSUMPTIONS.transport.america}`,
              `Unknown/default: ${HK_LOCALIZATION_ASSUMPTIONS.transport.unknown}/${HK_LOCALIZATION_ASSUMPTIONS.transport.default}`,
            ]}
          />
          <AssumptionCard
            title="Data Quality Factor"
            lines={[
              `Full evidence: ${HK_LOCALIZATION_ASSUMPTIONS.dataQuality.fullEvidence}`,
              `EPD only: ${HK_LOCALIZATION_ASSUMPTIONS.dataQuality.epdOnly}`,
              `No EPD: ${HK_LOCALIZATION_ASSUMPTIONS.dataQuality.noEpd}`,
            ]}
          />
          <AssumptionCard
            title="Circular Factor"
            lines={[
              `Dry/demountable: ${HK_LOCALIZATION_ASSUMPTIONS.circular.dryOrDemountable}`,
              `Reusable logic: ${HK_LOCALIZATION_ASSUMPTIONS.circular.reusableLogic}`,
              `Fixed system: ${HK_LOCALIZATION_ASSUMPTIONS.circular.fixed}`,
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function AssumptionCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 text-sm font-semibold text-slate-900">{title}</div>
      <div className="space-y-1 text-xs text-slate-600">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}
