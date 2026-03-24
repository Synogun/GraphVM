export type TraversalAlgorithm =
    | 'bfs'
    | 'dfs'
    | 'dijkstra'
    | 'a-star'
    | 'greedy-best-first'
    | 'bidirectional-search'
    | 'iterative-deepening-dfs'
    | 'random-walk';

export type BaseTraversalParams = {
    algorithm: TraversalAlgorithm;
};

export type BFSParams = {
    algorithm: 'bfs';
    startNodeId: string;
    directed: boolean;
    onlySelected: boolean;
    graphNodes: cytoscape.NodeCollection | null;
} & BaseTraversalParams;

export type DFSParams = {
    algorithm: 'dfs';
} & BaseTraversalParams;

export type DijkstraParams = {
    algorithm: 'dijkstra';
} & BaseTraversalParams;

export type AStarParams = {
    algorithm: 'a-star';
} & BaseTraversalParams;

export type GreedyBestFirstParams = {
    algorithm: 'greedy-best-first';
} & BaseTraversalParams;

export type BidirectionalSearchParams = {
    algorithm: 'bidirectional-search';
} & BaseTraversalParams;

export type IterativeDeepeningDFSParams = {
    algorithm: 'iterative-deepening-dfs';
} & BaseTraversalParams;

export type RandomWalkParams = {
    algorithm: 'random-walk';
} & BaseTraversalParams;

export type TraversalParams =
    | BFSParams
    | DFSParams
    | DijkstraParams
    | AStarParams
    | GreedyBestFirstParams
    | BidirectionalSearchParams
    | IterativeDeepeningDFSParams
    | RandomWalkParams;
