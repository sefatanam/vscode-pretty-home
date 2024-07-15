import * as vscode from 'vscode';
import { APP } from "./constant";
import { State } from "./state";

export function setWebviewReference(webviewPanel: vscode.WebviewPanel, state: State) {
    state.data[APP.WEB_VIEW_REF] = webviewPanel;
}

export function getWebviewReference(state: State): boolean {
    try {
        const windowRef: vscode.WebviewPanel = state.data[APP.WEB_VIEW_REF];
        return windowRef.visible;
    } catch (_) {
        return false;
    }
}