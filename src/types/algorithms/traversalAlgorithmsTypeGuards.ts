import type { TraversalAlgorithm, TraversalParams } from './traversalAlgorithms';

export const ValidTraversalAlgorithms: TraversalAlgorithm[] = ['bfs', 'dfs'];

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
        default:
            return true;
    }
}
