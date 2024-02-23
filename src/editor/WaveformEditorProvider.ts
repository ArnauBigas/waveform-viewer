import * as vscode from 'vscode';
import { WaveformDocument } from '../document/WaveformDocument';

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
        // Implement logic to generate HTML content for the webview
        return `
            <!DOCTYPE html>
            <html>
            <head>
            </head>
            <body>
                Top module name:
                <ul>
                    <li>${document.top.name}</li>
                </ul>
                Top module signals:
                <ul>
                    ${(function fun() {
                        let result = "";
                        for (const variable of document.top.signals) {
                            result += `<li>${variable.name}</li>`;
                        }
                        return result;
                    })()}
                </ul>
            </body>
            </html>
        `;
    }
}