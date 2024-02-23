import * as vscode from 'vscode';

export class WaveformSignal {
    private readonly _name: string;
    private readonly _type: string;

    public constructor(name: string, type: string) {
        this._name = name;
        this._type = type;
    }

    public get name(): string { return this._name; }
    public get type(): string { return this._type; }
}

export class WaveformModule {
    private readonly _name: string;
    private readonly _signals: WaveformSignal[];
    private readonly _modules: WaveformModule[];
    private readonly _parent: WaveformModule | null;

    public constructor(name: string, parent: WaveformModule | null = null) {
        this._name = name;
        this._signals = [];
        this._modules = [];
        this._parent = parent;

        if (parent !== null) {
            parent.addModule(this);
        }
    }

    public get name(): string { return this._name; }
    public get signals(): WaveformSignal[] { return this._signals; }
    public get modules(): WaveformModule[] { return this._modules; }
    public get parent(): WaveformModule | null { return this._parent; }

    public addSignal(signal: WaveformSignal) { this._signals.push(signal); }
    public hasParent() { return this._parent !== null; }

    private addModule(module: WaveformModule) { this._modules.push(module); }
}

/**
 * Define the document (the data model) used for waveform files.
 */
export class WaveformDocument implements vscode.CustomDocument {

	private readonly _uri: vscode.Uri;

    private readonly _top: WaveformModule;

	protected constructor(
		uri: vscode.Uri,
        top: WaveformModule
	) {
		this._uri = uri;
        this._top = top;
	}

	public get uri() { return this._uri; }

    public get top() { return this._top; }

	/**
	 * Called by VS Code when there are no more references to the document.
	 *
	 * This happens when all editors for it have been closed.
	 */
	dispose(): void {

	}

}
