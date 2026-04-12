import {
    makeCombinations,
    makeHlpEdgeSet,
    makeHlpGeneratingSet,
    makeHlpNodeSet,
} from '@/services/algorithms/HlpPrimeGeneration';
import { describe, expect, it } from 'vitest';
import { loadHlpValidation, sortByCoordinates } from './validation/utils';

describe('HlpPrimeGeneration', () => {
    it('should generate correct combinations', () => {
        for (let L = 3; L <= 5; L++) {
            const pLimit = L === 3 ? 20 : 5;
            for (let P = 3; P <= pLimit; P++) {
                const combinations = makeCombinations(L, 2).sort(sortByCoordinates);

                const expectedCombinations = loadHlpValidation(
                    'generating_set_combinations',
                    `H${L.toString()}_${P.toString()}`
                ).sort(sortByCoordinates);

                expect(combinations.length).toBe(expectedCombinations.length);
                expect(combinations).toEqual(expectedCombinations);
            }
        }
    });

    it('should generate correct generating set', () => {
        for (let L = 3; L <= 5; L++) {
            const pLimit = L === 3 ? 20 : 5;
            for (let P = 3; P <= pLimit; P++) {
                const hlpGeneratingSet =
                    makeHlpGeneratingSet(L).sort(sortByCoordinates);

                const expectedGeneratingSet = loadHlpValidation(
                    'generating_set',
                    `H${L.toString()}_${P.toString()}`
                ).sort(sortByCoordinates);

                expect(hlpGeneratingSet.length).toBe(expectedGeneratingSet.length);
                expect(hlpGeneratingSet).toEqual(expectedGeneratingSet);
            }
        }
    });

    it('should generate correct node set', () => {
        for (let L = 3; L <= 5; L++) {
            const pLimit = L === 3 ? 20 : 5;
            for (let P = 3; P <= pLimit; P++) {
                const hlpNodeSet = makeHlpNodeSet(L, P).sort(sortByCoordinates);

                const expectedNodeSet = loadHlpValidation(
                    'node_set',
                    `H${L.toString()}_${P.toString()}`
                ).sort(sortByCoordinates);

                expect(hlpNodeSet.length).toBe(expectedNodeSet.length);
                expect(hlpNodeSet).toEqual(expectedNodeSet);
            }
        }
    });

    it('should generate correct edge set', () => {
        for (let L = 3; L <= 5; L++) {
            const pLimit = L === 3 ? 20 : 5;
            for (let P = 3; P <= pLimit; P++) {
                const hlpNodeSet = makeHlpNodeSet(L, P).sort(sortByCoordinates);
                const hlpGeneratingSet =
                    makeHlpGeneratingSet(L).sort(sortByCoordinates);

                const hlpEdgeSet = makeHlpEdgeSet(
                    hlpNodeSet,
                    hlpGeneratingSet,
                    P
                ).sort(sortByCoordinates);

                const expectedEdgeSet = loadHlpValidation(
                    'edge_set',
                    `H${L.toString()}_${P.toString()}`
                ).sort(sortByCoordinates);

                expect(hlpEdgeSet.length).toBe(expectedEdgeSet.length);
                expect(hlpEdgeSet).toEqual(expectedEdgeSet);
            }
        }
    });
});
