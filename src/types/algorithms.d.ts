export type GenerationFamily =
    | 'complete'
    | 'grid'
    | 'circle'
    | 'star'
    | 'wheel'
    // | 'cayley'
    | 'bipartite'
    | 'complete-bipartite'
    | 'cage';

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
} & BaseGenerationParams;

export type CircleGraphParams = {
    family: 'circle';
    nodeCount: number;
} & BaseGenerationParams;

export type StarGraphParams = {
    family: 'star';
    nodeCount: number;
} & BaseGenerationParams;

export type WheelGraphParams = {
    family: 'wheel';
    nodeCount: number;
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

export type CageGraphParams = {
    family: 'cage';
    degree: number;
    girth: number;
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
    | CageGraphParams;
