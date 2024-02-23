import * as vscode from 'vscode';
import { WaveformDocument } from '../document/WaveformDocument';
import { ModuleHierarchyRenderer } from './ModuleHierarchyRenderer';

export abstract class WaveformEditorProvider<T extends WaveformDocument> implements vscode.CustomReadonlyEditorProvider<T> {

	public abstract openCustomDocument(uri: vscode.Uri): PromiseLike<T> | T;

    resolveCustomEditor(document: WaveformDocument, webviewPanel: vscode.WebviewPanel) {
        // Implement logic to render the custom document in the webview
        webviewPanel.webview.options = {
            enableScripts: true // enable JavaScript in the webview
        };

        webviewPanel.webview.html = this.getHtmlForWebview(document);

        // Listen for messages from the webview
        webviewPanel.webview.onDidReceiveMessage(() => {
            // Handle messages received from the webview
        });
    }

    private getHtmlForWebview(document: WaveformDocument) {
        const hierarchyRenderer = new ModuleHierarchyRenderer(document.top);
        return `
            <!DOCTYPE html>
            <html>
            <head>
            </head>
            <body>
                Hiearchy:
                ${hierarchyRenderer.render()}
            </body>
            </html>
        `;
    }

}