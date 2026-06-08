import { runDFSAnimation } from '@/services/algorithms/traversal';
import cytoscape from 'cytoscape';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('runDFSAnimation', () => {
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

    it('returns algorithm "dfs"', () => {
        const result = runDFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        expect(result.algorithm).toBe('dfs');
    });

    it('first step is push of start node', () => {
        const result = runDFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        expect(result.steps[0].operation).toBe('push');
        expect(result.steps[0].nodeId).toBe('a');
    });

    it('visits all nodes in a linear graph', () => {
        const result = runDFSAnimation({
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

    it('steps use push/pop operations (not enqueue/dequeue)', () => {
        const result = runDFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        const ops = result.steps.map((s) => s.operation);
        expect(ops).toContain('push');
        expect(ops).toContain('pop');
        expect(ops).not.toContain('enqueue');
        expect(ops).not.toContain('dequeue');
    });

    it('assigns depth values to all visited nodes', () => {
        const result = runDFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        const last = result.steps.at(-1);
        expect(last?.metrics.depth.a).toBe(0);
        expect(typeof last?.metrics.depth.b).toBe('number');
        expect(typeof last?.metrics.depth.c).toBe('number');
    });

    it('throws when start node does not exist', () => {
        expect(() =>
            runDFSAnimation({
                graph: core,
                startNodeId: 'nonexistent',
                directed: false,
                onlySelected: false,
            })
        ).toThrow();
    });

    it('stores serializable params', () => {
        const result = runDFSAnimation({
            graph: core,
            startNodeId: 'a',
            directed: false,
            onlySelected: false,
        });
        expect(typeof JSON.stringify(result.params)).toBe('string');
        expect(result.params.graphNodeIds).toBeInstanceOf(Array);
        expect(result.params.graphNodeIds).toContain('a');
        expect(result.params.graphNodeIds).toContain('b');
        expect(result.params.graphNodeIds).toContain('c');
    });

    it('directed DFS only follows outgoing edges', () => {
        const result = runDFSAnimation({
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
        core.$id('a').select();
        core.$id('b').select();
        const result = runDFSAnimation({
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
        expect(() =>
            runDFSAnimation({
                graph: core,
                startNodeId: 'a',
                directed: false,
                onlySelected: true,
            })
        ).toThrow();
    });
});
