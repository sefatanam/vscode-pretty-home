import { join } from 'path';
import { commands, env, ExtensionContext, Uri, ViewColumn, window } from 'vscode';
import { APP, REPO_URL } from "./constant";
import { gerRecentProjects, isTabInstanceOpen, showSettingsDialog } from "./engine";
import { Logger } from "./logger";
import { getWebviewContent } from "./views";
import { handleCommand } from "./utils";


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
                webviewPanel.iconPath = panelIconPath;
                webviewPanel.webview.onDidReceiveMessage(async message => await handleCommand({ message, webviewPanel }), undefined, context.subscriptions);
                webviewPanel.webview.html = getWebviewContent(await gerRecentProjects(), context, webviewPanel);
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