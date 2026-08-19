# Repository Guidelines

## Structure

This is a TypeScript VS Code extension.

* `src/extension.ts`: activation and command registration.
* `src/editProvider.ts`: config loading, rewrite logic, and edit generation.
* `src/test/`: VS Code integration tests.
* `dev/`: contributor notes and internal docs.
* `out/`: compiled output.

## Command

* `npm install`: install dependencies from `package-lock.json`.
* `npm run compile`: type-check and compile.
* `npm run watch`: compile in watch mode.
* `npm test`: compile and run integration tests.
* `npm run vscode:prepublish`: prepublish compile step.

## Test

`src/test/runTest.ts` resolves the VS Code executable in this order:

1. `VSCODE_TEST_EXECUTABLE_PATH`
2. `/Applications/Visual Studio Code.app`
3. `@vscode/test-electron` managed binary in `.vscode-test/`

Add integration coverage under `src/test/suite/` for command behavior, config parsing, edit generation, and post-processing changes.

## Style

Follow the existing TypeScript style: strict checks, imports first, single quotes, camelCase values, PascalCase type-like names, and kebab-case VS Code command ids.

Keep `text-replace-rule.configPath` resource-aware and resource-scoped. Explicit absolute paths work directly. Ordinary relative paths, including paths with spaces, resolve from the workspace folder containing the active document; report a handled error when no containing folder exists. Do not expand `~/` or add other private path syntax.

Changing the `configPath` setting must clear the external config cache automatically. Editing the external config file contents still requires `Developer: Reload Window`; do not add a watcher or polling.

Update `README.md` for user-facing behavior and `dev/` docs for workflow or structure changes.

## Convention

* Naming
    * Prefer singular forms for section headings, file and directory names.
