import {
    makeCombinations,
    makeHlpEdgeSet,
    makeHlpGeneratingSet,
    makeHlpNodeSet,
} from '@/services/algorithms/generation/HlpPrimeGeneration';
import { generateHlpGraph } from '@/services/algorithms/generation/HlpPrimeGeneration/generateHlpGraph';
import cytoscape from 'cytoscape';
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
                // Compare only the first two elements (sourceIndex, targetIndex)
                // ignoring the generatorIndex which was added
                expect(hlpEdgeSet.map((e) => e.slice(0, 2))).toEqual(
                    expectedEdgeSet
                );
                // Verify generatorIndex is included for each edge
                expect(hlpEdgeSet.every((e) => e.length === 3)).toBe(true);
                expect(hlpEdgeSet.every((e) => typeof e[2] === 'number')).toBe(true);
            }
        }
    });

    it('stores coord and L and P on node metadata', () => {
        const core = cytoscape({ headless: true });
        generateHlpGraph(core, { family: 'hlp', L: 3, P: 3 });
        const meta = core.nodes().first().data('metadata') as {
            family: string;
            L: number;
            P: number;
            coord: number[];
        };
        expect(meta.L).toBe(3);
        expect(meta.P).toBe(3);
        expect(Array.isArray(meta.coord)).toBe(true);
    });

    it('stores generatorIndex on edge metadata', () => {
        const core = cytoscape({ headless: true });
        generateHlpGraph(core, { family: 'hlp', L: 3, P: 3 });
        const meta = core.edges().first().data('metadata') as {
            generatorIndex: number;
        };
        expect(typeof meta.generatorIndex).toBe('number');
    });
});
