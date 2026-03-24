import type { TraversalParams } from '@/types/algorithms';

export const DefaultTraversalParams: TraversalParams = {
    algorithm: 'bfs',
    startNodeId: '',
    directed: false,
    onlySelected: false,
    graphNodes: null,
};
