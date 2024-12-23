export const APP = {
    WEB_VIEW_TYPE: 'pretty-home',
    TITLE: 'Recent Projects | Pretty-Home',
} as const;

export const COMMAND = {
    OPEN_PROJECT: 'openProject',
    ERROR_IN_PROJECT: 'errorInProject',
    SEARCH_PROJECT: 'searchProject',
    RENDER_CARDS: 'renderCards',
    REMOVE_PROJECRT: 'removeProject',
} as const;

export const REPO_URL = 'https://github.com/sefatanam/vscode-pretty-home';