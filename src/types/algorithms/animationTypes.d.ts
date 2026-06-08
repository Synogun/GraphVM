import type { EdgeColoringAnimation } from './coloringAlgorithms';

export type BaseAlgorithmStep = {
    nodeId: string;
    edgeId?: string;
    visited: readonly string[];
    currentNode: string;
    operation: string;
    frontier: unknown;
    metrics: Record<string, unknown>;
};

export type BFSStep = BaseAlgorithmStep & {
    operation: 'enqueue' | 'dequeue' | 'visit' | 'discover-edge';
    frontier: readonly string[];
    metrics: { depth: Readonly<Record<string, number>> };
};

export type DFSStep = BaseAlgorithmStep & {
    operation: 'push' | 'pop' | 'visit' | 'discover-edge';
    frontier: readonly string[];
    metrics: { depth: Readonly<Record<string, number>> };
};

export type BFSAnimationParams = {
    algorithm: 'bfs';
    startNodeId: string;
    directed: boolean;
    onlySelected: boolean;
    graphNodeIds: string[] | null;
};

export type DFSAnimationParams = {
    algorithm: 'dfs';
    startNodeId: string;
    directed: boolean;
    onlySelected: boolean;
    graphNodeIds: string[] | null;
};

export type BFSAnimation = {
    algorithm: 'bfs';
    params: BFSAnimationParams;
    steps: readonly BFSStep[];
};

export type DFSAnimation = {
    algorithm: 'dfs';
    params: DFSAnimationParams;
    steps: readonly DFSStep[];
};

export type AlgorithmAnimation = BFSAnimation | DFSAnimation | EdgeColoringAnimation;

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'finished';
