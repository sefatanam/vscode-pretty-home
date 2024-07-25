import path from 'path';
import * as vscode from 'vscode';
import { APP, COMMAND, REPO_URL } from "./constant";
import { gerRecentProjects, openProject, showSettingsDialog } from "./engine";
import { RecentProject } from "./types";
import { getWebviewContent, makeProjectCards } from "./views";


export async function showPrettyHomeCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "extension.prettyHome",
        async () => {
            const isPanelInstanceOpen = context.globalState.get(APP.PRETTY_HOME_PANEL_OPEN, false);
            if (isPanelInstanceOpen) return;
            
            const panelIconPath = {
                light: vscode.Uri.file(path.join(context.extensionPath, 'assets', 'icon.png')),
                dark: vscode.Uri.file(path.join(context.extensionPath, 'assets', 'icon.png'))
            };

            const webviewPanel = vscode.window.createWebviewPanel(
                APP.WEB_VIEW_TYPE,
                APP.TITLE,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
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
            vscode.window.showInformationMessage('Pretty Home Initialized ✨');
            context.globalState.update(APP.PRETTY_HOME_PANEL_OPEN, true);
            
            webviewPanel.onDidDispose(() => {
                context.globalState.update(APP.PRETTY_HOME_PANEL_OPEN, false);
            })
        }
    );
    context.subscriptions.push(disposable);
}


export async function showPrettyHomeSettingsCommand(context: vscode.ExtensionContext) {
    const defaultSettingDisposable = vscode.commands.registerCommand(
        "extension.prettyHomeSettings",
        async () => {
            await showSettingsDialog(context);
        });
    context.subscriptions.push(defaultSettingDisposable);
}

export async function openProjectInGithub(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "extension.prettyHomeGiveStar",
        async () => {
            vscode.env.openExternal(vscode.Uri.parse(REPO_URL));
        });
    context.globalState.update(APP.PRETTY_HOME_PANEL_OPEN, false);
    context.subscriptions.push(disposable);
}

function filterProjects(projects: RecentProject[], name: string) {
    if (!name) { return projects; }

    name = name.toLowerCase().trim();
    return projects.filter(project => project.name.toLowerCase().trim().includes(name));
}