import { WebviewPanel, window } from "vscode";
import { COMMAND } from "./constant";
import { removeFromRecentlyOpened, openProject, filterProjects, isPathExistInOs, gerRecentProjects } from "./engine";
import { makeProjectCards } from "./views";
import { HandleCommand, HandleCommonCommand } from "./types";
import { RecentProject, Workspace } from "./types";


// Main command handler
export async function handleCommand(command: HandleCommand) {
    const { message, webviewPanel } = command;

    switch (message.command) {
        case COMMAND.ERROR_IN_PROJECT: {
            return window.showInformationMessage(message.value);
        }
        case COMMAND.REMOVE_PROJECRT: {
            return await handleWithMissingPath({
                message,
                webviewPanel,
                executableFn: async (path: string) => await handleRemoveProject(path, webviewPanel)
            });
        }
        case COMMAND.OPEN_PROJECT: {
            return await handleWithMissingPath({
                message,
                webviewPanel,
                executableFn: async (path: string) => await handleOpenProject(path, webviewPanel)
            });
        }
        case COMMAND.SEARCH_PROJECT: {
            return await handleSearchProject(message.value, webviewPanel);
        }
        default: {
            return window.showInformationMessage("No Command Found");
        }
    }
}

// Handle project removal
async function handleRemoveProject(projectPath: string, webviewPanel: WebviewPanel) {
    await removeFromRecentlyOpened(projectPath);
    const message = `Project at “${projectPath}” removed from recent history.`;
    window.showInformationMessage(message);
    const projects = await gerRecentProjects();
    return webviewPanel.webview.postMessage({ command: COMMAND.RENDER_CARDS, html: makeProjectCards(projects) });
}

// Handle project opening
async function handleOpenProject(projectPath: string, webviewPanel: WebviewPanel) {
    const success = await openProject(projectPath);
    if (!success) {
        webviewPanel.webview.postMessage({ command: COMMAND.ERROR_IN_PROJECT, value: `Failed to open project at path: ${projectPath}` });
    }
}

// Handle search projects
async function handleSearchProject(searchValue: string, webviewPanel: WebviewPanel) {
    const projects = await gerRecentProjects();
    const filteredProjects = filterProjects([...projects], searchValue);
    webviewPanel.webview.postMessage({ command: COMMAND.RENDER_CARDS, html: makeProjectCards(filteredProjects) });
}


async function handleWithMissingPath(command: HandleCommonCommand) {
    const { message, webviewPanel } = command;
    const projectPath = message?.path;

    const isPathExist = isPathExistInOs(projectPath);

    if (!isPathExist) {
        const errorMessage = `The path “${projectPath}” does not exist on your computer. Removing from list.`;
        window.showInformationMessage(errorMessage);

        await removeFromRecentlyOpened(projectPath);

        const projects = await gerRecentProjects();
        return webviewPanel.webview.postMessage({ command: COMMAND.RENDER_CARDS, html: makeProjectCards(projects) });
    }

    command.executableFn(projectPath);
}