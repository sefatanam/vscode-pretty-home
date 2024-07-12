const projectOpenButtons = document.querySelectorAll('.projectOpenButton');
console.log(projectOpenButtons)
function triggerOpenProjectCommand(projectOpenButton) {
    const vscode = acquireVsCodeApi();
    const dataPath = projectOpenButton.currentTarget.dataset.path || null;
    console.log(dataPath);

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