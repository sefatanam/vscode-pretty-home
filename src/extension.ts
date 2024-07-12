import * as vscode from "vscode";
import { gerRecentProjects, getWebviewContent } from "./lib";
 
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		"extension.showWebview",
		async () => {
			const panel = vscode.window.createWebviewPanel(
				"prettyHome",
				"Recent Projects | Pretty Home",
				vscode.ViewColumn.One,
				{}
			);
			const projects = await gerRecentProjects();
			panel.webview.html = getWebviewContent(projects);
		}
	);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
