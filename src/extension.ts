import * as vscode from "vscode";
import { openProjectInGithub, shouldOpenInstance, showPrettyHomeCommand, showPrettyHomeSettingsCommand } from "./lib";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	await showPrettyHomeCommand(context);
	await showPrettyHomeSettingsCommand(context);
	await openProjectInGithub(context);

	// Open the webview by default when VS Code starts and no folder/workspace is loaded
	vscode.window.onDidChangeWindowState((e: vscode.WindowState) => {
		try {
			if (shouldOpenInstance() && e.focused) return;
			vscode.commands.executeCommand('extension.prettyHome');

		} catch (err: any) {
			vscode.window.showErrorMessage("Something went wront to load by default.");
		}
	});

	(function init() {
		if (shouldOpenInstance()) return;
		vscode.commands.executeCommand('extension.prettyHome');
	})()
}

// This method is called when your extension is deactivated
export function deactivate() {
}


declare global {
	function acquireVsCodeApi(): any;
}