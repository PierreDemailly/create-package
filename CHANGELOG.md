# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to Semantic Versioning.

## [Unreleased]

### Added

- Added `.npmrc` config to skip lockfile, it does by default.
- Added shebang for binary executables.
- Make linter config to be json instead of yaml

### Fixed

- Binary executables now have `.mjs` extension when using ESM.
- Linter passes when project is initialized
- Improved support on Windows with `EOL` (`node:os`)

## [0.1.2] - 2023-06-25

### Fixed

- `@nodesecure/eslint-config` moved from dependencies to devDependenceis

## [0.1.1] - 2023-06-15

### Changed

- Fixed license: make path relative instead of retrieve file from cwd

## [0.1.0] - 2023-06-09

### Changed

- Package name is now required
- Updated dependencies
- Removed license prompt, license is now MIT.
- License now include year and name (name is taken from git config).
- Fixed command line arg package name regression.
- Fixed license select: program threw cause of bad implementation of `@topcli/prompts`.
- Package name can no longer be an existing folder.

## [0.0.5] - 2023-04-19

### Added

- Supports Node.js test runner.
- Command line arg package name.

### Changed

- `main` path is now relative.
- Set user `license` input correctly.
- Package version now starts with `0.0.1` instead of `0.1.0`.
- Migrate from `prompts` to `@topcli/prompts`.
- Fixed CI.

## [0.0.4] - 2023-02-19

### Added

- Added shebang.

## [0.0.3] - 2023-02-19

### Changed

- Rename assets .gitignore as it make the file ignored.
- Handle path when copying files.

## [0.0.2] - 2023-02-19

### Changed

- Uses .mjs extension to run esm outside a module project.

## [0.0.1] - 2023-02-19

### Added

- Added various files, scripts & dependencies for project setup: testing, linting, license, readme, changelog, editorConfig, and gitignore.
