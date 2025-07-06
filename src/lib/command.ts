import { join } from 'path';
import { commands, env, ExtensionContext, Uri, ViewColumn, window } from 'vscode';
import { APP, REPO_URL } from "./constant";
import { gerRecentProjects, isTabInstanceOpen, showSettingsDialog } from "./engine";
import { Logger } from "./logger";
import { getWebviewContent } from "./views";
import { handleCommand } from "./utils";
import { setPinStoreContext } from "./pinStore";


/**
 * Registers and shows the Pretty Home command in VS Code.
 *
 * This function creates a webview panel displaying recent projects
 * in a visually appealing format. The panel includes features such as
 * enabling scripts and retaining context when hidden. If a tab instance
 * is already open, the command returns early. The webview listens for
 * messages and handles commands accordingly.
 *
 * @param context - The VS Code extension context, used to manage the
 * extension's lifecycle and resources.
 */
export async function showPrettyHomeCommand(context: ExtensionContext) {
    const disposable = commands.registerCommand(
        "extension.prettyHome",
        async () => {
            try {
                if (isTabInstanceOpen()) {
                    return;
                };

                setPinStoreContext(context);

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
                webviewPanel.webview.html = await getWebviewContent(await gerRecentProjects(), context, webviewPanel);
            } catch (err: any) {
                Logger.GetInstance().log(`Exception opening extension at path: ${JSON.stringify(err.message)}`);
            }

        }
    );
    context.subscriptions.push(disposable);
}


/**
 * Registers and shows the Pretty Home Settings command in VS Code.
 *
 * This function shows a quick pick dialog asking the user if they want to
 * load Pretty Home by default on startup. If the user selects an option,
 * it updates the `prettyHome.showOnStartup` configuration setting.
 *
 * @param context - The VS Code extension context, used to manage the
 * extension's lifecycle and resources.
 */
export async function showPrettyHomeSettingsCommand(context: ExtensionContext) {
    const defaultSettingDisposable = commands.registerCommand(
        "extension.prettyHomeSettings",
        async () => {
            await showSettingsDialog(context);
        });
    context.subscriptions.push(defaultSettingDisposable);
}

/**
 * Registers and shows the "Give star in Github" command in VS Code.
 *
 * This function registers a command that opens the VS Code extension's
 * repository in the user's default browser, where they can star the
 * extension.
 *
 * @param context - The VS Code extension context, used to manage the
 * extension's lifecycle and resources.
 */
export async function openProjectInGithub(context: ExtensionContext) {
    const disposable = commands.registerCommand(
        "extension.prettyHomeGiveStar",
        async () => {
            env.openExternal(Uri.parse(REPO_URL));
        });
    context.subscriptions.push(disposable);
}