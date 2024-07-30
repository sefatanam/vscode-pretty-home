export const APP = {
    WEB_VIEW_TYPE: 'pretty-home',
    TITLE: 'Recent Projects | Pretty-Home',
} as const;

export const COMMAND = {
    OPEN_PROJECT: 'openProject',
    INVALID_PROJECT: 'invalidProject',
    SEARCH_PROJECT: 'searchProject',
    RENDER_CARDS: 'renderCards'
} as const;

export const WEB_VIEW_ID = {
    PROJECT_OPEN_BUTTON: 'projectOpenButton',
    SEARCH_INPUIT: 'seachInput'
} as const;

export const REPO_URL = 'https://github.com/sefatanam/vscode-pretty-home';