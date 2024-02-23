import { VCDDocument } from "../document/VCDDocument";
import { WaveformEditorProvider } from "./WaveformEditorProvider";
import * as vscode from 'vscode';

export class VCDEditorProvider extends WaveformEditorProvider<VCDDocument> {

    public static register(): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            'waveform.vcd',
            new VCDEditorProvider()
        );
    }
    
    openCustomDocument(uri: vscode.Uri) {
        // Implement logic to load and parse the custom document
        return VCDDocument.create(uri);
    }
}