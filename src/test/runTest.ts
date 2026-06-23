import * as path from 'path';
import * as fs from 'fs';

import { runTests } from '@vscode/test-electron';

const macOSVSCodeExecutablePaths = [
	'/Applications/Visual Studio Code.app/Contents/MacOS/Electron',
	'/Applications/Visual Studio Code.app/Contents/MacOS/Code'
];

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		const vscodeExecutablePath = getVSCodeExecutablePath();
		await runTests({ vscodeExecutablePath, extensionDevelopmentPath, extensionTestsPath });
	} catch (err) {
		console.error(err);
		console.error('Failed to run tests');
		process.exit(1);
	}
}

function getVSCodeExecutablePath(): string | undefined {
	const configuredPath = process.env.VSCODE_TEST_EXECUTABLE_PATH;
	if (configuredPath) {
		return configuredPath;
	}

	if (process.platform !== 'darwin') {
		return undefined;
	}

	return macOSVSCodeExecutablePaths.find((candidatePath) => fs.existsSync(candidatePath));
}

main();
