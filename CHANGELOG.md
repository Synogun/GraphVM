# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/Synogun/GraphVM/compare/v1.2.0...develop)

### Added
- `UI` - Introduced a basic modal structure for dialogs.
- `UI` - Added a custom hook `useGraphRegistry` for managing graph instances.
- `UI` - Created reusable UI components (`SideBar`, `ColorInput`, `NumberInput`, `RangeInput`, `SelectInput`, `TextInput`).
- `UI` - Introduced React contexts (`GraphContext`, `LayoutContext`, `NodesContext`, `EdgesContext`, `PropertiesContext`) for centralized state management.
- `Project` - Implemented a component-based architecture using React.
- `Project` - Integrated DaisyUI and TailwindCSS for a modernized user interface.
### Changed
- `Project` - Updated project dependencies to their latest versions.
- `Project` - Improved Vite's Fast Refresh compatibility.
- `Project` - Added more specific type guards for better type safety.
- `Project` - Updated `tsconfig.json` with module paths for cleaner imports.
- `Project` - Reorganized project structure for better modularity, separating components, contexts, hooks, services, and types.
- `Project` - Migrated project from vanilla JavaScript to a React with TypeScript stack.
- `Project` - Migrated project build process from esbuild to Vite for improved development experience and performance.
- `Graph` - Encapsulated core graph logic into services.
- `UI` - Replaced the previous UI with a new React-based interface.
### Fixed
- `Edges` - Fixed an issue where edge creation would fail when selecting nodes after a bounding box selection.
### Removed
- `Project` - Removed unused functions and import aliases.
- `Project` - Removed old vanilla JavaScript files and assets, including the `userInterface.ts` and the `src/public` directory.
- `Workflow` - Removed old workflow files and scripts, simplifying the CI/CD process. Other strategies will be considered in the future.

## [v1.2.0](https://github.com/Synogun/GraphVM/compare/v1.0.22...v1.2.0)

### Added
- `Graph` - Introduced `GraphConfig` class for centralized configuration management.
- `UI` - Added `UserInterface` class to handle UI interactions and events.
- `Project` - Added `Graph` and `UserInterface` modules to improve modularity.
### Changed
- `Graph` - Refactored `Graph` class to encapsulate graph-related operations.
- `UI` - Replaced `ui.ts` with `userInterface.ts` for better separation of concerns.
- `Project` - Updated dependencies in `package-lock.json` and `package.json` to their latest versions.
- `HTML` - Updated HTML structure to work better on screen sizes below 1000px.
### Fixed
- `UI` - Fixed layout panel toggling issues for grid and circle layouts.
- `Graph` - Resolved edge and node property update inconsistencies.
### Removed
- `UI` - Removed `nodes.ts`, `edges.ts`, and `ui.ts` in favor of the new `UserInterface` class.
- `Project` - Removed redundant `safe-buffer` and `debug` dependencies from `package-lock.json`.

## [v1.0.22](https://github.com/Synogun/GraphVM/compare/v1.0.6...v1.0.22)

### Added
### Changed
- `Project` - Update `fetch_scope` script to from .sh to .py
- `Project` - Update PR, Issue, and Feature templates, and moves version commits from tag commit to pre-release commit
- `Project` - Changes deployment from gh-pages branch to main
- `UI` - Refactors right bar into accordions for better user experience
### Fixed
- `UI` - Fixed wrong tooltips for grid layout properties
- `UI` - Remove redundant text from left bar buttons
- `Project` - Fix action input wrong usage
### Removed

## [v1.0.6](https://github.com/Synogun/GraphVM/compare/v1.0.0...v1.0.6)

### Added
- `Project` - Adds option to toggle deployment to GitHub Pages
### Changed
- `Project` - Moves commits generated in version from gh release to release commit message
### Fixed
- `Project` - Fix action not fetching correct log
- `Project` - Fix form templates wrong keys and filename
### Removed

## [v1.0.0](https://github.com/Synogun/GraphVM/tree/v1.0.0)

### Added
- Actions to automate the release process (W.I.P.)
- Add a pull request template for saving time merging branches
- Add a yaml issue and enhancement template so it makes reporting and suggesting easier
- Updates README.md
- Applies MIT License to repository;
- Changes HTML to reflect new refactoring;
- Split files into major elements;
- Refactor functions to match typescript;
- Adopted Keep A Changelog style and Semantic Versioning;
- Bundle and transpile .ts code with esbuild;
- Configure eslint rules and other meta files;
- Import previous project files;
- Setup structure;
### Changed
- Makes bug report and feature request template forms more friendly
- `/release` directory renamed to `/docs`
### Fixed
### Removed
- Remove commitlint and husky from the project
- Remove changelog entries that don't reflect anymore
