const projectOpenButtons = document.querySelectorAll(".projectOpenButton");
const searchInput = document.querySelector("#seachInput");
const vscode = acquireVsCodeApi();

function triggerOpenProjectCommand(projectOpenButton) {
  const dataPath = projectOpenButton.currentTarget.dataset.path || null;
  if (!dataPath) {
    vscode.postMessage({
      command: "invalidProject",
      path: null,
    });
    return;
  }

  vscode.postMessage({
    command: "openProject",
    path: dataPath,
  });
}

function triggerSearchProjectCommand(searchInput) {
  const searchValue = searchInput.value;
  vscode.postMessage({
    command: "searchProject",
    value: searchValue,
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
const debouncedTriggerSearchProjectCommand = debounce(
  triggerSearchProjectCommand,
  300
);

Array.from(projectOpenButtons).forEach((projectOpenButton) =>
  projectOpenButton?.addEventListener("click", triggerOpenProjectCommand)
);
searchInput.addEventListener("input", () =>
  debouncedTriggerSearchProjectCommand(searchInput)
);

window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.command) {
    case "renderCards":
      document.querySelector("#cardsContainer").innerHTML = message.html;
      break;
  }
});
