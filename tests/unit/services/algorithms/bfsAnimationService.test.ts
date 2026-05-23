import cytoscape from 'cytoscape';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runBFSAnimation } from '@/services/algorithms/bfsAnimationService';

describe('runBFSAnimation', () => {
    let core: cytoscape.Core;

    beforeEach(() => {
        core = cytoscape({
            headless: true,
            elements: {
                nodes: [
                    { data: { id: 'a', isGhost: false } },
                    { data: { id: 'b', isGhost: false } },
                    { data: { id: 'c', isGhost: false } },
                ],
                edges: [
                    { data: { id: 'e1', source: 'a', target: 'b', isGhost: false } },
                    { data: { id: 'e2', source: 'b', target: 'c', isGhost: false } },
                ],
            },
        });
    });

    afterEach(() => {
        core.destroy();
    });

    it('returns algorithm "bfs"', () => {
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        expect(result.algorithm).toBe('bfs');
    });

    it('first step is enqueue of start node', () => {
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        expect(result.steps[0].operation).toBe('enqueue');
        expect(result.steps[0].nodeId).toBe('a');
    });

    it('visits all nodes in a linear graph', () => {
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        const visitedIds = result.steps
            .filter((s) => s.operation === 'visit')
            .map((s) => s.nodeId);
        expect(visitedIds).toContain('a');
        expect(visitedIds).toContain('b');
        expect(visitedIds).toContain('c');
    });

    it('steps contain full array snapshots, not references', () => {
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        const step0 = result.steps[0];
        expect(Array.isArray(step0.frontier)).toBe(true);
        expect(Array.isArray(step0.visited)).toBe(true);
    });

    it('assigns correct BFS depths', () => {
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        const last = result.steps[result.steps.length - 1];
        expect(last.metrics.depth.a).toBe(0);
        expect(last.metrics.depth.b).toBe(1);
        expect(last.metrics.depth.c).toBe(2);
    });

    it('throws when start node does not exist', () => {
        expect(() =>
            runBFSAnimation({
                graph: core,
                startNodeId: 'nonexistent',
                directed: false,
                onlySelected: false,
            })
        ).toThrow();
    });

    it('stores serializable params (no live cy objects)', () => {
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        expect(result.params.graphNodeIds).toBeInstanceOf(Array);
        expect(typeof JSON.stringify(result.params)).toBe('string');
    });

    it('directed BFS only follows outgoing edges', () => {
        // c is only reachable backward from a→b→c; starting at c directed should not reach a or b
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'c',
            directed: true,
            onlySelected: false,
        });
        const visitedIds = result.steps
            .filter((s) => s.operation === 'visit')
            .map((s) => s.nodeId);
        expect(visitedIds).toContain('c');
        expect(visitedIds).not.toContain('a');
        expect(visitedIds).not.toContain('b');
    });

    it('onlySelected only traverses selected nodes', () => {
        // Select only nodes a and b (not c)
        core.$id('a').select();
        core.$id('b').select();
        const result = runBFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: true,
        });
        const visitedIds = result.steps
            .filter((s) => s.operation === 'visit')
            .map((s) => s.nodeId);
        expect(visitedIds).toContain('a');
        expect(visitedIds).toContain('b');
        expect(visitedIds).not.toContain('c');
    });

    it('throws when onlySelected is true and start node is not selected', () => {
        // Do not select any nodes
        expect(() =>
            runBFSAnimation({
                graph: core,
                startNodeId: 'a',
                directed: false,
                onlySelected: true,
            })
        ).toThrow();
    });
});
