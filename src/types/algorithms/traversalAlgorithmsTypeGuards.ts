import type { TraversalAlgorithm, TraversalParams } from './traversalAlgorithms';

export const ValidTraversalAlgorithms: TraversalAlgorithm[] = [
    'bfs',
    'dfs',
    'dijkstra',
    'a-star',
    'greedy-best-first',
    'bidirectional-search',
    'iterative-deepening-dfs',
    'random-walk',
];

export function isTraversalAlgorithm(value: unknown): value is TraversalAlgorithm {
    return (
        typeof value === 'string' &&
        (ValidTraversalAlgorithms as string[]).includes(value)
    );
}

export function isValidTraversalParams(params: TraversalParams): boolean {
    switch (params.algorithm) {
        case 'bfs':
        case 'dfs':
        case 'dijkstra':
        case 'a-star':
        case 'greedy-best-first':
        case 'bidirectional-search':
        case 'iterative-deepening-dfs':
        case 'random-walk':
        default:
            return true;
    }
}
