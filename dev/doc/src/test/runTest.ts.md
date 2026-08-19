# src/test/runTest.ts

## Purpose

This file is the integration-test launcher for the extension.

## What it does

* Resolves extensionDevelopmentPath to the project root.
* Resolves extensionTestsPath to the compiled test suite entry at out/test/suite/index.
* Resolves the VS Code executable from VSCODE_TEST_EXECUTABLE_PATH or the default macOS install path.
* Creates a temporary two-folder workspace with folder-specific relative `configPath` settings.
* Calls runTests from @vscode/test-electron and removes the temporary workspace afterward.

## Execution flow

1. Build required absolute paths.
2. Use a configured or default local VS Code executable when available.
3. Build a temporary multi-root workspace for resource-scoped configuration tests.
4. Launch Extension Host with the development extension and tests.
5. Remove the temporary workspace and exit with non-zero status if an error occurs.

## Maintenance notes

* This file should stay small and orchestration-only.
* Test discovery and assertions belong to suite/index.ts and suite/*.test.ts.
