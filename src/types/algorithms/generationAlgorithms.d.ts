export type GenerationFamily =
    | 'complete'
    | 'grid'
    | 'circle'
    | 'star'
    | 'wheel'
    | 'hlp'
    | 'bipartite'
    | 'complete-bipartite'
    | 'simple';

export type BaseGenerationParams = {
    family: GenerationFamily;
};

export type CompleteGraphParams = {
    family: 'complete';
    nodeCount: number;
} & BaseGenerationParams;

export type GridGraphParams = {
    family: 'grid';
    rows: number;
    cols: number;
    applyGridLayout?: boolean;
} & BaseGenerationParams;

export type CircleGraphParams = {
    family: 'circle';
    nodeCount: number;
    applyCircleLayout?: boolean;
} & BaseGenerationParams;

export type StarGraphParams = {
    family: 'star';
    nodeCount: number;
    applyConcentricLayout?: boolean;
} & BaseGenerationParams;

export type WheelGraphParams = {
    family: 'wheel';
    nodeCount: number;
    applyConcentricLayout?: boolean;
} & BaseGenerationParams;

export type HlpGraphParams = {
    family: 'hlp';
    L: number; // Dimension of the node coordinates
    P: number; // Modulo for the coordinates
    applyGridLayout?: boolean;
} & BaseGenerationParams;

export type BipartiteGraphParams = {
    family: 'bipartite';
    setASize: number;
    setBSize: number;
} & BaseGenerationParams;

export type CompleteBipartiteGraphParams = {
    family: 'complete-bipartite';
    setASize: number;
    setBSize: number;
} & BaseGenerationParams;

export type SimpleGraphParams = {
    family: 'simple';
    nodeCount: number;
    edgeCount: number;
    applyFcoseLayout?: boolean;
} & BaseGenerationParams;

export type GenerationParams =
    | CompleteGraphParams
    | GridGraphParams
    | CircleGraphParams
    | StarGraphParams
    | WheelGraphParams
    | HlpGraphParams
    | BipartiteGraphParams
    | CompleteBipartiteGraphParams
    | SimpleGraphParams;
