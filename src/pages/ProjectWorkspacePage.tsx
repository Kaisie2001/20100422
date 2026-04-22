import { Link, useParams } from 'react-router-dom';
import PartitionCasePage from '../components/PartitionCasePage';
import { getWorkspaceProject } from '../lib/projectWorkspace';

const readinessColor = {
  screening: 'bg-amber-100 text-amber-700',
  'local-check': 'bg-blue-100 text-blue-700',
  'claim-ready': 'bg-green-100 text-green-700',
} as const;

export default function ProjectWorkspacePage() {
  const { projectId = '' } = useParams();
  const project = getWorkspaceProject(projectId);

  if (!project) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Project not found</h1>
        <Link to="/projects" className="btn btn-secondary">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Project Workspace</p>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="mt-1 text-slate-500">
            {project.location} · {project.type}
          </p>
        </div>
        <Link to="/projects" className="btn btn-secondary">
          Back to Projects
        </Link>
      </div>

      {project.kind === 'demo' && project.demoCase ? (
        <PartitionCasePage data={project.demoCase} hideTopNav />
      ) : (
        <>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Plans</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {project.userProject?.plans.map((plan) => (
                <article key={plan.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{plan.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{plan.intent}</div>
                  <div className="mt-2 text-sm text-slate-700">{plan.aggregatedTotalKg.toLocaleString()} kgCO₂e</div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Project Scenario Comparison</h2>
            <p className="mt-2 text-slate-500">Scenario comparison for this specific project workspace.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {project.userProject?.plans.map((plan) => (
                <article key={plan.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{plan.name}</div>
                  <div className="mt-2 text-xs text-slate-600">HK adjusted: {plan.hkAdjustedIntensityKgM2.toFixed(2)} kgCO₂e/m²</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Δ vs baseline: {plan.deltaVsBaselinePct > 0 ? '+' : ''}
                    {plan.deltaVsBaselinePct}%
                  </div>
                  <div className="mt-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${readinessColor[plan.claimReadiness]}`}>
                      {plan.claimReadiness}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Evidence & Localization</h2>
            <p className="mt-2 text-slate-500">
              Original product evidence + HK localization layer + project usage context.
            </p>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              Evidence is scoped to this project workspace and linked to each plan scenario.
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Report</h2>
            <p className="mt-2 text-slate-500">
              Generate project-level comparison report with evidence trace and localization assumptions.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
