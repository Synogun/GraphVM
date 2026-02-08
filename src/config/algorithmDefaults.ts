import type {
    BipartiteGraphParams,
    CageGraphParams,
    CircleGraphParams,
    CompleteBipartiteGraphParams,
    CompleteGraphParams,
    GenerationParams,
    GridGraphParams,
    StarGraphParams,
    WheelGraphParams,
} from '@/types/algorithms';

export const DefaultGenerationParams: GenerationParams = {
    family: 'complete',
    nodeCount: 5,
};

export const DefaultCompleteGenerationParams: CompleteGraphParams = {
    family: 'complete',
    nodeCount: 5,
};

export const MinimumCompleteGenerationParams: CompleteGraphParams = {
    family: 'complete',
    nodeCount: 3, // K3
};

export const DefaultGridGenerationParams: GridGraphParams = {
    family: 'grid',
    rows: 3,
    cols: 3,
};

export const MinimumGridGenerationParams: GridGraphParams = {
    family: 'grid',
    rows: 1, // Impossible to have 0 or negative rows
    cols: 1, // Impossible to have 0 or negative columns
};

export const DefaultCircleGenerationParams: CircleGraphParams = {
    family: 'circle',
    nodeCount: 5,
};

export const MinimumCircleGenerationParams: CircleGraphParams = {
    family: 'circle',
    nodeCount: 3, // Minimum to form a circle - C3
};

export const DefaultStarGenerationParams: StarGraphParams = {
    family: 'star',
    nodeCount: 5,
};

export const MinimumStarGenerationParams: StarGraphParams = {
    family: 'star',
    nodeCount: 3, // Minimum to form a star - S3
};

export const DefaultWheelGenerationParams: WheelGraphParams = {
    family: 'wheel',
    nodeCount: 5,
};

export const MinimumWheelGenerationParams: WheelGraphParams = {
    family: 'wheel',
    nodeCount: 3, // Minimum to form a wheel - W3
};

export const DefaultBipartiteGenerationParams: BipartiteGraphParams = {
    family: 'bipartite',
    setASize: 3,
    setBSize: 3,
};

export const MinimumBipartiteGenerationParams: BipartiteGraphParams = {
    family: 'bipartite',
    setASize: 1, // No empty sets
    setBSize: 1, // No empty sets
};

export const DefaultCompleteBipartiteGenerationParams: CompleteBipartiteGraphParams =
    {
        family: 'complete-bipartite',
        setASize: 3,
        setBSize: 3,
    };

export const MinimumCompleteBipartiteGenerationParams: CompleteBipartiteGraphParams =
    {
        family: 'complete-bipartite',
        setASize: 1, // No empty sets
        setBSize: 1, // No empty sets
    };

export const DefaultCageGenerationParams: CageGraphParams = {
    family: 'cage',
    degree: 3,
    girth: 4,
};

export const MinimumCageGenerationParams: CageGraphParams = {
    family: 'cage',
    degree: 2, // Minimum degree for a cage graph is 2 (a cycle)
    girth: 3, // Minimum girth for a cage graph is 3 (a triangle)
};
