import { describe, it, expect } from 'vitest';
import cytoscape from 'cytoscape';
import { runMisraGriesAnimation } from '@/services/algorithms/coloring/misraGriesService';

function buildK4(): cytoscape.Core {
    return cytoscape({
        headless: true,
        elements: {
            nodes: [
                { data: { id: 'a' } },
                { data: { id: 'b' } },
                { data: { id: 'c' } },
                { data: { id: 'd' } },
            ],
            edges: [
                { data: { id: 'ab', source: 'a', target: 'b' } },
                { data: { id: 'ac', source: 'a', target: 'c' } },
                { data: { id: 'ad', source: 'a', target: 'd' } },
                { data: { id: 'bc', source: 'b', target: 'c' } },
                { data: { id: 'bd', source: 'b', target: 'd' } },
                { data: { id: 'cd', source: 'c', target: 'd' } },
            ],
        },
    });
}

function assertValidColoring(core: cytoscape.Core, assignments: Record<string, number>): void {
    core.nodes().forEach((node) => {
        const colors = node.connectedEdges().map((e) => assignments[e.id()]).filter((c) => c !== undefined);
        expect(new Set(colors).size).toBe(colors.length); // no duplicate colors at any vertex
    });
}

describe('runMisraGriesAnimation', () => {
    it('returns algorithm misra-gries', () => {
        const core = buildK4();
        const result = runMisraGriesAnimation(core, { algorithm: 'misra-gries' });
        expect(result.algorithm).toBe('misra-gries');
        core.destroy();
    });

    it('produces valid edge coloring — no two incident edges share a color', () => {
        const core = buildK4();
        const result = runMisraGriesAnimation(core, { algorithm: 'misra-gries' });
        const assignments = result.steps.at(-1)?.colorAssignments ?? {};
        assertValidColoring(core, assignments);
        core.destroy();
    });

    it('uses at most maxDegree+1 colors (palette size)', () => {
        const core = buildK4(); // max degree = 3 → palette size = 4
        const result = runMisraGriesAnimation(core, { algorithm: 'misra-gries' });
        expect(result.palette.length).toBe(4); // maxDegree + 1
        core.destroy();
    });

    it('last step colorAssignments covers all edges', () => {
        const core = buildK4();
        const result = runMisraGriesAnimation(core, { algorithm: 'misra-gries' });
        const assignments = result.steps.at(-1)?.colorAssignments ?? {};
        const edgeCount = core.edges().length;
        expect(Object.keys(assignments).length).toBe(edgeCount);
        core.destroy();
    });

    it('steps include build-fan and color-edge operations', () => {
        const core = buildK4();
        const result = runMisraGriesAnimation(core, { algorithm: 'misra-gries' });
        const ops = new Set(result.steps.map((s) => s.operation));
        expect(ops.has('build-fan')).toBe(true);
        expect(ops.has('color-edge')).toBe(true);
        core.destroy();
    });

    it('colorAssignments in each step are cumulative snapshots', () => {
        const core = buildK4();
        const result = runMisraGriesAnimation(core, { algorithm: 'misra-gries' });
        // Each color-edge step should have one more assignment than the previous color-edge step
        const colorEdgeSteps = result.steps.filter((s) => s.operation === 'color-edge');
        for (let i = 1; i < colorEdgeSteps.length; i++) {
            expect(Object.keys(colorEdgeSteps[i].colorAssignments).length)
                .toBeGreaterThan(Object.keys(colorEdgeSteps[i - 1].colorAssignments).length);
        }
        core.destroy();
    });
});
