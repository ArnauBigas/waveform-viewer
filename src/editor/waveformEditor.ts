import * as vscode from 'vscode';
import { WaveformDocument } from '../document/waveformDocument';

export class WaveformEditorProvider implements vscode.CustomReadonlyEditorProvider<WaveformDocument> {

	public static register(): vscode.Disposable {
		return vscode.window.registerCustomEditorProvider(
			WaveformEditorProvider.viewType,
			new WaveformEditorProvider()
        );
	}

	private static readonly viewType = 'waveform.vcd';

	openCustomDocument(uri: vscode.Uri) {
        // Implement logic to load and parse the custom document
        return WaveformDocument.create(uri);
    }

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
                <h1>Variables:</h1>
                <ul>
                    ${(function fun() {
                        let result = "";
                        for (const variable of document.getVariables()) {
                            result += `<li>${variable}</li>`;
                        }
                        return result;
                    })()}
                </ul>
            </body>
            </html>
        `;
    }
}