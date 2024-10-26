import { WebviewPanel } from "vscode";

export type RecentProject = { name: string; path: string };

export type Uri = {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
    _formatted: string | null;
    _fsPath: string | null;
};

export type Workspace = {
    folderUri: Uri;
    configPath?: Uri;
};

export type File = {
    fileUri: Uri;
};

export type RecentWorkspaces = {
    workspaces: Workspace[];
    files: File[];
};

export type HandleCommand = { message: any; webviewPanel: WebviewPanel };
export type HandleCommonCommand = HandleCommand & { executableFn: Function };