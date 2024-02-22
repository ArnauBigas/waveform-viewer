import * as vscode from 'vscode';

interface VCDVariable {
    name: string;
    id: string;
    type: string;
}

interface VCDValueChange {
    time: number;
    id: string;
    value: string;
}

enum VCDParserState {
    DEFAULT,
    READING_DATE,
    READING_VERSION,
    READING_TIMESCALE,
    READING_SCOPE,
    READING_UPSCOPE,
    READING_VAR_TYPE,
    READING_VAR_UNK,
    READING_VAR_ID,
    READING_VAR_NAME,
    READING_VAR_UNK2,
    READING_END_DEFINITIONS,
}

class VCDParser {
    variables: Map<string, VCDVariable>;
    values: VCDValueChange[];
    date: string;
    version: string;
    timescale: string;

    constructor() {
        this.variables = new Map();
        this.values = [];
        this.date = "unknown";
        this.version = "unknown";
        this.timescale = "unknown";
    }

    parse(fileContent: string) {
        const tokens = fileContent.split(/[\s+\n+]/).filter((val) => val !== "");
        let state: VCDParserState = VCDParserState.DEFAULT;
        let currentScope = "";
        let currentID = "";
        let currentType = "";

        for (const tok of tokens) {
            switch(state) {
                case VCDParserState.DEFAULT:
                    if (tok === "$date") {
                        this.date = "";
                        state = VCDParserState.READING_DATE;
                    } else if (tok === "$version") {
                        this.version = "";
                        state = VCDParserState.READING_VERSION;
                    } else if (tok === "$timescale") {
                        this.timescale = "";
                        state = VCDParserState.READING_TIMESCALE;
                    } else if (tok === "$scope") {
                        currentScope += ".";
                        state = VCDParserState.READING_SCOPE;
                    } else if (tok === "$upscope") {
                        state = VCDParserState.READING_UPSCOPE;
                    } else if (tok === "$var") {
                        state = VCDParserState.READING_VAR_TYPE;
                    } else {
                        console.log(`Unexpected token: ${tok}`);
                    }
                    break;
                case VCDParserState.READING_DATE:
                    if (tok === "$end") {
                        state = VCDParserState.DEFAULT;
                    } else {
                        this.date += tok;
                    }
                    break;
                case VCDParserState.READING_VERSION:
                    if (tok === "$end") {
                        state = VCDParserState.DEFAULT;
                    } else {
                        this.version += tok;
                    }
                    break;
                case VCDParserState.READING_TIMESCALE:
                    if (tok === "$end") {
                        state = VCDParserState.DEFAULT;
                    } else {
                        this.timescale += tok;
                    }
                    break;
                case VCDParserState.READING_SCOPE:
                    if (tok === "$end") {
                        state = VCDParserState.DEFAULT;
                    } else if (tok !== "module") {
                        currentScope += tok;
                    }
                    break;
                case VCDParserState.READING_UPSCOPE:
                    if (tok === "$end") {
                        state = VCDParserState.DEFAULT;
                    } else {
                        currentScope = currentScope.slice(0, currentScope.lastIndexOf('.'));
                    }
                    break;
                case VCDParserState.READING_VAR_TYPE:
                    state = VCDParserState.READING_VAR_UNK;
                    currentType = tok;
                    break;
                case VCDParserState.READING_VAR_UNK:
                    state = VCDParserState.READING_VAR_ID;
                    break;
                case VCDParserState.READING_VAR_ID:
                    state = VCDParserState.READING_VAR_NAME;
                    currentID = tok;
                    break;
                case VCDParserState.READING_VAR_NAME: {
                    state = VCDParserState.READING_VAR_UNK2;
                    const name = currentScope + "." + tok;
                    const id = currentID;
                    const type = currentType;
                    this.variables.set(tok, {id, type, name});
                    break;
                }
                case VCDParserState.READING_VAR_UNK2:
                    if (tok === '$end') {state = VCDParserState.DEFAULT;}
                    else {state = VCDParserState.READING_VAR_UNK2;}
                    break;
            }
        }
    }

    getVariable(id: string): VCDVariable | undefined {
        return this.variables.get(id);
    }
}

/**
 * Define the document (the data model) used for waveform files.
 */
export class WaveformDocument implements vscode.CustomDocument {

	static async create(
		uri: vscode.Uri,
	): Promise<WaveformDocument> {
        const contents = (await vscode.workspace.fs.readFile(uri)).toString();
		return new WaveformDocument(uri, contents);
	}

	private readonly _uri: vscode.Uri;

    private _parser: VCDParser;

	private constructor(
		uri: vscode.Uri,
        contents: string
	) {
		this._uri = uri;
        this._parser = new VCDParser();
        this._parser.parse(contents);
	}

	public get uri() { return this._uri; }

    public getVariables(): string[] {
        const variables = [];
        for (const variable of this._parser.variables.values()) {
            variables.push(variable.type + " " + variable.name);
        }
        return variables;
    }

	/**
	 * Called by VS Code when there are no more references to the document.
	 *
	 * This happens when all editors for it have been closed.
	 */
	dispose(): void {

	}

}
