import * as vscode from "vscode";
import { gerRecentProjects, getWebviewContent, openProject } from "./lib";
import { APP, COMMAND } from "./lib/constant";


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		"extension.showWebview",
		async () => {
			const webviewPanel = vscode.window.createWebviewPanel(
				APP.WEB_VIEW_TYPE,
				APP.TITLE,
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);
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
			vscode.window.showInformationMessage('Pretty Home Initiate Successfully !');
		}
	);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }


declare global {
	function acquireVsCodeApi(): any;
}