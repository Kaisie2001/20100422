import { NavLink, Outlet } from 'react-router-dom';
import { useLocale } from '../lib/locale';

const navCopy = {
  zh: {
    home: '首頁',
    projects: '專案',
    newProject: '新增專案',
    createWorkspace: '建立工作區',
  },
  en: {
    home: 'Home',
    projects: 'Projects',
    newProject: 'New Project',
    createWorkspace: 'Create Workspace',
  },
} as const;

export default function AppShell() {
  const { locale, setLocale } = useLocale();
  const t = navCopy[locale];
  const baseLink =
    'rounded-md px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900';

  const activeLink =
    'rounded-md bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700';

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
              T
            </div>
            <span className="text-lg font-semibold tracking-tight text-neutral-900">TraceWall-HK</span>
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? activeLink : baseLink)}
              end
            >
              {t.home}
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) => (isActive ? activeLink : baseLink)}
            >
              {t.projects}
            </NavLink>

            <NavLink
              to="/projects/new"
              className={({ isActive }) => (isActive ? activeLink : baseLink)}
            >
              {t.newProject}
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 p-1">
              <button
                className={`rounded-sm px-2 py-1 text-xs font-medium ${
                  locale === 'zh' ? 'bg-white text-brand-700 shadow-xs' : 'text-neutral-500'
                }`}
                onClick={() => setLocale('zh')}
              >
                繁中
              </button>
              <button
                className={`rounded-sm px-2 py-1 text-xs font-medium ${
                  locale === 'en' ? 'bg-white text-brand-700 shadow-xs' : 'text-neutral-500'
                }`}
                onClick={() => setLocale('en')}
              >
                EN
              </button>
            </div>
            <NavLink to="/projects/new" className="btn btn-primary hidden md:inline-flex">
              {t.createWorkspace}
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}