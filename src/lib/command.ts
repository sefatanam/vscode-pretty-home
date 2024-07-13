import path from 'path';
import * as vscode from 'vscode';
import { APP, COMMAND } from "./constant";
import { gerRecentProjects, openProject } from "./engine";
import { RecentProject } from "./types";
import { getWebviewContent, makeProjectCards } from "./views";


export async function showPrettyHomeCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "extension.prettyHome",
        async () => {

            const panelIconPath = {
                light: vscode.Uri.file(path.join(context.extensionPath, 'src/assets', 'icon.png')),
                dark: vscode.Uri.file(path.join(context.extensionPath, 'src/assets', 'icon.png'))
            };

            const webviewPanel = vscode.window.createWebviewPanel(
                APP.WEB_VIEW_TYPE,
                APP.TITLE,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                }
            );
            const projects = await gerRecentProjects();
            webviewPanel.iconPath = panelIconPath;
            webviewPanel.webview.onDidReceiveMessage(
                message => {
                    try {
                        switch (message.command) {
                            case COMMAND.INVALID_PROJECT:
                                vscode.window.showInformationMessage('Path is not valid !');
                                break;
                            case COMMAND.OPEN_PROJECT:
                                openProject(message.path);
                                break;
                            case COMMAND.SEARCH_PROJECT:
                                const filteredProjects = filterProjects([...projects], message.value);
                                const productCards = makeProjectCards(filteredProjects);
                                webviewPanel.webview.postMessage({ command: COMMAND.RENDER_CARDS, html: productCards });
                        }
                    } catch (err: any) {
                        vscode.window.showInformationMessage(JSON.stringify(err));
                    }
                },
                undefined,
                context.subscriptions
            );
            webviewPanel.webview.html = getWebviewContent(projects, context, webviewPanel);
            vscode.window.showInformationMessage('Pretty Home Initiate Successfully!');
        }
    );

    context.subscriptions.push(disposable);
}


function filterProjects(projects: RecentProject[], name: string) {
    if (!name) { return projects; }

    name = name.toLowerCase().trim();
    const result = projects.filter(project => project.name.toLowerCase().trim().includes(name));
    return result;
}