
const searchInput = document.querySelector("#seachInput");
const vscode = acquireVsCodeApi();

function actionsProcessor(type, payload) {
  try { 
    switch (type) {
      case 'open': {
        vscode.postMessage({ command: "openProject", path: payload });
        break;
      }

      case 'remove': {
        vscode.postMessage({ command: "removeProject", path: payload });
        break;
      }

      case 'search': {
        console.log("search value",payload)
        vscode.postMessage({ command: "searchProject", value: payload });
        break;
      }

      case 'error': {
        vscode.postMessage({ command: "errorInProject", value: payload });
        break;
      }
    }
  } catch (error) {
    vscode.postMessage({ command: "errorInProject", value: error });
  }
}

function handleProjectAction(event, action) {
  console.log(event, action)
  const button = event.currentTarget;
  const path = button.dataset.path || null;
  actionsProcessor(action, path);
}

function attachEventListeners() {
  const buttonSelectors = [
    { selector: ".projectOpenButton", action: "open" },
    { selector: ".removeProjectButton", action: "remove" },
  ];

  buttonSelectors.forEach(({ selector, action }) => {
    document.querySelectorAll(selector).forEach((button) => {
      button.addEventListener("click", (event) => handleProjectAction(event, action));
    });
  });
}

function searchDebounce(func, wait) {
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

// searchInput.addEventListener("input", () => searchDebounce(() => actionsProcessor('search', searchInput?.value), 300));
searchInput.addEventListener("input", searchDebounce(() => actionsProcessor('search', searchInput?.value), 300));


window.addEventListener('DOMContentLoaded', () => attachEventListeners());

window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.command) {
    case "renderCards":
      document.querySelector("#cardsContainer").innerHTML = message.html;
      attachEventListeners();
      break;
  }
});
