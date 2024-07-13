import * as vscode from "vscode";
import { showPrettyHomeCommand } from "./lib";


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	showPrettyHomeCommand(context);
}

// This method is called when your extension is deactivated
export function deactivate() { }


declare global {
	function acquireVsCodeApi(): any;
}