import { join } from 'path';
import { commands, env, ExtensionContext, Uri, ViewColumn, window } from 'vscode';
import { APP, COMMAND, REPO_URL } from "./constant";
import { filterProjects, gerRecentProjects, isTabInstanceOpen, openProject, showSettingsDialog } from "./engine";
import { Logger } from "./logger";
import { getWebviewContent, makeProjectCards } from "./views";


export async function showPrettyHomeCommand(context: ExtensionContext) {
    const disposable = commands.registerCommand(
        "extension.prettyHome",
        async () => {
            try {
                if (isTabInstanceOpen()) {
                    return;
                };

                const panelIconPath = {
                    light: Uri.file(join(context.extensionPath, 'assets', 'icon.png')),
                    dark: Uri.file(join(context.extensionPath, 'assets', 'icon.png'))
                };

                const webviewPanel = window.createWebviewPanel(
                    APP.WEB_VIEW_TYPE,
                    APP.TITLE,
                    ViewColumn.One,
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
                                    window.showInformationMessage('Path is not valid !');
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
                            window.showInformationMessage(JSON.stringify(err));
                        }
                    },
                    undefined,
                    context.subscriptions
                );
                webviewPanel.webview.html = getWebviewContent(projects, context, webviewPanel);
            } catch (err: any) {
                Logger.GetInstance().log(`Exception opening extension at path: ${JSON.stringify(err.message)}`);
            }

        }
    );
    context.subscriptions.push(disposable);
}


export async function showPrettyHomeSettingsCommand(context: ExtensionContext) {
    const defaultSettingDisposable = commands.registerCommand(
        "extension.prettyHomeSettings",
        async () => {
            await showSettingsDialog(context);
        });
    context.subscriptions.push(defaultSettingDisposable);
}

export async function openProjectInGithub(context: ExtensionContext) {
    const disposable = commands.registerCommand(
        "extension.prettyHomeGiveStar",
        async () => {
            env.openExternal(Uri.parse(REPO_URL));
        });
    context.subscriptions.push(disposable);
}
