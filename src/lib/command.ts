import path from 'path';
import * as vscode from 'vscode';
import { APP, COMMAND } from "./constant";
import { gerRecentProjects, openProject } from "./engine";
import { getWebviewContent } from "./views";


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

            webviewPanel.iconPath=panelIconPath;
            webviewPanel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case COMMAND.INVALID_PROJECT:
                            vscode.window.showInformationMessage('Path is not valid !');
                            break;
                        case COMMAND.OPEN_PROJECT:
                            openProject(message.path);
                            break;
                        default:
                            break;
                    }
                },
                undefined,
                context.subscriptions
            );
            const projects = await gerRecentProjects();
            webviewPanel.webview.html = getWebviewContent(projects, context, webviewPanel);
            vscode.window.showInformationMessage('Pretty Home Initiate Successfully!');
        }
    );

    context.subscriptions.push(disposable);
}