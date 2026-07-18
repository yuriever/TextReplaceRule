# Repository Guidelines

## Structure

This is a TypeScript VS Code extension.

* `src/extension.ts`: activation and command registration.
* `src/editProvider.ts`: config loading, rewrite logic, and edit generation.
* `src/test/`: VS Code integration tests.
* `dev/`: contributor notes and internal docs.
* `out/`: compiled output.

## Commands

* `npm install`: install dependencies from `package-lock.json`.
* `npm run compile`: type-check and compile.
* `npm run watch`: compile in watch mode.
* `npm test`: compile and run integration tests.
* `npm run vscode:prepublish`: prepublish compile step.

## Tests

`src/test/runTest.ts` resolves the VS Code executable in this order:

1. `VSCODE_TEST_EXECUTABLE_PATH`
2. `/Applications/Visual Studio Code.app`
3. `@vscode/test-electron` managed binary in `.vscode-test/`

Add integration coverage under `src/test/suite/` for command behavior, config parsing, edit generation, and post-processing changes.

## Style

Follow the existing TypeScript style: strict checks, imports first, single quotes, camelCase values, PascalCase type-like names, and kebab-case VS Code command ids.

Keep `text-replace-rule.configPath` support for absolute paths, workspace-relative paths, `~/`, and paths containing spaces.

Update `README.md` for user-facing behavior and `dev/` docs for workflow or structure changes.

## Convention

* Naming
    * Prefer singular forms for section headings and directory names.

* Markdown
    * Use `*` for unordered list markers.
    * Use four spaces for nested indentation.
    * In prose, do not hard-wrap sentences to fit a fixed width.
    * For placeholders in commands, use angle/square brackets for required/optional arguments, such as `command <file> [--flag]`.
