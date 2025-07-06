import { ExtensionContext } from 'vscode';
import { RecentProject } from './types';

const PINNED_KEY = 'prettyHome.pinnedProjects';

let extensionContext: ExtensionContext | null = null;

export function setPinStoreContext(context: ExtensionContext) {
  extensionContext = context;
}

function getContext() {
  if (!extensionContext) {
    throw new Error('PinStore context not set');
  }
  return extensionContext;
}

export function getPinnedProjects(): RecentProject[] {
  return getContext().globalState.get<RecentProject[]>(PINNED_KEY, []);
}

export async function pinProject(project: RecentProject) {
  const pinned = getPinnedProjects();
  if (!pinned.find(p => p.path === project.path)) {
    pinned.push(project);
    await getContext().globalState.update(PINNED_KEY, pinned);
  }
}

export async function unpinProject(projectPath: string) {
  const pinned = getPinnedProjects().filter(p => p.path !== projectPath);
  await getContext().globalState.update(PINNED_KEY, pinned);
}

export function isProjectPinned(projectPath: string): boolean {
  return getPinnedProjects().some(p => p.path === projectPath);
} 