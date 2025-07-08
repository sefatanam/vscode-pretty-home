export const APP = {
    WEB_VIEW_TYPE: 'pretty-home',
    TITLE: 'Pretty Home',
} as const;

export const COMMAND = {
    OPEN_PROJECT: 'openProject',
    ERROR_IN_PROJECT: 'errorInProject',
    SEARCH_PROJECT: 'searchProject',
    RENDER_CARDS: 'renderCards',
    REMOVE_PROJECRT: 'removeProject',
    PIN_PROJECT: 'pinProject',
    UNPIN_PROJECT: 'unpinProject',
} as const;

export const REPO_URL = 'https://github.com/sefatanam/vscode-pretty-home';