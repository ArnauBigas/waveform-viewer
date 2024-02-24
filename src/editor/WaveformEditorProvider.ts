import * as vscode from 'vscode';
import { WaveformDocument } from '../document/WaveformDocument';
import { ModuleHierarchyRenderer } from './ModuleHierarchyRenderer';

export abstract class WaveformEditorProvider<T extends WaveformDocument> implements vscode.CustomReadonlyEditorProvider<T> {

    private readonly _extensionUri: vscode.Uri;

    protected constructor(context: vscode.ExtensionContext) {
		this._extensionUri = context.extensionUri;
	}

	public abstract openCustomDocument(uri: vscode.Uri): PromiseLike<T> | T;

    resolveCustomEditor(document: WaveformDocument, webviewPanel: vscode.WebviewPanel) {
        // Implement logic to render the custom document in the webview
        webviewPanel.webview.options = {
            enableScripts: true // enable JavaScript in the webview
        };

        webviewPanel.webview.html = this.getHtmlForWebview(document, webviewPanel);

        // Listen for messages from the webview
        webviewPanel.webview.onDidReceiveMessage(() => {
            // Handle messages received from the webview
        });
    }

    private getHtmlForWebview(document: WaveformDocument, webviewPanel: vscode.WebviewPanel) {
		const scriptPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'script.js');
		const stylesPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css');

		const scriptUri = webviewPanel.webview.asWebviewUri(scriptPath);
		const stylesUri = webviewPanel.webview.asWebviewUri(stylesPath);

        const hierarchyRenderer = new ModuleHierarchyRenderer(document.top, 'module-hierarchy');
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <link href="${stylesUri}" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <div class="container__left">
                        <div class="container__top">
                            <span class="container_title">HIERARCHY</span>
                            ${hierarchyRenderer.render()}
                        </div>
                        <div class="resizer" data-direction="vertical"></div>
                        <div class="container__bottom">
                            <span class="container_title">SIGNALS</span>
                            TODO
                        </div>
                    </div>
                    <div class="resizer" data-direction="horizontal"></div>
                    <div class="container__right">
                        Waveform View
                        TODO
                    </div>
                </div>
                
                <script src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }

}