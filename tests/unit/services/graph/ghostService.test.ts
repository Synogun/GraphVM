import { ParsedError } from '@/config/parsedError';
import { addEdge } from '@/services/graph/edgesService';
import {
    addGhost,
    getAllGhosts,
    getGhostsOf,
    promoteGhost,
    removeAllGhosts,
    removeGhost,
} from '@/services/graph/ghostService';
import { addNode } from '@/services/graph/nodesService';
import cytoscape from 'cytoscape';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ghostService', () => {
    let core: cytoscape.Core;

    beforeEach(() => {
        core = cytoscape({ headless: true, elements: [] });
    });

    describe('addGhost', () => {
        it('creates ghost node with isGhost true and ghostOf pointing to source', () => {
            addNode(core, { data: { id: 'source', label: 'A' } });

            const ghost = addGhost(core, core.$id('source'));

            expect(ghost.data('isGhost')).toBe(true);
            expect(ghost.data('ghostOf')).toBe('source');
            expect(ghost.hasClass('ghost-element')).toBe(true);
        });

        it('preserves source node custom data on the ghost', () => {
            addNode(core, { data: { id: 'source', label: 'A', color: '#ff0000' } });

            const ghost = addGhost(core, core.$id('source'));

            expect(ghost.data('color')).toBe('#ff0000');
            expect(ghost.data('label')).toBe('A');
        });

        it('creates isolated ghost node without edges when source has no neighbors', () => {
            addNode(core, { data: { id: 'solo', label: 'S' } });

            const ghost = addGhost(core, core.$id('solo'));

            expect(core.nodes()).toHaveLength(2);
            expect(core.edges()).toHaveLength(0);
            expect(ghost.data('isGhost')).toBe(true);
        });

        it('multiple ghosts of same node each have ghostOf pointing to same source', () => {
            addNode(core, { data: { id: 'origin', label: 'O' } });

            const ghost1 = addGhost(core, core.$id('origin'));
            const ghost2 = addGhost(core, core.$id('origin'));

            expect(ghost1.data('ghostOf')).toBe('origin');
            expect(ghost2.data('ghostOf')).toBe('origin');
            expect(ghost1.id()).not.toBe(ghost2.id());
        });

        it('creates ghost edge for each incoming edge with ghostOf pointing to original edge', () => {
            core.add([
                { group: 'nodes', data: { id: 'a', label: '1', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'b', label: '2', index: 2 }, position: { x: 100, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'a', target: 'b' } });
            const originalEdge = core.edges().first();

            const ghost = addGhost(core, core.$id('b'));

            const ghostEdges = ghost.connectedEdges('[?isGhost]');
            expect(ghostEdges).toHaveLength(1);
            expect(ghostEdges.first().data('ghostOf')).toBe(originalEdge.id());
            expect(ghostEdges.first().data('source')).toBe('a');
            expect(ghostEdges.first().data('target')).toBe(ghost.id());
        });

        it('creates ghost edge for each outgoing edge with ghostOf pointing to original edge', () => {
            core.add([
                { group: 'nodes', data: { id: 'a', label: '1', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'b', label: '2', index: 2 }, position: { x: 100, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'a', target: 'b' } });
            const originalEdge = core.edges().first();

            const ghost = addGhost(core, core.$id('a'));

            const ghostEdges = ghost.connectedEdges('[?isGhost]');
            expect(ghostEdges).toHaveLength(1);
            expect(ghostEdges.first().data('ghostOf')).toBe(originalEdge.id());
            expect(ghostEdges.first().data('source')).toBe(ghost.id());
            expect(ghostEdges.first().data('target')).toBe('b');
        });

        it('creates one ghost edge per parallel incoming edge', () => {
            core.add([
                { group: 'nodes', data: { id: 'a', label: '1', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'b', label: '2', index: 2 }, position: { x: 100, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'a', target: 'b' } });
            addEdge(core, { data: { source: 'a', target: 'b' } });

            const ghost = addGhost(core, core.$id('b'));

            expect(ghost.connectedEdges('[?isGhost]')).toHaveLength(2);
        });

        it('creates one ghost edge per parallel outgoing edge', () => {
            core.add([
                { group: 'nodes', data: { id: 'a', label: '1', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'b', label: '2', index: 2 }, position: { x: 100, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'a', target: 'b' } });
            addEdge(core, { data: { source: 'a', target: 'b' } });

            const ghost = addGhost(core, core.$id('a'));

            expect(ghost.connectedEdges('[?isGhost]')).toHaveLength(2);
        });

        it('throws when source is an edge', () => {
            core.add([
                { group: 'nodes', data: { id: 'a', label: '1', index: 1 } },
                { group: 'nodes', data: { id: 'b', label: '2', index: 2 } },
                { group: 'edges', data: { id: 'e1', source: 'a', target: 'b' } },
            ]);

            const edgeAsNode = core.$id('e1') as unknown as cytoscape.NodeSingular;
            expect(() => addGhost(core, edgeAsNode)).toThrow(ParsedError);
        });

        it('throws when source is a ghost node', () => {
            addNode(core, { data: { id: 'ghost', label: 'G', isGhost: true } });
            expect(() => addGhost(core, core.$id('ghost'))).toThrow(ParsedError);
        });
    });

    describe('removeGhost', () => {
        it('removes the ghost node', () => {
            addNode(core, { data: { id: 'real', label: 'R' } });
            const ghost = addGhost(core, core.$id('real'));

            removeGhost(core, ghost);

            expect(core.$id(ghost.id()).length).toBe(0);
            expect(core.nodes('[?isGhost]')).toHaveLength(0);
        });

        it('removes connected ghost edges when ghost node is removed', () => {
            core.add([
                { group: 'nodes', data: { id: 'real', label: 'R', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'other', label: 'O', index: 2 }, position: { x: 200, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'real', target: 'other' } });
            const ghost = addGhost(core, core.$id('real'));

            removeGhost(core, ghost);

            expect(core.edges('[?isGhost]')).toHaveLength(0);
            expect(core.edges()).toHaveLength(1); // real edge remains
        });

        it('does not remove real nodes or edges', () => {
            core.add([
                { group: 'nodes', data: { id: 'real', label: 'R', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'other', label: 'O', index: 2 }, position: { x: 200, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'real', target: 'other' } });
            const ghost = addGhost(core, core.$id('real'));

            removeGhost(core, ghost);

            expect(core.nodes()).toHaveLength(2);
            expect(core.edges()).toHaveLength(1);
        });

        it('throws when element is not a ghost node', () => {
            addNode(core, { data: { id: 'real', label: 'R' } });
            expect(() => removeGhost(core, core.$id('real'))).toThrow(ParsedError);
        });
    });

    describe('removeAllGhosts', () => {
        it('removes all ghost nodes and their connected edges', () => {
            core.add([
                { group: 'nodes', data: { id: 'real', label: 'R', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'other', label: 'O', index: 2 }, position: { x: 200, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'real', target: 'other' } });
            addGhost(core, core.$id('real'));
            addGhost(core, core.$id('real'));

            removeAllGhosts(core);

            expect(core.nodes('[?isGhost]')).toHaveLength(0);
            expect(core.edges('[?isGhost]')).toHaveLength(0);
            expect(core.nodes()).toHaveLength(2); // real nodes remain
            expect(core.edges()).toHaveLength(1); // real edge remains
        });

        it('is a no-op when no ghost nodes exist', () => {
            addNode(core, { data: { id: 'real', label: 'R' } });

            expect(() => removeAllGhosts(core)).not.toThrow();
            expect(core.nodes()).toHaveLength(1);
        });
    });

    describe('getGhostsOf', () => {
        it('returns all ghosts that track the given source node', () => {
            addNode(core, { data: { id: 'origin', label: 'O' } });
            addNode(core, { data: { id: 'other', label: 'X' } });
            const g1 = addGhost(core, core.$id('origin'));
            const g2 = addGhost(core, core.$id('origin'));
            addGhost(core, core.$id('other')); // different source — should not appear

            const ghosts = getGhostsOf(core, 'origin');

            expect(ghosts).toHaveLength(2);
            const ghostIds = ghosts.map((n) => n.id());
            expect(ghostIds).toContain(g1.id());
            expect(ghostIds).toContain(g2.id());
        });

        it('returns empty collection when no ghosts exist for the source', () => {
            addNode(core, { data: { id: 'origin', label: 'O' } });

            expect(getGhostsOf(core, 'origin')).toHaveLength(0);
        });
    });

    describe('getAllGhosts', () => {
        it('returns all ghost nodes in the graph', () => {
            addNode(core, { data: { id: 'real', label: 'R' } });
            addGhost(core, core.$id('real'));
            addGhost(core, core.$id('real'));

            expect(getAllGhosts(core)).toHaveLength(2);
        });

        it('returns empty collection when no ghost nodes exist', () => {
            addNode(core, { data: { id: 'real', label: 'R' } });

            expect(getAllGhosts(core)).toHaveLength(0);
        });
    });

    describe('promoteGhost', () => {
        it('clears ghost status and ghostOf from the node', () => {
            addNode(core, { data: { id: 'real', label: 'R' } });
            const ghost = addGhost(core, core.$id('real'));

            promoteGhost(core, ghost);

            expect(ghost.data('isGhost')).toBe(false);
            expect(ghost.data('ghostOf')).toBeUndefined();
            expect(ghost.hasClass('ghost-element')).toBe(false);
        });

        it('converts connected ghost edges to real edges', () => {
            core.add([
                { group: 'nodes', data: { id: 'real', label: 'R', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'other', label: 'O', index: 2 }, position: { x: 200, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'real', target: 'other' } });
            const ghost = addGhost(core, core.$id('real'));

            promoteGhost(core, ghost);

            const promotedEdge = ghost.connectedEdges().first();
            expect(promotedEdge.data('isGhost')).toBe(false);
            expect(promotedEdge.data('ghostOf')).toBeUndefined();
            expect(promotedEdge.hasClass('ghost-element')).toBe(false);
        });

        it('resets promoted ghost edge style to solid', () => {
            core.add([
                { group: 'nodes', data: { id: 'real', label: 'R', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'other', label: 'O', index: 2 }, position: { x: 200, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'real', target: 'other' } });
            const ghost = addGhost(core, core.$id('real'));

            promoteGhost(core, ghost);

            const promotedEdge = ghost.connectedEdges().first();
            expect(promotedEdge.data('style')).toBe('solid');
        });

        it('does not affect real nodes or edges', () => {
            core.add([
                { group: 'nodes', data: { id: 'real', label: 'R', index: 1 }, position: { x: 0, y: 0 } },
                { group: 'nodes', data: { id: 'other', label: 'O', index: 2 }, position: { x: 200, y: 0 } },
            ]);
            addEdge(core, { data: { source: 'real', target: 'other' } });
            const ghost = addGhost(core, core.$id('real'));

            promoteGhost(core, ghost);

            expect(core.nodes()).toHaveLength(3); // real, other, and promoted ghost
            expect(core.edges()).toHaveLength(2); // real edge + promoted edge
            expect(core.edges('[!isGhost]')).toHaveLength(2); // both are now real
        });

        it('throws when element is not a ghost node', () => {
            addNode(core, { data: { id: 'real', label: 'R' } });
            expect(() => promoteGhost(core, core.$id('real'))).toThrow(ParsedError);
        });

        it('promoted node is no longer returned by getGhostsOf', () => {
            addNode(core, { data: { id: 'origin', label: 'O' } });
            const ghost = addGhost(core, core.$id('origin'));

            promoteGhost(core, ghost);

            expect(getGhostsOf(core, 'origin')).toHaveLength(0);
            expect(getAllGhosts(core)).toHaveLength(0);
        });
    });
});
