import * as vscode from "vscode";
import { APP, openProjectInGithub, showPrettyHomeCommand, showPrettyHomeSettingsCommand } from "./lib";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	await showPrettyHomeCommand(context);
	await showPrettyHomeSettingsCommand(context);
	await openProjectInGithub(context);

	// Open the webview by default when VS Code starts and no folder/workspace is loaded
	vscode.window.onDidChangeWindowState((e) => {
		try {
			const isPanelInstanceOpen = context.globalState.get(APP.PRETTY_HOME_PANEL_OPEN, false);
			if (isPanelInstanceOpen) return;

			const config = vscode.workspace.getConfiguration('prettyHome');
			const showOnStartup = config.get('showOnStartup', false);
			const shouldOpenPrettyHome = e.active && !vscode.workspace.workspaceFolders && showOnStartup;
			if (shouldOpenPrettyHome) {
				vscode.commands.executeCommand('extension.prettyHome');
			}
		} catch (err: any) {
			vscode.window.showErrorMessage("Something went wront to load by default.");
		}
	});

	(function init() {
		vscode.commands.executeCommand('extension.prettyHome');
	})()
}

// This method is called when your extension is deactivated
export function deactivate() {
}


declare global {
	function acquireVsCodeApi(): any;
}