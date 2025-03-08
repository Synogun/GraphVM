# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/Synogun/GraphVM/compare/v1.0.6...develop)

<!-- START -->
### Added
### Changed
- `Project` - Update PR, Issue, and Feature templates, and moves version commits from tag commit to pre-release commit
- `Project` - Changes deployment from gh-pages branch to main
- `UI` - Refactors right bar into accordions for better user experience
### Fixed
- `UI` - Fixed wrong tooltips for grid layout properties
- `UI` - Remove redundant text from left bar buttons
- `Project` - Fix action input wrong usage
### Removed
<!-- END -->

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
