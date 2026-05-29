import cytoscape from 'cytoscape';
import { describe, expect, it } from 'vitest';
import { runHlpEdgeColoringAnimation } from '@/services/algorithms/coloring/hlpEdgeColoringService';
import { generateHlpGraph } from '@/services/algorithms/generation/HlpPrimeGeneration';

function assertValidColoring(core: cytoscape.Core, assignments: Record<string, number>): void {
    core.nodes().forEach((node) => {
        const colors = node
            .connectedEdges('[!isGhost]')
            .map((e) => assignments[e.id()])
            .filter((c) => c !== undefined);
        expect(new Set(colors).size).toBe(colors.length);
    });
}

describe('runHlpEdgeColoringAnimation', () => {
    it('throws ParsedError for non-HLP graph', () => {
        const core = cytoscape({
            headless: true,
            elements: [{ data: { id: 'a' } }],
        });
        expect(() =>
            runHlpEdgeColoringAnimation(core, { algorithm: 'hlp-edge-coloring' })
        ).toThrow('not an HLP graph');
        core.destroy();
    });

    it('returns algorithm hlp-edge-coloring', () => {
        const core = cytoscape({ headless: true });
        generateHlpGraph(core, { family: 'hlp', L: 3, P: 3 });
        const result = runHlpEdgeColoringAnimation(core, { algorithm: 'hlp-edge-coloring' });
        expect(result.algorithm).toBe('hlp-edge-coloring');
        core.destroy();
    });

    it('produces valid coloring for odd P (L=3, P=3)', () => {
        const core = cytoscape({ headless: true });
        generateHlpGraph(core, { family: 'hlp', L: 3, P: 3 });
        const result = runHlpEdgeColoringAnimation(core, { algorithm: 'hlp-edge-coloring' });
        const assignments = result.steps.at(-1)?.colorAssignments ?? {};
        assertValidColoring(core, assignments);
        core.destroy();
    });

    it('odd P steps include build-fan operations', () => {
        const core = cytoscape({ headless: true });
        generateHlpGraph(core, { family: 'hlp', L: 3, P: 3 });
        const result = runHlpEdgeColoringAnimation(core, { algorithm: 'hlp-edge-coloring' });
        const ops = new Set(result.steps.map((s) => s.operation));
        expect(ops.has('build-fan')).toBe(true);
        core.destroy();
    });

    it('produces valid coloring for even P (L=3, P=4)', () => {
        const core = cytoscape({ headless: true });
        generateHlpGraph(core, { family: 'hlp', L: 3, P: 4 });
        const result = runHlpEdgeColoringAnimation(core, { algorithm: 'hlp-edge-coloring' });
        const assignments = result.steps.at(-1)?.colorAssignments ?? {};
        assertValidColoring(core, assignments);
        core.destroy();
    });

    it('even P steps are only color-edge operations', () => {
        const core = cytoscape({ headless: true });
        generateHlpGraph(core, { family: 'hlp', L: 3, P: 4 });
        const result = runHlpEdgeColoringAnimation(core, { algorithm: 'hlp-edge-coloring' });
        const ops = new Set(result.steps.map((s) => s.operation));
        expect(ops.has('build-fan')).toBe(false);
        expect(ops.has('color-edge')).toBe(true);
        core.destroy();
    });
});
