import { Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';
import ProjectsPage from './pages/ProjectsPage';
import NewProjectPage from './pages/NewProjectPage';
import CaseCentralPage from './pages/CaseCentralPage';
import CaseHarbourPage from './pages/CaseHarbourPage';
import CaseKowloonPage from './pages/CaseKowloonPage';
import UserProjectWorkspacePage from './pages/UserProjectWorkspacePage';
import ProjectWorkspacePage from './pages/ProjectWorkspacePage';

function NotFoundPage() {
  return (
    <div style={{ padding: '40px', fontSize: '24px' }}>
      Route not found
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route path="/projects/:projectId/:tab?" element={<ProjectWorkspacePage />} />
        <Route path="/projects/user/:id" element={<UserProjectWorkspacePage />} />
        <Route path="/projects/demo/central" element={<CaseCentralPage />} />
        <Route path="/projects/demo/harbour" element={<CaseHarbourPage />} />
        <Route path="/projects/demo/kowloon" element={<CaseKowloonPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}