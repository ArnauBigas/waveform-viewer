import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	tests: [
		{
			files: 'out/test/unit/**/*.test.js',
			workspaceFolder: 'examples/',
			mocha: process.env.CI ?
			{
				reporter: 'json',
				reporterOptions: {
					output: 'test-report.json'
				}
			} : undefined
		}
	],
	coverage: {
		reporter: process.env.CI ? ['cobertura'] : undefined,
		includeAll: true
	}
});
