import { commands, ExtensionContext, window, WindowState, workspace } from "vscode";
import { Logger, openProjectInGithub, shouldOpenInstance, showPrettyHomeCommand, showPrettyHomeSettingsCommand } from "./lib";

const logger = Logger.GetInstance();
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {

	logger.log('Extension Pretty Home is now active!');

	await showPrettyHomeCommand(context);
	await showPrettyHomeSettingsCommand(context);
	await openProjectInGithub(context);

	// Open the webview by default when VS Code starts and no folder/workspace is loaded
	window.onDidChangeWindowState((e: WindowState) => {
		try {
			if (workspace.workspaceFolders) {return;}
			if (shouldOpenInstance() && e.focused) {return;}
			commands.executeCommand('extension.prettyHome');

		} catch (err: any) {
			logger.log(`${JSON.stringify(err)}. Please report to admin. Github link https://github.com/sefatanam/pretty-home`);
			window.showErrorMessage("Something went wrong. Checkout detail in the Output channel.");
		}
	});

	(function init() {
		if (workspace.workspaceFolders) {return;}
		if (shouldOpenInstance()) {return;}
		commands.executeCommand('extension.prettyHome');
	})();
}

// This method is called when your extension is deactivated
export function deactivate() {
}