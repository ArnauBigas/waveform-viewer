import * as assert from 'assert';
import {describe, before, it} from 'mocha';
import { By, EditorView, VSBrowser, WebView } from 'vscode-extension-tester';

// Create a Mocha suite
describe('Waveform Editor', () => {
  let browser: VSBrowser;
  
  // initialize the browser and webdriver
  before(async function () {
	this.timeout(10_000);
    browser = VSBrowser.instance;
	await browser.openResources('examples/dump_file.vcd');
  });
  
  it('Collapsible Module Hierarchy list', async () => {
	// Open waveform editor
    const editorView = new EditorView();
	const editor = await editorView.openEditor('dump_file.vcd');
	await editor.wait(); // Wait for the thing to be opened

	// Switch to the webview inside the editor
	const webview = new WebView();
	await webview.switchToFrame();

	const tb_mem_unit = await webview.findWebElement(By.id('tb_mem_unit'));
	const module_inst = await webview.findWebElement(By.id('tb_mem_unit.module_inst'));

	assert.ok(await tb_mem_unit.isDisplayed(), "Top module is not displayed in hierarchy list!");
	assert.ok(!(await module_inst.isDisplayed()), "Child module is displayed in hierarchy list before clicking on its parent!");

	await tb_mem_unit.click();

	assert.ok(await tb_mem_unit.isDisplayed(), "Top module is not displayed in hierarchy list!");
	assert.ok(await module_inst.isDisplayed(), "Child module is not displayed in hierarchy list after clicking on its parent!");
  });
});
