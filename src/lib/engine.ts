import * as vscode from "vscode";
import { RecentProject, RecentWorkspaces, Workspace } from "./types";


export async function gerRecentProjects(): Promise<RecentProject[]> {
  const recentWorkspaces: RecentWorkspaces = await vscode.commands.executeCommand("_workbench.getRecentlyOpened");
  if (!recentWorkspaces) return []

  const recentFolders = recentWorkspaces.workspaces || [];
  return recentFolders.map(
    (workspace): RecentProject => ({ name: getWorkspaceName(workspace), path: workspace.folderUri.path })
  );

}

export function getWorkspaceName(workspace: Workspace): string {
  if ("configPath" in workspace) {
    return vscode.workspace.name || "Workspace";
  }
  return workspace.folderUri.path.split("/").pop() || "Untitled";
}

export function openProject(path: string) {
  try {
    vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(path), true);
  } catch (err: any) {
    vscode.window.showInformationMessage(JSON.stringify(err));
  }
}

export async function showSettingsDialog(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('prettyHome');
  const selectedOption = await vscode.window.showQuickPick(
    ['Yes', 'No'],
    {
      placeHolder: 'Do you want to load Pretty Home by default on startup?',
      ignoreFocusOut: true,
    }
  );

  if (selectedOption === 'Yes' || selectedOption === 'No') {
    const newValue = selectedOption === 'Yes';
    await config.update('showOnStartup', newValue, vscode.ConfigurationTarget.Global);
  }
}
