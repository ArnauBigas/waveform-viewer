import * as vscode from 'vscode';
import { WaveformDocument, WaveformModule, WaveformSignal } from "./WaveformDocument";

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
    top: WaveformModule | null;

    constructor() {
        this.variables = new Map();
        this.values = [];
        this.date = "unknown";
        this.version = "unknown";
        this.timescale = "unknown";
        this.top = null;
    }

    parse(fileContent: string) {
        const tokens = fileContent.split(/[\s+\n+]/).filter((val) => val !== "");
        let state: VCDParserState = VCDParserState.DEFAULT;
        let currentScope: WaveformModule | null = null;
        //let currentID = "";
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
                        currentScope = new WaveformModule(tok, currentScope);
                    }
                    break;
                case VCDParserState.READING_UPSCOPE:
                    if (tok === "$end") {
                        state = VCDParserState.DEFAULT;

                        if (currentScope === null) {
                            throw Error("Parsed an $upscode command but current scope is null");
                        }

                        if (currentScope.parent !== null) {
                            currentScope = currentScope.parent;
                        }
                    } else {
                        throw Error("Unexpected token after $upscope: " + tok);
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
                    //currentID = tok;
                    break;
                case VCDParserState.READING_VAR_NAME: {
                    state = VCDParserState.READING_VAR_UNK2;
                    const signal = new WaveformSignal(tok, currentType);
                    if (currentScope === null) {
                        throw Error("Parsed a $var command but current scope is null");
                    }
                    currentScope.addSignal(signal);
                    break;
                }
                case VCDParserState.READING_VAR_UNK2:
                    if (tok === '$end') {state = VCDParserState.DEFAULT;}
                    else {state = VCDParserState.READING_VAR_UNK2;}
                    break;
            }
        }

        if (currentScope === null) {
            throw Error("Finished parsing the document but couldn't find a top module");
        }
        this.top = currentScope;
    }

    getVariable(id: string): VCDVariable | undefined {
        return this.variables.get(id);
    }
}

export class VCDDocument extends WaveformDocument {

	static async create(
		uri: vscode.Uri,
	): Promise<WaveformDocument> {
        const contents = (await vscode.workspace.fs.readFile(uri)).toString();
        const parser = new VCDParser();
        parser.parse(contents);
        if (parser.top === null) {
            throw Error("Parser couldn't find a top");
        }
		return new VCDDocument(uri, parser.top);
	}

    
}