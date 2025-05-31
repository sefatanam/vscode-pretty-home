import { ExtensionContext, Uri, WebviewPanel } from 'vscode';
import { RecentProject } from "./types";

/**
 * Generates the content of the webview based on the given projects.
 * 
 * @param {RecentProject[]} projects The list of projects to be displayed in the webview.
 * @param {ExtensionContext} context The VS Code extension context.
 * @param {WebviewPanel} panel The webview panel.
 * @returns {string} The content of the webview.
 */
export const getWebviewContent = (projects: RecentProject[], context: ExtensionContext, panel: WebviewPanel) => {
	let htmlContent = generateWebView(makeProjectCards(projects));

	const iconFilePath = Uri.joinPath(context.extensionUri, 'assets', 'icon.png');
	const iconUri = panel.webview.asWebviewUri(iconFilePath);
	htmlContent = htmlContent.replace('favicon.png', iconUri.toString());

	const cssFilePath = Uri.joinPath(context.extensionUri, 'css', 'style.css');
	const cssUri = panel.webview.asWebviewUri(cssFilePath);
	htmlContent = htmlContent.replace('style.css', cssUri.toString());

	const jsFilePath = Uri.joinPath(context.extensionUri, 'js', 'broker.js');
	const visUri = panel.webview.asWebviewUri(jsFilePath);
	htmlContent = htmlContent.replace('broker.js', visUri.toString());
	return htmlContent;
};


/**
 * Generates HTML for project cards to be displayed in the webview.
 * 
 * Each project is represented as a card with its name and path, along with
 * buttons to remove the project from the recent list or open the project.
 * If no projects are available, a message indicating no projects are found
 * is returned.
 * 
 * @param {RecentProject[]} projects - The list of projects to create cards for.
 * @returns {string} The HTML string containing the project cards or a message
 * indicating no projects are found.
 */
export const makeProjectCards = (projects: RecentProject[]): string => {

	if (projects.length <= 0) {
		return `<p>No Project found.</p>`;
	}

	const cardsHTML = projects.map(project => {
        const encodedPath = encodeURIComponent(project.path);
        return `
    <div class="card">
    	<div class="content">
        	<h4 class="name">${project.name}</h4>
        	<p class="path">${project.path}</p>
    	</div>
    	<div class="project-link">
			<vscode-button class="button" data-action="remove" data-path="${encodedPath}" data-name="${project.name}" title="Remove Project">
            	<svg data-action="remove" data-path="${encodedPath}" data-name="${project.name}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
  					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
        	</vscode-button>
        	<vscode-button class="button" data-action="open" data-path="${encodedPath}" data-name="${project.name}" title="Open Project">
            	<svg data-action="open" data-path="${encodedPath}" data-name="${project.name}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                	stroke="currentColor" class="icon">
                	<path stroke-linecap="round" stroke-linejoin="round"
                    	d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            	</svg>
        	</vscode-button>
			
    	</div>
	</div>`;
    }).join('');

	return cardsHTML;
};

/**
 * Generates the HTML structure for the webview displaying recent projects.
 * 
 * @param {string} cards - The HTML string containing project cards to be embedded
 *                         within the webview.
 * @returns {string} HTML content of the webview, including the head and body 
 *                   sections, styles, and scripts.
 */
const generateWebView = (listOfCards: string) => {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Recent Projects</title>
		<link rel="stylesheet" href="style.css">
		<link rel="icon" type="image/png" href="favicon.png" />
	</head>
	<body>
		<div class="heading">
			<h1 class="title">Recent Projects</h1>
			<input type="text" placeholder="Search Project" id="seachInput" value=""/>
		</div>
		<div class="grid" id='cardsContainer'> ${listOfCards}</div>
		<script type="text/javascript" src="broker.js"></script>
	</body>
	</html>
`;
};