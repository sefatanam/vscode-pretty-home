import { commands, ConfigurationTarget, ExtensionContext, Uri, window, workspace } from "vscode";
import { Logger } from "./logger";
import { RecentProject, RecentWorkspaces, Workspace } from "./types";
import { existsSync } from 'fs';

export async function gerRecentProjects(): Promise<RecentProject[]> {
  const recentWorkspaces: RecentWorkspaces = await commands.executeCommand("_workbench.getRecentlyOpened");
  if (!recentWorkspaces) { return []; }

  const recentFolders = recentWorkspaces.workspaces || [];
  return recentFolders.map(
    (workspace): RecentProject => ({ name: getWorkspaceName(workspace), path: workspace.folderUri.path })
  );

}

export function filterProjects(projects: RecentProject[], name: string) {
  if (!name) { return projects; }

  name = name.toLowerCase().trim();
  return projects.filter(project => project.name.toLowerCase().trim().includes(name));
}

export function getWorkspaceName(workspace: Workspace): string {
  if ("configPath" in workspace) {
    return workspace.configPath?.path || "Workspace";
  }
  return workspace.folderUri.path.split("/").pop() || "Untitled";
}

export function openProject(path: string) {
  commands.executeCommand('vscode.openFolder', Uri.file(path)).then(() => {
    Logger.GetInstance().log(`Successfully opened project at path: ${JSON.stringify(path)}`);
  },
    (err) => {
      Logger.GetInstance().log(`Failed to open project at path: ${JSON.stringify(path)}, error: ${err.message}`);
    });
}

export async function showSettingsDialog(context: ExtensionContext) {
  const config = workspace.getConfiguration('prettyHome');
  const selectedOption = await window.showQuickPick(
    ['Yes', 'No'],
    {
      placeHolder: 'Do you want to load Pretty Home by default on startup?',
      ignoreFocusOut: true,
    }
  );

  if (selectedOption === 'Yes' || selectedOption === 'No') {
    const newValue = selectedOption === 'Yes';
    await config.update('showOnStartup', newValue, ConfigurationTarget.Global);
  }
}

export function isTabInstanceOpen(): boolean {
  const isInstanceOpen = window.tabGroups.all
    .flatMap(group => group.tabs)
    .find(tab => tab.label.trim().includes('Pretty-Home'));
  if (!isInstanceOpen) { return false; }
  return true;
}

export function shouldStartInStartup(): boolean {
  const config = workspace.getConfiguration('prettyHome');
  const showOnStartup = config.get('showOnStartup', false);
  return showOnStartup;
}

export function shouldOpenInstance() {
  return isTabInstanceOpen() && shouldStartInStartup();
}

export function isPathExistInOs(path: string) {
  if (!existsSync(path)) {
    Logger.GetInstance().log(`Path does not exist: ${JSON.stringify(path)}`);
    return false;
  }
  return true;
}

export async function removeFromRecentlyOpened(path: string) {
  Logger.GetInstance().log(`Removing path from recently opened projects list: ${JSON.stringify(path)}`);
  await commands.executeCommand('vscode.removeFromRecentlyOpened', Uri.file(path));
}