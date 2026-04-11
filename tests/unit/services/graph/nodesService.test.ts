import { addEdge } from '@/services/graph/edgesService';
import { addGhostFromNode, addNode, cloneNode } from '@/services/graph/nodesService';
import cytoscape from 'cytoscape';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('nodesService', () => {
    let core: cytoscape.Core | null = null;

    beforeAll(() => {
        core = cytoscape({ headless: true, elements: [] });
    });

    beforeEach(() => {
        if (!core) {
            throw new Error('Cytoscape core is not initialized');
        }

        core.elements().remove();
    });

    it('should create one ghost edge per parallel incoming edge', () => {
        if (!core) {
            throw new Error('Cytoscape core is not initialized');
        }

        core.add([
            {
                group: 'nodes',
                data: { id: 'source', label: '1', index: 1 },
                position: { x: 0, y: 0 },
            },
            {
                group: 'nodes',
                data: { id: 'target', label: '2', index: 2 },
                position: { x: 100, y: 0 },
            },
        ]);

        addEdge(core, { data: { source: 'source', target: 'target' } });
        addEdge(core, { data: { source: 'source', target: 'target' } });

        addGhostFromNode(core, core.$id('target'));

        const ghostNodes = core.nodes('.ghost-element');
        expect(ghostNodes).toHaveLength(1);

        const ghostNode = ghostNodes[0];
        const ghostIncomingEdges = core.edges().filter((edge) => {
            return (
                edge.data('isGhost') === true &&
                edge.data('source') === 'source' &&
                edge.data('target') === ghostNode.id()
            );
        });

        expect(ghostIncomingEdges).toHaveLength(2);
    });

    it('should create one ghost edge per parallel outgoing edge', () => {
        if (!core) {
            throw new Error('Cytoscape core is not initialized');
        }

        core.add([
            {
                group: 'nodes',
                data: { id: 'source', label: '1', index: 1 },
                position: { x: 0, y: 0 },
            },
            {
                group: 'nodes',
                data: { id: 'target', label: '2', index: 2 },
                position: { x: 100, y: 0 },
            },
        ]);

        addEdge(core, { data: { source: 'source', target: 'target' } });
        addEdge(core, { data: { source: 'source', target: 'target' } });

        addGhostFromNode(core, core.$id('source'));

        const ghostNodes = core.nodes('.ghost-element');
        expect(ghostNodes).toHaveLength(1);

        const ghostNode = ghostNodes[0];
        const ghostOutgoingEdges = core.edges().filter((edge) => {
            return (
                edge.data('isGhost') === true &&
                edge.data('source') === ghostNode.id() &&
                edge.data('target') === 'target'
            );
        });

        expect(ghostOutgoingEdges).toHaveLength(2);
    });

    it('should clone a node with the same data and classes', () => {
        if (!core) {
            throw new Error('Cytoscape core is not initialized');
        }

        addNode(core, { data: { id: 'node1', label: 'Node 1' } }, [
            'class1',
            'class2',
        ]);

        const originalNode = core.$id('node1');
        const clonedNode = cloneNode(core, originalNode);

        expect(clonedNode).not.toBeNull();
        expect(clonedNode.data('label')).toBe('Node 1');
        expect(clonedNode.hasClass('class1')).toBe(true);
        expect(clonedNode.hasClass('class2')).toBe(true);
    });
});
