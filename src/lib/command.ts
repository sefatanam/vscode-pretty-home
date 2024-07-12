import * as vscode from 'vscode';
import { gerRecentProjects } from "./engine";
import { getWebviewContent } from "./views";

export const loadProjectCards = (context: vscode.ExtensionContext) : vscode.Disposable => vscode.commands.registerCommand(
    "extension.showWebview",
    async () => {

        const panel = vscode.window.createWebviewPanel(
            "prettyHome",
            "Recent Projects | Pretty Home",
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        const projects = await gerRecentProjects();
        panel.webview.html = getWebviewContent(projects.slice(0, 3), context, panel);
    }
);