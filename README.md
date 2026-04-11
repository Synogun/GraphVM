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

## Source Layout

- `src/components/graph`: graph canvas, workspace shell, selection info.
- `src/components/feedback`: loading, toasts, error boundary fallback surfaces.
- `src/contexts/graph`: graph-scoped context hooks and contracts.
- `src/contexts/ui`: UI-scoped context hooks and contracts.
- `src/providers/graph`, `src/providers/elements`, `src/providers/ui`: provider domains.
- `src/types/elements`, `src/types/graph`, `src/types/ui`, `src/types/workspace`: canonical type domains.

Canonical imports use grouped paths such as `@/components/graph`, `@/components/feedback`, `@/types/ui/settings`, and `@/types/elements/edges`.

## License

MIT. See `LICENSE`.
