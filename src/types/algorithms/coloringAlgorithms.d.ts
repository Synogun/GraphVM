export type ColoringAlgorithm = 'misra-gries' | 'hlp-edge-coloring';

export type MisraGriesParams = {
    algorithm: 'misra-gries';
};

export type HlpEdgeColoringParams = {
    algorithm: 'hlp-edge-coloring';
};

export type ColoringParams = MisraGriesParams | HlpEdgeColoringParams;

export type EdgeColoringStep = {
    operation: 'build-fan' | 'flip-path' | 'rotate-fan' | 'color-edge';
    edgeId: string;
    fanVertexIds: readonly string[];
    pathEdgeIds: readonly string[];
    colorAssignments: Record<string, number>; // edgeId → 0-indexed palette index, cumulative
};

export type EdgeColoringAnimation = {
    algorithm: ColoringAlgorithm;
    params: ColoringParams;
    palette: readonly string[];
    steps: readonly EdgeColoringStep[];
};
