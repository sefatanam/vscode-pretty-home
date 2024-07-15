import path from 'path';
import * as vscode from 'vscode';
import { APP, COMMAND } from "./constant";
import { gerRecentProjects, openProject, showSettingsDialog } from "./engine";
import { State } from "./state";
import { getWebviewReference, setWebviewReference } from "./store";
import { RecentProject } from "./types";
import { getWebviewContent, makeProjectCards } from "./views";


export async function showPrettyHomeCommand(context: vscode.ExtensionContext, state: State) {
    const disposable = vscode.commands.registerCommand(
        "extension.prettyHome",
        async () => {

            if (getWebviewReference(state)) {
                vscode.window.showInformationMessage(`You're already in Pretty Home✨`);
                return;
            }

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
            setWebviewReference(webviewPanel, state);

            webviewPanel.webview.html = getWebviewContent(projects, context, webviewPanel);
            vscode.window.showInformationMessage('Pretty Home Initialized ✨');
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

export async function openProjectInGithub(context: vscode.ExtensionContext, state: State) {
    const disposable = vscode.commands.registerCommand(
        "extension.prettyHomeGiveStar",
        async () => {
            const repoUrl = 'https://github.com/sefatanam/vscode-pretty-home';

            vscode.env.openExternal(vscode.Uri.parse(repoUrl));
        });
    context.subscriptions.push(disposable);
}

function filterProjects(projects: RecentProject[], name: string) {
    if (!name) { return projects; }

    name = name.toLowerCase().trim();
    const result = projects.filter(project => project.name.toLowerCase().trim().includes(name));
    return result;
}