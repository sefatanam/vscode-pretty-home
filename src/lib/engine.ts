import { commands, ConfigurationTarget, ExtensionContext, Uri, window, workspace } from "vscode";
import { Logger } from "./logger";
import { RecentProject, RecentWorkspaces, Workspace } from "./types";
import { existsSync } from 'fs';

/**
 * Retrieves a list of recent projects.
 * 
 * This function executes a VS Code command to get the list of recently opened
 * workspaces. It maps each workspace to a `RecentProject` object containing
 * the workspace name and its folder path.
 * 
 * @returns A promise that resolves to an array of `RecentProject` objects.
 */
export async function gerRecentProjects(): Promise<RecentProject[]> {
  const recentWorkspaces: RecentWorkspaces = await commands.executeCommand("_workbench.getRecentlyOpened");
  if (!recentWorkspaces) { return []; }

  const recentFolders = recentWorkspaces.workspaces || [];
  return recentFolders.map(
    (workspace): RecentProject => ({ name: getWorkspaceName(workspace), path: workspace.folderUri.path })
  );

}

/**
 * Filters a list of recent projects based on a search string.
 * 
 * This function is case-insensitive and will return all projects whose names
 * contain the given search string.
 * 
 * @param projects - The list of recent projects to filter.
 * @param name - The search string to filter by.
 * @returns A new list of `RecentProject` objects that contain the given search string.
 */
export function filterProjects(projects: RecentProject[], name: string) {
  if (!name) { return projects; }

  name = name.toLowerCase().trim();
  return projects.filter(project => project.name.toLowerCase().trim().includes(name));
}

/**
 * Returns the name of a workspace.
 * 
 * If the workspace has a configuration path, it returns the configuration path.
 * Otherwise, it returns the last part of the workspace folder path. If the
 * workspace folder path is empty, it returns "Untitled".
 * 
 * @param workspace - The workspace object.
 * @returns The name of the workspace as a string.
 */
export function getWorkspaceName(workspace: Workspace): string {
  if ("configPath" in workspace) {
    return workspace.configPath?.path || "Workspace";
  }
  return workspace.folderUri.path.split("/").pop() || "Untitled";
}

/**
 * Opens a folder in VS Code.
 * 
 * @param path - The path to the folder to open.
 * @returns A promise that is resolved when the folder is successfully opened,
 * or rejected with an error if the folder could not be opened.
 */
export function openProject(path: string) {
  commands.executeCommand('vscode.openFolder', Uri.file(path)).then(() => {
    Logger.GetInstance().log(`Successfully opened project at path: ${JSON.stringify(path)}`);
  },
    (err) => {
      Logger.GetInstance().log(`Failed to open project at path: ${JSON.stringify(path)}, error: ${err.message}`);
    });
}

/**
 * Shows a quick pick dialog asking the user if they want to load Pretty Home by
 * default on startup. If the user selects an option, it updates the
 * `prettyHome.showOnStartup` configuration setting.
 *
 * @param context - The VS Code extension context.
 */
export async function showSettingsDialog(context: ExtensionContext) {
  const config = workspace.getConfiguration('prettyHome');
  const selectedOption = await window.showQuickPick(
    ['Yes', 'No'],
    {
      placeHolder: 'Load Pretty Home by default on startup?',
      ignoreFocusOut: true,
    }
  );

  if (selectedOption === 'Yes' || selectedOption === 'No') {
    const newValue = selectedOption === 'Yes';
    await config.update('showOnStartup', newValue, ConfigurationTarget.Global);
  }
}

/**
 * Checks if a tab with the label `Pretty-Home` exists.
 * 
 * @returns Whether a tab with the label 'Pretty-Home' exists.
 */
export function isTabInstanceOpen(): boolean {
  const isInstanceOpen = window.tabGroups.all
    .flatMap(group => group.tabs)
    .find(tab => tab.label.trim().includes('Pretty-Home'));
  if (!isInstanceOpen) { return false; }
  return true;
}

/**
 * Gets the value of the `prettyHome.showOnStartup` configuration setting.
 * This setting determines if Pretty Home should be opened by default on
 * startup.
 *
 * @returns The value of the "prettyHome.showOnStartup" configuration setting.
 */
export function shouldStartInStartup(): boolean {
  const config = workspace.getConfiguration('prettyHome');
  const showOnStartup = config.get('showOnStartup', false);
  return showOnStartup;
}

/**
 * Checks if the Pretty Home tab should be opened by default on startup.
 * 
 * @returns Whether the Pretty Home tab should be opened by default on startup.
 */
export function shouldOpenInstance() {
  return isTabInstanceOpen() && shouldStartInStartup();
}

/**
 * Checks if the given path exists on the file system.
 *
 * @param path - The path to check.
 * @returns Whether the path exists on the file system.
 */
export function isPathExistInOs(path: string) {
  if (!existsSync(path)) {
    Logger.GetInstance().log(`Path does not exist: ${JSON.stringify(path)}`);
    return false;
  }
  return true;
}

/**
 * Removes the given path from the list of recently opened projects.
 * 
 * @param path - The path to remove from the list of recently opened projects.
 */
export async function removeFromRecentlyOpened(path: string) {
  Logger.GetInstance().log(`Removing path from recently opened projects list: ${JSON.stringify(path)}`);
  await commands.executeCommand('vscode.removeFromRecentlyOpened', Uri.file(path));
}