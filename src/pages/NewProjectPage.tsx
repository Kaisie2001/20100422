import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GitCompare,
  Layers3,
  FileSearch,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  addUserProject,
  type ScenarioInput,
  type UserPlanScenario,
} from '../lib/userProjects';
import { evaluateHongKongLocalization } from '../lib/hkLocalization';

type ProjectType =
  | 'New Fit-out'
  | 'Refurbishment'
  | 'Tenant Reinstatement'
  | 'Decommissioning Pilot';

type YesNo = 'yes' | 'no';

type ScenarioDraft = ScenarioInput & {
  areaM2: string;
  applicationZone: string;
  panelLayersPerSide: string;
  fireRating: string;
  acousticRating: string;
  epdAvailable: YesNo;
  productName: string;
  manufacturer: string;
  originCountry: string;
  declaredUnit: string;
  supplierDocsAvailable: YesNo;
  shipmentOriginKnown: YesNo;
  scenarioRole: 'Baseline' | 'Alternative';
};

function createScenario(
  id: string,
  name: string,
  scenarioRole: 'Baseline' | 'Alternative'
): ScenarioDraft {
  return {
    id,
    name,
    scenarioRole,
    areaM2: '',
    applicationZone: '',
    frame: '',
    board: '',
    panelLayersPerSide: '',
    infill: '',
    connection: '',
    reusableLogic: '',
    fireRating: '',
    acousticRating: '',
    epdAvailable: 'yes',
    productName: '',
    manufacturer: '',
    originCountry: '',
    declaredUnit: '',
    supplierDocsAvailable: 'no',
    shipmentOriginKnown: 'no',
  };
}

function estimateIntensityKgM2(input: ScenarioDraft): number {
  const board = input.board.toLowerCase();
  const frame = input.frame.toLowerCase();
  const connection = input.connection.toLowerCase();

  let score = 22;
  if (board.includes('clt') || board.includes('timber')) score -= 7;
  if (board.includes('calcium silicate')) score -= 2;
  if (board.includes('bamboo') || board.includes('composite')) score -= 3;
  if (board.includes('glass') || board.includes('aluminium')) score += 4;
  if (frame.includes('hybrid')) score -= 2;
  if (frame.includes('steel')) score += 1;
  if (connection.includes('dry') || input.reusableLogic.toLowerCase().includes('reuse')) score -= 2;
  return Math.max(10, Number(score.toFixed(1)));
}

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [projectName, setProjectName] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [district, setDistrict] = useState('');
  const [partitionArea, setPartitionArea] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('Refurbishment');
  const [comparisonLevel, setComparisonLevel] = useState(
    'wall type + project scope'
  );

  const [baselineName, setBaselineName] = useState('Plan A / Baseline');
  const [alternativeCount, setAlternativeCount] = useState(2);

  const [scenarios, setScenarios] = useState<ScenarioDraft[]>([
    createScenario('baseline', 'Plan A / Baseline', 'Baseline'),
    createScenario('alt-1', 'Plan B', 'Alternative'),
    createScenario('alt-2', 'Plan C', 'Alternative'),
  ]);

  const stepTitles = [
    'Project Basics',
    'Comparison Setup',
    'Scenario Inputs',
    'Review & Create',
  ];

  const canGoStep1 =
    projectName.trim() &&
    buildingName.trim() &&
    district.trim() &&
    partitionArea.trim();

  const canGoStep2 =
    baselineName.trim() &&
    scenarios[0]?.name.trim() &&
    scenarios.slice(1).every((item) => item.name.trim());

  const canGoStep3 = scenarios.every(
    (item) =>
      item.name.trim() &&
      item.areaM2.trim() &&
      item.frame.trim() &&
      item.board.trim() &&
      item.connection.trim() &&
      item.productName.trim() &&
      item.originCountry.trim() &&
      item.declaredUnit.trim()
  );

  const progress = useMemo(() => {
    let score = 20;
    if (canGoStep1) score += 25;
    if (canGoStep2) score += 25;
    if (canGoStep3) score += 25;
    if (currentStep === 4) score += 5;
    return Math.min(score, 100);
  }, [canGoStep1, canGoStep2, canGoStep3, currentStep]);

  const updateScenario = (
    id: string,
    key: keyof ScenarioDraft,
    value: string
  ) => {
    setScenarios((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const applyScenarioCount = (count: number) => {
    const safeCount = Math.max(1, Math.min(3, count)); // Plan B to Plan D
    setAlternativeCount(safeCount);

    setScenarios((prev) => {
      const baseline = {
        ...(prev[0] ?? createScenario('baseline', baselineName, 'Baseline')),
        name: baselineName,
        scenarioRole: 'Baseline' as const,
      };

      const next: ScenarioDraft[] = [baseline];

      for (let i = 1; i <= safeCount; i += 1) {
        const id = `alt-${i}`;
        const existing = prev.find((item) => item.id === id);
        next.push(
          existing ??
            createScenario(
              id,
              `Plan ${String.fromCharCode(65 + i)}`,
              'Alternative'
            )
        );
      }

      return next;
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && !canGoStep1) return;
    if (currentStep === 2 && !canGoStep2) return;
    if (currentStep === 3 && !canGoStep3) return;

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const plans: UserPlanScenario[] = scenarios.map((item, index) => {
      const area = Number(item.areaM2) || 0;
      const baseIntensity = estimateIntensityKgM2(item);
      const hkLocalization = evaluateHongKongLocalization(baseIntensity, {
        originCountry: item.originCountry,
        epdAvailable: item.epdAvailable,
        supplierDocsAvailable: item.supplierDocsAvailable,
        shipmentOriginKnown: item.shipmentOriginKnown,
        connection: item.connection,
        reusableLogic: item.reusableLogic,
      });
      const total = Number((area * hkLocalization.hkAdjustedIntensityKgM2).toFixed(0));
      return {
        id: item.id,
        name: item.name,
        intent:
          index === 0
            ? 'Baseline reference package'
            : item.reusableLogic.trim()
            ? `Alternative with ${item.reusableLogic}`
            : 'Alternative comparison package',
        evidenceSummary: `${item.productName || 'Product'} (${item.originCountry || 'origin pending'})`,
        claimReadiness: hkLocalization.claimReadiness,
        hkLocalizationStatus: hkLocalization.hkLocalizationStatus,
        hkCheckLogic: hkLocalization.hkCheckLogic,
        baseIntensityKgM2: baseIntensity,
        hkAdjustedIntensityKgM2: hkLocalization.hkAdjustedIntensityKgM2,
        transportFactor: hkLocalization.transportFactor,
        dataQualityFactor: hkLocalization.dataQualityFactor,
        circularFactor: hkLocalization.circularFactor,
        aggregatedTotalKg: total,
        deltaVsBaselinePct: 0,
        zoneAllocations: [
          {
            zoneName: item.applicationZone || (index === 0 ? 'Project baseline scope' : `Scenario zone ${index}`),
            areaM2: area,
            systemId: item.id,
          },
        ],
      };
    });
    const baselineTotal = plans[0]?.aggregatedTotalKg || 1;
    const plansWithDelta = plans.map((plan) => ({
      ...plan,
      deltaVsBaselinePct: Number((((plan.aggregatedTotalKg - baselineTotal) / baselineTotal) * 100).toFixed(1)),
    }));
    const recommendedPlan =
      plansWithDelta.reduce((best, current) =>
        current.aggregatedTotalKg < best.aggregatedTotalKg ? current : best
      );

    const newProjectId = `user-${Date.now()}`;

    addUserProject({
      id: newProjectId,
      projectName,
      location: `${district}, HK`,
      projectType,
      partitionArea,
      status: `${scenarios.length} scenarios initialized`,
      claimState: 'Ready',
      claimStateColor: 'bg-green-100 text-green-700',
      completeness: 100,
      evidence: 'Plan-ready',
      createdAt: new Date().toISOString(),
      scenarios,
      baselinePlanId: plansWithDelta[0]?.id ?? 'baseline',
      recommendedPlanId: recommendedPlan.id,
      plans: plansWithDelta,
    });

    navigate(`/projects/${newProjectId}/overview`);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate('/projects');
    }
  };

  const baselineScenario = scenarios[0];
  const alternativeScenarios = scenarios.slice(1);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          Project Setup
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          New Project
        </h1>
        <p className="mt-2 max-w-3xl text-slate-500">
          Initialize a comparison-ready scaffold first: one baseline plus
          alternatives. The workspace will later generate Hong Kong localization,
          wall-level comparison, and project-level aggregation.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Setup Steps
          </p>

          <div className="space-y-3">
            {stepTitles.map((title, idx) => {
              const stepNo = idx + 1;
              const active = stepNo === currentStep;
              const complete = stepNo < currentStep;

              return (
                <button
                  key={title}
                  onClick={() => setCurrentStep(stepNo)}
                  className={`w-full rounded-xl border px-3 py-3 text-left ${
                    active
                      ? 'border-blue-200 bg-blue-50'
                      : complete
                      ? 'border-green-200 bg-green-50'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    {complete ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : stepNo}
                    <span>{title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold text-slate-500">
              Progress
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">{progress}% complete</div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          {currentStep === 1 && (
            <div className="space-y-6">
              <SectionHeader
                icon={<ClipboardList className="text-blue-700" size={22} />}
                title="Project Basics"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Project Name" required>
                  <input
                    className={inputClass}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </Field>

                <Field label="Building Name" required>
                  <input
                    className={inputClass}
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                  />
                </Field>

                <Field label="District" required>
                  <input
                    className={inputClass}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </Field>

                <Field label="Partition Area (m²)" required>
                  <input
                    className={inputClass}
                    value={partitionArea}
                    onChange={(e) => setPartitionArea(e.target.value)}
                  />
                </Field>

                <Field label="Project Type">
                  <select
                    className={inputClass}
                    value={projectType}
                    onChange={(e) =>
                      setProjectType(e.target.value as ProjectType)
                    }
                  >
                    <option>New Fit-out</option>
                    <option>Refurbishment</option>
                    <option>Tenant Reinstatement</option>
                    <option>Decommissioning Pilot</option>
                  </select>
                </Field>

                <Field label="Comparison Level">
                  <select
                    className={inputClass}
                    value={comparisonLevel}
                    onChange={(e) => setComparisonLevel(e.target.value)}
                  >
                    <option>wall type + project scope</option>
                    <option>wall type only</option>
                    <option>project scope only</option>
                  </select>
                </Field>
              </div>

              <InfoCard>
                This step defines the project boundary. The actual result logic will
                come from the comparison between Plan A and its alternatives.
              </InfoCard>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <SectionHeader
                icon={<GitCompare className="text-blue-700" size={22} />}
                title="Comparison Setup"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Baseline Name" required>
                  <input
                    className={inputClass}
                    value={baselineName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBaselineName(value);
                      updateScenario('baseline', 'name', value);
                    }}
                  />
                </Field>

                <Field label="Alternative Count">
                  <select
                    className={inputClass}
                    value={alternativeCount}
                    onChange={(e) => applyScenarioCount(Number(e.target.value))}
                  >
                    <option value={1}>1 alternative (Plan B)</option>
                    <option value={2}>2 alternatives (Plan B, C)</option>
                    <option value={3}>3 alternatives (Plan B, C, D)</option>
                  </select>
                </Field>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Comparison Structure
                </p>

                <div className="space-y-3">
                  {scenarios.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 md:grid-cols-[130px_1fr]"
                    >
                      <span className="text-sm font-medium text-slate-500">
                        {idx === 0 ? 'Baseline' : `Alternative ${idx}`}
                      </span>

                      <input
                        className={inputClass}
                        value={item.name}
                        onChange={(e) =>
                          updateScenario(item.id, 'name', e.target.value)
                        }
                        placeholder={
                          idx === 0
                            ? 'Plan A / Baseline'
                            : `Plan ${String.fromCharCode(65 + idx)}`
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <InfoCard>
                Plan A acts as the reference condition. Plan B, C, and D should be
                alternative partition combinations that will later be compared
                against the baseline.
              </InfoCard>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <SectionHeader
                icon={<Layers3 className="text-blue-700" size={22} />}
                title="Scenario Inputs"
              />

              <InfoCard>
                For each scenario, define both the partition system and the raw
                product evidence. Do not enter Hong Kong-localized results here.
              </InfoCard>

              <div className="space-y-5">
                {scenarios.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          {item.scenarioRole}
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {item.name}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.scenarioRole === 'Baseline'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.scenarioRole}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Scenario Area (m²)" required>
                        <input
                          className={inputClass}
                          value={item.areaM2}
                          onChange={(e) =>
                            updateScenario(item.id, 'areaM2', e.target.value)
                          }
                          placeholder="e.g. 160"
                        />
                      </Field>

                      <Field label="Application Zone">
                        <input
                          className={inputClass}
                          value={item.applicationZone}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'applicationZone',
                              e.target.value
                            )
                          }
                          placeholder="meeting room / corridor / open office"
                        />
                      </Field>

                      <Field label="Frame / Stud" required>
                        <input
                          className={inputClass}
                          value={item.frame}
                          onChange={(e) =>
                            updateScenario(item.id, 'frame', e.target.value)
                          }
                          placeholder="steel stud / hybrid frame"
                        />
                      </Field>

                      <Field label="Board / Panel" required>
                        <input
                          className={inputClass}
                          value={item.board}
                          onChange={(e) =>
                            updateScenario(item.id, 'board', e.target.value)
                          }
                          placeholder="double gypsum / calcium silicate / CLT"
                        />
                      </Field>

                      <Field label="Board Layers per Side">
                        <input
                          className={inputClass}
                          value={item.panelLayersPerSide}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'panelLayersPerSide',
                              e.target.value
                            )
                          }
                          placeholder="e.g. 1 / 2"
                        />
                      </Field>

                      <Field label="Infill">
                        <input
                          className={inputClass}
                          value={item.infill}
                          onChange={(e) =>
                            updateScenario(item.id, 'infill', e.target.value)
                          }
                          placeholder="mineral wool infill"
                        />
                      </Field>

                      <Field label="Connection Type" required>
                        <input
                          className={inputClass}
                          value={item.connection}
                          onChange={(e) =>
                            updateScenario(item.id, 'connection', e.target.value)
                          }
                          placeholder="screw-fixed / dry connection"
                        />
                      </Field>

                      <Field label="Reusable Logic">
                        <input
                          className={inputClass}
                          value={item.reusableLogic}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'reusableLogic',
                              e.target.value
                            )
                          }
                          placeholder="demountable / reusable route"
                        />
                      </Field>

                      <Field label="Fire Rating">
                        <input
                          className={inputClass}
                          value={item.fireRating}
                          onChange={(e) =>
                            updateScenario(item.id, 'fireRating', e.target.value)
                          }
                          placeholder="e.g. 1 hr"
                        />
                      </Field>

                      <Field label="Acoustic Rating">
                        <input
                          className={inputClass}
                          value={item.acousticRating}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'acousticRating',
                              e.target.value
                            )
                          }
                          placeholder="e.g. Rw 45"
                        />
                      </Field>

                      <Field label="EPD Available">
                        <select
                          className={inputClass}
                          value={item.epdAvailable}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'epdAvailable',
                              e.target.value
                            )
                          }
                        >
                          <option value="yes">yes</option>
                          <option value="no">no</option>
                        </select>
                      </Field>

                      <Field label="Product Name" required>
                        <input
                          className={inputClass}
                          value={item.productName}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'productName',
                              e.target.value
                            )
                          }
                          placeholder="e.g. Gyproc FireLine 12.5 mm"
                        />
                      </Field>

                      <Field label="Manufacturer">
                        <input
                          className={inputClass}
                          value={item.manufacturer}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'manufacturer',
                              e.target.value
                            )
                          }
                          placeholder="e.g. Saint-Gobain"
                        />
                      </Field>

                      <Field label="Origin Country / Region" required>
                        <input
                          className={inputClass}
                          value={item.originCountry}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'originCountry',
                              e.target.value
                            )
                          }
                          placeholder="UK / Germany / Mainland China"
                        />
                      </Field>

                      <Field label="Declared Unit" required>
                        <input
                          className={inputClass}
                          value={item.declaredUnit}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'declaredUnit',
                              e.target.value
                            )
                          }
                          placeholder="1 m² / 1 kg / 1 m³"
                        />
                      </Field>

                      <Field label="Supplier Docs Available">
                        <select
                          className={inputClass}
                          value={item.supplierDocsAvailable}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'supplierDocsAvailable',
                              e.target.value
                            )
                          }
                        >
                          <option value="yes">yes</option>
                          <option value="no">no</option>
                        </select>
                      </Field>

                      <Field label="Shipment Origin Known">
                        <select
                          className={inputClass}
                          value={item.shipmentOriginKnown}
                          onChange={(e) =>
                            updateScenario(
                              item.id,
                              'shipmentOriginKnown',
                              e.target.value
                            )
                          }
                        >
                          <option value="yes">yes</option>
                          <option value="no">no</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <SectionHeader
                icon={<CheckCircle2 className="text-blue-700" size={22} />}
                title="Review & Create"
              />

              <SummaryBlock
                title="Project"
                items={[
                  ['Name', projectName || '-'],
                  ['Building', buildingName || '-'],
                  ['District', district || '-'],
                  ['Type', projectType],
                  ['Partition area', partitionArea ? `${partitionArea} m²` : '-'],
                  ['Comparison level', comparisonLevel],
                ]}
              />

              {baselineScenario && (
                <SummaryBlock
                  title="Baseline Scenario"
                  items={[
                    ['Scenario', baselineScenario.name || '-'],
                    ['Area', baselineScenario.areaM2 || '-'],
                    ['System', `${baselineScenario.frame || '-'} · ${baselineScenario.board || '-'}`],
                    ['Product evidence', baselineScenario.productName || '-'],
                    ['Origin', baselineScenario.originCountry || '-'],
                    ['Declared unit', baselineScenario.declaredUnit || '-'],
                  ]}
                />
              )}

              {alternativeScenarios.map((item, idx) => (
  <div key={item.id}>
    <SummaryBlock
      title={`Alternative ${idx + 1}`}
      items={[
        ['Scenario', item.name || '-'],
        ['Area', item.areaM2 || '-'],
        ['System', `${item.frame || '-'} · ${item.board || '-'}`],
        ['Product evidence', item.productName || '-'],
        ['Origin', item.originCountry || '-'],
        ['Declared unit', item.declaredUnit || '-'],
      ]}
    />
  </div>
))}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                Workspace will be created with baseline + alternatives ready for
                comparison. The system will later generate Hong Kong localization
                status, CAT/local-check requirement, and scenario-to-scenario
                comparison readiness.
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button onClick={prevStep} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" />
              {currentStep === 1 ? 'Back to Projects' : 'Previous'}
            </button>

            <button onClick={nextStep} className="btn btn-primary">
              {currentStep === 4 ? 'Create Project Workspace' : 'Next'}
              {currentStep !== 4 && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <div className="text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </label>
  );
}

function SummaryBlock({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 text-base font-bold text-slate-900">{title}</div>
      <div className="space-y-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-3 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="text-right font-semibold text-slate-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all';