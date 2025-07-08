const searchInput = document.querySelector("#seachInput");
const vscode = acquireVsCodeApi();
const cardsContainer = document.querySelector("#cardsContainer");

/**
 * A custom event that is fired when a project needs to be acted upon.
 *
 * It is fired on the document, and bubbles up to the window.
 *
 * The event's detail object has two properties:
 * - `action`: The action that needs to be performed on the project. This can be 'open' or 'remove'.
 * - `path`: The path of the project that needs to be acted upon.
 */
const ProjectActionEvent = (action, path) => new CustomEvent("project:action", {
  bubbles: true,
  detail: { action, path },
});

/**
 * Processes a project action.
 *
 * This function takes two arguments:
 * - `type`: The type of action to perform on the project. This can be 'open', 'remove', 'search', or 'error'.
 * - `payload`: The payload of the action. This is the path of the project for 'open' and 'remove', a search term for 'search', and an error message for 'error'.
 *
 * It sends a message to the VS Code extension with the appropriate command to perform the action.
 *
 * If there is an error, it sends a message to the VS Code extension with the command "errorInProject" and the error message as the payload.
 */
function actionsProcessor(type, payload) {
  try {
    // Decode the payload before processing if it's a string (likely a path)
    const processedPayload = typeof payload === 'string' ? decodeURIComponent(payload) : payload;

    switch (type) {
      case 'open': {
        vscode.postMessage({ command: "openProject", path: processedPayload });
        break;
      }

      case 'remove': {
        vscode.postMessage({ command: "removeProject", path: processedPayload });
        break;
      }
      case 'search': {
        vscode.postMessage({ command: "searchProject", value: processedPayload });
        break;
      }

      case 'pin': {
        vscode.postMessage({ command: "pinProject", path: processedPayload });
        break;
      }
      case 'unpin': {
        vscode.postMessage({ command: "unpinProject", path: processedPayload });
        break;
      }

      case 'error': {
        vscode.postMessage({ command: "errorInProject", value: processedPayload });
        break;
      }
    }
  } catch (error) {
    vscode.postMessage({ command: "errorInProject", value: error });
  }
}


/**
 * Returns a debounced version of the given function.
 *
 * The debounced function will only be called once the given time
 * has passed since the last time it was called.
 *
 * @param {function} func - The function to debounce.
 * @param {number} wait - The time in milliseconds to wait.
 *
 * @returns {function(...*)} A debounced version of the function.
 */
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

searchInput.addEventListener("input", searchDebounce(() => actionsProcessor('search', searchInput?.value), 300));

cardsContainer.addEventListener("click", (event) => {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) {
    return null;
  };
  actionEl.dispatchEvent(ProjectActionEvent(actionEl.dataset.action, actionEl.dataset.path));
});

window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.command) {
    case "renderCards":
      cardsContainer.innerHTML = message.html;
      break;
  }
});

window.addEventListener("project:action", (event) => {
  const { action, path } = event.detail;
  actionsProcessor(action, path);
})