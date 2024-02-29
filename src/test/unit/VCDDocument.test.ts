import { VCDDocument } from "../../document/VCDDocument";
import * as assert from 'assert';
import {describe, before, it} from 'mocha';
import * as vscode from 'vscode';

describe('VCDDocument', () => {

    let document : VCDDocument;

    before(async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (workspaceFolders === undefined) {
            assert.fail("Error during test setup: workspace is undefined");
        }

        document = await VCDDocument.create(vscode.Uri.joinPath(workspaceFolders[0].uri, 'dump_file.vcd'));
    });

    it('Has top module', async () => {
        assert.equal(document.top.name, 'tb_mem_unit');
    });

    it('Top module has children modules', async () => {
        assert.equal(document.top.modules.length, 1);
        assert.equal(document.top.modules[0].name, 'module_inst');
    });

    it('Module variables are present', async () => {
        const varNames = [
            'clk_i',
            'rstn_i',
            'instruction_i',
            'flush_i',
            'read_head_i',
            'instruction_o',
            'ls_queue_entry_o',
            'full_o',
            'empty_o',
            'head',
            'tail',
            'num',
            'write_enable',
            'read_enable',
            'i',
        ].sort();

        const module = document.top.getModule('tb_mem_unit.module_inst.load_store_queue_inst');
        const parsedNames = module.signals.map(s => s.name).sort();
        assert.deepStrictEqual(parsedNames, varNames, "List of signals doesn't match");
    });
});
