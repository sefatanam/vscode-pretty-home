import * as vscode from "vscode";
import { RecentProject, RecentWorkspaces, Workspace } from "./types";

export async function gerRecentProjects(): Promise<RecentProject[]> {
  const recentWorkspaces: RecentWorkspaces =
    await vscode.commands.executeCommand("_workbench.getRecentlyOpened");
  if (recentWorkspaces) {
    const recentFolders = recentWorkspaces.workspaces || [];
    return recentFolders.map(
      (workspace): RecentProject => ({
        name: getWorkspaceName(workspace),
        path: workspace.folderUri.path,
      })
    );
  }

  return [];
}

export function getWorkspaceName(workspace: Workspace): string {
  if ("configPath" in workspace) {
    return vscode.workspace.name || "Workspace";
  }
  return workspace.folderUri.path.split("/").pop() || "Untitled";
}
