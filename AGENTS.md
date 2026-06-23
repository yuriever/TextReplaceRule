# Repository Guidelines

## Project Structure & Module Organization

This repository contains a TypeScript VS Code extension. Core extension entry points live in `src/extension.ts`, while rewrite and configuration logic lives in `src/editProvider.ts`. Integration tests are under `src/test/`, with `src/test/runTest.ts` launching the VS Code test host and `src/test/suite/` holding Mocha test cases. Built JavaScript and source maps are emitted to `out/`. Static extension assets live in `images/`, and contributor-facing notes are kept in `dev/`.

## Build, Test, and Development Commands

* `npm install`: install runtime and development dependencies from `package-lock.json`.
* `npm run compile`: type-check and compile TypeScript with `tsc -p ./`.
* `npm run watch`: run TypeScript in watch mode during extension development.
* `npm test`: compile, download the VS Code test build if needed, and run the extension integration suite.
* `npm run vscode:prepublish`: run the prepublish compile step used before packaging.

## Coding Style & Naming Conventions

Use TypeScript with strict compiler settings from `tsconfig.json`, including `noImplicitAny`, `noImplicitReturns`, and unused-symbol checks. Keep imports at the top, prefer explicit types for shared data shapes, and match existing single-quote string style. Source files currently use four-space indentation in production code; preserve nearby formatting when editing tests or legacy sections. Use camelCase for functions and variables, PascalCase for classes and type-like constructs, and kebab-case for contributed VS Code command identifiers such as `text-replace-rule.runRule`.

## Testing Guidelines

Tests use Mocha, Node `assert`, and `@vscode/test-electron`. Place new extension behavior tests in `src/test/suite/extension.test.ts` or a focused file loaded by `src/test/suite/index.ts`. Name tests by observable behavior, for example `runRule preserves CRLF line endings when replacements occur`. Run `npm test` before submitting changes that affect commands, config parsing, edit generation, or post-processing.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit style, such as `feat(regexReplace): ...`, `docs: ...`, and `chore(release): ...`. Keep commit subjects imperative and scoped when useful. Pull requests should describe the behavior change, list verification commands, and link any related issue. Include screenshots only for user-visible VS Code UI changes.

## Security & Configuration Tips

The extension reads external JSON or JSONC config through `text-replace-rule.configPath`. Preserve support for absolute paths, workspace-relative paths, `~/`, and paths containing spaces. Avoid logging user config contents unless required for diagnostics.
