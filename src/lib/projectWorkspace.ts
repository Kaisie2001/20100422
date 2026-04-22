import { partitionCases, type CaseData } from '../data/partitionCaseData';
import { getUserProjectById, getUserProjects, type UserProject } from './userProjects';

export type WorkspaceTab = 'overview' | 'plans' | 'scenario-comparison' | 'evidence-localization' | 'report';

export interface WorkspaceProject {
  id: string;
  name: string;
  location: string;
  type: string;
  kind: 'demo' | 'user';
  demoCase?: CaseData;
  userProject?: UserProject;
}

export function listWorkspaceProjects(): WorkspaceProject[] {
  const demoProjects: WorkspaceProject[] = (
    Object.entries(partitionCases) as Array<[string, CaseData]>
  ).map(([id, data]) => ({
    id,
    name: data.title,
    location: data.location,
    type: data.projectType,
    kind: 'demo',
    demoCase: data,
  }));

  const userProjects: WorkspaceProject[] = getUserProjects().map((item) => ({
    id: item.id,
    name: item.projectName,
    location: item.location,
    type: item.projectType,
    kind: 'user',
    userProject: item,
  }));

  return [...demoProjects, ...userProjects];
}

export function getWorkspaceProject(projectId: string): WorkspaceProject | null {
  const demoCase = partitionCases[projectId];
  if (demoCase) {
    return {
      id: projectId,
      name: demoCase.title,
      location: demoCase.location,
      type: demoCase.projectType,
      kind: 'demo',
      demoCase,
    };
  }

  const userProject = getUserProjectById(projectId);
  if (userProject) {
    return {
      id: projectId,
      name: userProject.projectName,
      location: userProject.location,
      type: userProject.projectType,
      kind: 'user',
      userProject,
    };
  }

  return null;
}
