# GraphVM

GraphVM is a React + TypeScript application for graph modeling, visualization,
and manipulation using Cytoscape.

## Requirements

- Node.js 20.x (recommended)
- npm

## Setup

```bash
npm ci
cp .env.example .env
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Scripts

- `npm run dev`: start Vite development server.
- `npm run dev:host`: start Vite server exposed on the local network.
- `npm run build`: type-check and build production assets.
- `npm run lint`: run ESLint against `src`.
- `npm run lint:fix`: run ESLint with automatic fixes.
- `npm run format`: run Prettier on `src/**/*`.
- `npm run preview`: preview the production build.

## Architecture Overview

- Graph state source of truth: Cytoscape instance.
- UI state: React contexts and providers for settings, graph metadata, graph
  selection, modals, and toasts.
- Service layer: stateless operations in `src/services` for graph mutations,
  import/export, layout, and algorithms.
- Split-state synchronization: after graph mutations, relevant UI metadata
  (counts and selections) is explicitly synchronized.

## License

MIT. See `LICENSE`.
