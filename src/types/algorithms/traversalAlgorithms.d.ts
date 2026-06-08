export type TraversalAlgorithm = 'bfs' | 'dfs';

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
    startNodeId: string;
    directed: boolean;
    onlySelected: boolean;
    graphNodes: cytoscape.NodeCollection | null;
} & BaseTraversalParams;

export type TraversalParams = BFSParams | DFSParams;
