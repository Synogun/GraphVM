export type GenerationFamily =
    | 'complete'
    | 'grid'
    | 'circle'
    | 'star'
    | 'wheel'
    // | 'cayley'
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

// export type CayleyGraphParams = {
//     family: 'cayley';
//     group: string; // e.g., "symmetric group S3"
//     generators: string[]; // e.g., ["(1 2)", "(1 2 3)"]
// } & BaseGenerationParams;

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
    // | CayleyGraphParams
    | BipartiteGraphParams
    | CompleteBipartiteGraphParams
    | SimpleGraphParams;
