import type {
    BipartiteGraphParams,
    CircleGraphParams,
    CompleteBipartiteGraphParams,
    CompleteGraphParams,
    GenerationParams,
    GridGraphParams,
    SimpleGraphParams,
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
    applyGridLayout: true,
};

export const MinimumGridGenerationParams: GridGraphParams = {
    family: 'grid',
    rows: 1, // Impossible to have 0 or negative rows
    cols: 1, // Impossible to have 0 or negative columns
    applyGridLayout: true,
};

export const DefaultCircleGenerationParams: CircleGraphParams = {
    family: 'circle',
    nodeCount: 5,
    applyCircleLayout: true,
};

export const MinimumCircleGenerationParams: CircleGraphParams = {
    family: 'circle',
    nodeCount: 3, // Minimum to form a circle - C3
    applyCircleLayout: true,
};

export const DefaultStarGenerationParams: StarGraphParams = {
    family: 'star',
    nodeCount: 5,
    applyConcentricLayout: true,
};

export const MinimumStarGenerationParams: StarGraphParams = {
    family: 'star',
    nodeCount: 3, // Minimum to form a star - S3
    applyConcentricLayout: true,
};

export const DefaultWheelGenerationParams: WheelGraphParams = {
    family: 'wheel',
    nodeCount: 5,
    applyConcentricLayout: true,
};

export const MinimumWheelGenerationParams: WheelGraphParams = {
    family: 'wheel',
    nodeCount: 3, // Minimum to form a wheel - W3
    applyConcentricLayout: true,
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

export const DefaultSimpleGenerationParams: SimpleGraphParams = {
    family: 'simple',
    nodeCount: 5,
    edgeCount: 7,
    applyFcoseLayout: true,
};

export const MinimumSimpleGenerationParams: SimpleGraphParams = {
    family: 'simple',
    nodeCount: 1, // Minimum degree for a simple graph is 1 (a single edge)
    edgeCount: 0, // Minimum edges for a simple graph is 0 (no edges)
    applyFcoseLayout: true,
};
