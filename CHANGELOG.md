# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/Synogun/GraphVM/compare/v2.3.0...develop)

### Added

- `Actions` - Added a release step for the project's pipeline.

### Changed

### Fixed

- `Logger` - Fixed logs being stored in production.
- `Actions` - Fixed deployment failing but deploying anyway.

## [v2.3.0](https://github.com/Synogun/GraphVM/compare/v2.0.0...v2.3.0)

### Added

- `UI` - Added a toast notification system with support for different types (success, error, info) and positions.
- `UI` - Introduced a settings context for managing application settings and defaults.
- `Project` - Added a custom error class `ParsedError` for consistent error handling and user-friendly messages.

### Changed

- `UI` - Reduced and added clarification comment on artificial loading time of the application.
- `UI` - Changed `ModalsProvider` to `PopupsProvider` to better reflect its purpose and added support for toasts.

### Fixed

- `DEV` - Fixed an issue with browser expecting css sourcemap.
- `DEV` - Fixed an issue with the logger not capping logs properly, which could lead to memory issues.
- `UI` - Fixed an issue with Select Input options not displaying titles correctly.

## [v2.0.0](https://github.com/Synogun/GraphVM/compare/v1.2.0...v2.0.0)

### Added

- `UI` - Implemented a modal system, including Import/Export (text, JSON, PNG, JPG), Help (tabbed documentation), and Algorithms modals.
- `UI` - Added a `ActionsBar` with buttons for graph manipulation (add/remove nodes and edges, clear graph) and operations.
- `UI` - Added a `PropertiesBar` with sections for graph info, layout configuration, and global node and edge style selection.
- `UI` - Added support for directed graph visualization with a toggle in the Properties Bar.
- `Graph` - Implemented autopan on node drag near viewport edges with configurable speed and margin.
- `Graph` - Implemented graph generation algorithms service supporting 8 graph families (complete, grid, circle, star, wheel, bipartite, complete bipartite, simple) with configurable parameters.
- `Project` - Added a centralized Logger system with context-scoped loggers, session log storage, and downloadable log export.
- `Project` - Added centralized configuration defaults for algorithms, graph styles, and layouts.
- `Project` - Adopted Prettier for code formatting (`printWidth: 85`, `singleQuote: true`, `trailingComma: 'es5'`).
- `Workflow` - Added a simplified `deploy_to_pages.yml` workflow for deploying to GitHub Pages.

### Changed

- `UI` - Replaced default font with 'Alan Sans'.
- `UI` - Replaced the previous UI with a new React-based interface using DaisyUI and Tailwind CSS.
- `Graph` - Replaced `cose` with `fcose` as the default layout algorithm.
- `Graph` - Encapsulated core graph logic into stateless service functions (`graphService`, `nodesService`, `edgesService`, `layoutService`, `importExportService`).
- `Project` - Migrated project build process from esbuild to Vite for improved development experience and performance.
- `Project` - Updated project dependencies to their latest versions.
- `Project` - Updated `tsconfig.json` with module paths for cleaner imports (`@/`, `@Logger`, `@Modals`, `@Contexts`, `@Inputs`).
- `Project` - Reorganized project structure for better modularity, separating components, contexts, hooks, providers, services, config, and types.

### Fixed

- `Edges` - Fixed an issue where edge creation would fail when selecting nodes after a bounding box selection.

### Removed

- `Project` - Removed old vanilla JavaScript source files (`app.ts`, `graph.ts`, `graphConfig.ts`, `userInterface.ts`) and assets (`src/public`, `docs/`).
- `Workflow` - Removed old `build_and_deploy.yml` workflow, issue/PR templates, and automation scripts (`calculate_semver.sh`, `fetch_scopes.py`, `update_changelog.py`).

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
