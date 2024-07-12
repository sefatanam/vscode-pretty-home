const projectOpenButtons = document.querySelectorAll('.projectOpenButton');
const vscode = acquireVsCodeApi();
function triggerOpenProjectCommand(projectOpenButton) {
    const dataPath = projectOpenButton.currentTarget.dataset.path || null;
    if (!dataPath) {
        vscode.postMessage({
            command: 'invalidProject',
            path: null
        });
        return;
    }

    vscode.postMessage({
        command: 'openProject',
        path: dataPath
    });
}


Array.from(projectOpenButtons).forEach((projectOpenButton)=>projectOpenButton?.addEventListener('click', triggerOpenProjectCommand));