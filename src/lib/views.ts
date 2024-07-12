import { RecentProject } from "./types";

export const getWebviewContent = (projects: RecentProject[]) => {
     return generateWebView(makeProjectCards(projects));

};


const makeProjectCards = (projects: RecentProject[]): string => {
    const cardsHTML = projects.map(project => `
    <div class="card">
    	<div class="content">
        	<h4 class="name">${project.name}</h4>
        	<p class="path">${project.path}</p>
    	</div>
    	<div class="project-link">
        	<button class="button" onclick="openProject('${project.path}')" title="Open Project">
            	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                	stroke="currentColor" class="icon">
                	<path stroke-linecap="round" stroke-linejoin="round"
                    	d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            	</svg>
        	</button>
    	</div>
	</div>`).join('');

    return cardsHTML;
};

const generateWebView = (cards: string) => {

    return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Recent Projects</title>
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			:root {
				--container-paddding: 20px;
				--input-padding-vertical: 6px;
				--input-padding-horizontal: 4px;
				--input-margin-vertical: 4px;
				--input-margin-horizontal: 0;

				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
			}
			body {
				padding: 0 var(--container-paddding);
				color: var(--vscode-foreground);
				font-size: var(--vscode-font-size);
				font-weight: var(--vscode-font-weight);
				background-color: var(--vscode-editor-background);
				user-select: none;
			}
			body>* {
				margin-block-start: var(--input-margin-vertical);
				margin-block-end: var(--input-margin-vertical);
			}
			*:focus {
				outline-color: var(--vscode-focusBorder) !important;
			}
			.title {
				margin: 2rem 0;
				font-size: calc(var(--vscode-editor-font-size) * 2);
				border-bottom: 1px solid;
				padding-block-end: 2rem;
			}
			.grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
				gap: 20px;
			}
			.card {
				border-radius: .5rem;
				border: 1px solid var(--vscode-input-border);
				background-color: var(--vscode-input-background);
				padding: 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.card .content {
				color: var(--vscode-input-foreground);
				display: grid;
				gap: 0.5rem;
			}
			.card .name {
				font-size: var(--vscode-editor-font-size);
				user-select: text;
			}
			.card .path {
				font-size: calc(var(--vscode-editor-font-size) / 2);
				user-select: text;
			}
			.card .icon {
				--size: 1.2rem;
				height: var(--size);
				width: var(--size);
				color: var(--vscode-button-foreground);
			}
			.card:hover {
				background: var(--vscode-textLink-background);
			}
			.button {
				border: none;
				padding: var(--input-padding-vertical) var(--input-padding-horizontal);
				text-align: center;
				outline: 1px solid transparent;
				outline-offset: 2px !important;
				background: transparent;
				border-radius: 50%;
				height: 2rem;
				width: 2rem;
			}
			.button:hover {
				cursor: pointer;
				background: var(--vscode-button-hoverBackground);
			}
			.button:focus {
				outline-color: var(--vscode-focusBorder);
			}
			.project-link {
				display: flex;
				justify-content: flex-end;
				margin-top: 1rem;
			}
		</style>
	</head>
	<body>
		<h1 class="title">Recent Projects</h1>
		<div class="grid">${cards}</div>
	</body>
	</html>
`;
};