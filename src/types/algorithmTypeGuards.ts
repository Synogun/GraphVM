import type {
    BipartiteGraphParams,
    CageGraphParams,
    CircleGraphParams,
    CompleteBipartiteGraphParams,
    CompleteGraphParams,
    GenerationFamily,
    GenerationParams,
    GridGraphParams,
    StarGraphParams,
    WheelGraphParams,
} from './algorithms';

export const ValidGenerationFamilies: GenerationFamily[] = [
    'complete',
    'grid',
    'circle',
    'star',
    'wheel',
    // 'cayley',
    'bipartite',
    'complete-bipartite',
    'cage',
];

export function isGenerationFamily(value: unknown): value is GenerationFamily {
    return (
        typeof value === 'string' &&
        (ValidGenerationFamilies as string[]).includes(value)
    );
}

export function isCompleteGraphParams(
    params: GenerationParams
): params is CompleteGraphParams {
    return params.family === 'complete' && typeof params.nodeCount === 'number';
}

export function isGridGraphParams(
    params: GenerationParams
): params is GridGraphParams {
    return (
        params.family === 'grid' &&
        typeof params.rows === 'number' &&
        typeof params.cols === 'number'
    );
}

export function isCircleGraphParams(
    params: GenerationParams
): params is CircleGraphParams {
    return params.family === 'circle' && typeof params.nodeCount === 'number';
}

export function isStarGraphParams(
    params: GenerationParams
): params is StarGraphParams {
    return params.family === 'star' && typeof params.nodeCount === 'number';
}

export function isWheelGraphParams(
    params: GenerationParams
): params is WheelGraphParams {
    return params.family === 'wheel' && typeof params.nodeCount === 'number';
}

export function isBipartiteGraphParams(
    params: GenerationParams
): params is BipartiteGraphParams {
    return (
        params.family === 'bipartite' &&
        typeof params.setASize === 'number' &&
        typeof params.setBSize === 'number'
    );
}

export function isCompleteBipartiteGraphParams(
    params: GenerationParams
): params is CompleteBipartiteGraphParams {
    return (
        params.family === 'complete-bipartite' &&
        typeof params.setASize === 'number' &&
        typeof params.setBSize === 'number'
    );
}

export function isCageGraphParams(
    params: GenerationParams
): params is CageGraphParams {
    return (
        params.family === 'cage' &&
        typeof params.degree === 'number' &&
        typeof params.girth === 'number'
    );
}

// export function isCayleyGraphParams(
//     params: GenerationParams
// ): params is CayleyGraphParams {
//     return (
//         params.family === 'cayley' &&
//         typeof params.group === 'string' &&
//         Array.isArray(params.generators) &&
//         params.generators.every((gen) => typeof gen === 'string')
//     );
// }

export function isValidGenerationParams(params: GenerationParams): boolean {
    switch (params.family) {
        case 'complete':
            return isCompleteGraphParams(params);
        case 'grid':
            return isGridGraphParams(params);
        case 'circle':
            return isCircleGraphParams(params);
        case 'star':
            return isStarGraphParams(params);
        case 'wheel':
            return isWheelGraphParams(params);
        // case 'cayley':
        //     return isCayleyGraphParams(params);
        case 'bipartite':
            return isBipartiteGraphParams(params);
        case 'complete-bipartite':
            return isCompleteBipartiteGraphParams(params);
        case 'cage':
            return isCageGraphParams(params);
        default:
            return false;
    }
}
