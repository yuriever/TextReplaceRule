import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

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
		const testWorkspace = createTestWorkspace();

		const vscodeExecutablePath = getVSCodeExecutablePath();
		try {
			await runTests({
				vscodeExecutablePath,
				extensionDevelopmentPath,
				extensionTestsPath,
				launchArgs: [testWorkspace.workspaceFile]
			});
		} finally {
			fs.rmSync(testWorkspace.root, { recursive: true, force: true });
		}
	} catch (err) {
		console.error(err);
		console.error('Failed to run tests');
		process.exit(1);
	}
}

function createTestWorkspace(): { root: string; workspaceFile: string } {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'text-replace-rule-test-'));
	const folders = ['first', 'second'];

	for (const folder of folders) {
		const folderPath = path.join(root, folder);
		const configPath = folder === 'second' ? '~/config.json' : 'config.json';
		fs.mkdirSync(path.join(folderPath, '.vscode'), { recursive: true });
		fs.writeFileSync(path.join(folderPath, '.vscode', 'settings.json'), JSON.stringify({
			'text-replace-rule.configPath': configPath
		}), 'utf8');
		const configFilePath = path.resolve(folderPath, configPath);
		fs.mkdirSync(path.dirname(configFilePath), { recursive: true });
		fs.writeFileSync(configFilePath, JSON.stringify({
			rules: {
				'Folder rule': {
					type: 'regexReplace',
					find: 'word',
					replace: folder,
					flag: 'g'
				}
			}
		}), 'utf8');
		fs.writeFileSync(path.join(folderPath, 'document.txt'), 'word', 'utf8');
	}

	const workspaceFile = path.join(root, 'test.code-workspace');
	fs.writeFileSync(workspaceFile, JSON.stringify({
		folders: folders.map((folder) => ({ path: folder }))
	}), 'utf8');

	return { root, workspaceFile };
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
