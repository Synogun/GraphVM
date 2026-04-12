import { ParsedError } from '@/config/parsedError';
import { addEdge } from '@/services/graph/edgesService';
import {
    addGhostFromNode,
    addNode,
    addNodes,
    assertNodeLimit,
    cloneNode,
    makeNodeId,
    removeNodes,
    updateNodes,
} from '@/services/graph/nodesService';
import { getDefaultNodesData } from '@/utils/styleHelpers';
import cytoscape from 'cytoscape';
import { beforeEach, describe, expect, it } from 'vitest';

describe('nodesService', () => {
    let core: cytoscape.Core;

    beforeEach(() => {
        core = cytoscape({ headless: true, elements: [] });
    });

    describe('makeNodeId', () => {
        it('generates ids with the expected prefix', () => {
            const id = makeNodeId();

            expect(id).toMatch(/^n-[a-f0-9]+$/i);
        });

        it('generates different ids across calls', () => {
            const testPool = [];

            // Not 100% guaranteed but collision
            // its mostly impossible from common usage
            for (let i = 0; i < 1000; i++) {
                testPool.push(makeNodeId());
            }

            const uniqueIds = new Set(testPool);
            expect(uniqueIds.size).toBe(testPool.length);
        });
    });

    describe('assertNodeLimit', () => {
        it('does not throw when limits are not provided', () => {
            expect(() => {
                assertNodeLimit(2, 1);
            }).not.toThrow();
        });

        it('does not throw when the attempted count is within the limit', () => {
            const limits = { maxNodes: 3, maxEdges: 10 };

            expect(() => {
                assertNodeLimit(2, 1, limits);
            }).not.toThrow();
        });

        it('throws when the attempted count exceeds the limit', () => {
            const limits = { maxNodes: 2, maxEdges: 10 };

            expect(() => {
                assertNodeLimit(2, 1, limits);
            }).toThrow(ParsedError);
        });
    });

    describe('addNode', () => {
        it('adds a node with merged data and provided classes', () => {
            const node = addNode(
                core,
                {
                    data: {
                        id: 'node-1',
                        label: 'Node 1',
                        custom: 'value',
                    },
                    position: { x: 10, y: 20 },
                },
                ['class-a']
            );

            expect(core.nodes()).toHaveLength(1);
            expect(node.id()).toBe('node-1');
            expect(node.data('index')).toBe(1);
            expect(node.data('label')).toBe('Node 1');
            expect(node.data('custom')).toBe('value');
            expect(node.hasClass('class-a')).toBe(true);
        });

        it('automatically adds the ghost-element class for ghost nodes', () => {
            const ghostNode = addNode(
                core,
                {
                    data: {
                        id: 'ghost-node',
                        label: 'Ghost',
                        isGhost: true,
                    },
                },
                ['custom-class']
            );

            expect(ghostNode.data('isGhost')).toBe(true);
            expect(ghostNode.hasClass('custom-class')).toBe(true);
            expect(ghostNode.hasClass('ghost-element')).toBe(true);
        });

        it('enforces node limits', () => {
            const limits = { maxNodes: 0, maxEdges: 10 };

            expect(() => addNode(core, undefined, undefined, limits)).toThrow(
                ParsedError
            );
        });
    });

    describe('addNodes', () => {
        it('adds multiple nodes with computed indexes', () => {
            addNodes(
                core,
                [
                    {
                        data: { id: 'node-a', label: 'A' },
                        position: { x: 0, y: 0 },
                    },
                    {
                        data: { id: 'node-b', label: 'B', isGhost: true },
                        position: { x: 100, y: 0 },
                    },
                ],
                ['batch-class']
            );

            const firstNode = core.$id('node-a');
            const secondNode = core.$id('node-b');

            expect(core.nodes()).toHaveLength(2);
            expect(firstNode.data('index')).toBe(1);
            expect(secondNode.data('index')).toBe(2);
            expect(firstNode.hasClass('batch-class')).toBe(true);
            expect(secondNode.hasClass('batch-class')).toBe(true);
            expect(secondNode.hasClass('ghost-element')).toBe(true);
        });

        it('enforces node limits for batched additions', () => {
            const limits = { maxNodes: 1, maxEdges: 10 };

            expect(() => {
                addNodes(
                    core,
                    [
                        { data: { id: 'node-a', label: 'A' } },
                        { data: { id: 'node-b', label: 'B' } },
                    ],
                    undefined,
                    limits
                );
            }).toThrow(ParsedError);
        });
    });

    describe('removeNodes', () => {
        it('throws when no nodes are provided', () => {
            expect(() => {
                removeNodes(core, core.collection());
            }).toThrow(ParsedError);
        });

        it('removes nodes and their connected edges', () => {
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

            addEdge(core, {
                data: { id: 'edge-1', source: 'source', target: 'target' },
            });

            removeNodes(core, core.$('node#target'));

            expect(core.hasElementWithId('target')).toBe(false);
            expect(core.hasElementWithId('edge-1')).toBe(false);
            expect(core.nodes()).toHaveLength(1);
            expect(core.edges()).toHaveLength(0);
        });
    });

    describe('updateNodes', () => {
        it('throws when no node ids are provided', () => {
            expect(() => {
                updateNodes(core, [], 'label', 'Updated');
            }).toThrow(ParsedError);
        });

        it('updates only the targeted nodes', () => {
            addNode(core, { data: { id: 'node-a', label: 'A' } });
            addNode(core, { data: { id: 'node-b', label: 'B' } });

            updateNodes(core, ['node-a'], 'label', 'Updated A');

            expect(core.$id('node-a').data('label')).toBe('Updated A');
            expect(core.$id('node-b').data('label')).toBe('B');
        });

        it('falls back to the default shape when an invalid shape is provided', () => {
            const defaultShape = getDefaultNodesData(core).shape;

            addNode(core, { data: { id: 'node-a', label: 'A' } });

            updateNodes(core, ['node-a'], 'shape', 'not-a-valid-shape');

            expect(core.$id('node-a').data('shape')).toBe(defaultShape);
        });
    });

    describe('addGhostFromNode', () => {
        it('creates one ghost edge per parallel incoming edge', () => {
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

        it('creates one ghost edge per parallel outgoing edge', () => {
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

        it('creates an isolated ghost node without ghost edges when the node has no neighbors', () => {
            addNode(
                core,
                {
                    data: {
                        id: 'solo',
                        label: 'Solo',
                        custom: 'preserved',
                    },
                },
                ['original-class']
            );

            const ghostNode = addGhostFromNode(core, core.$id('solo'));

            expect(core.nodes()).toHaveLength(2);
            expect(core.edges()).toHaveLength(0);
            expect(ghostNode.data('isGhost')).toBe(true);
            expect(ghostNode.data('custom')).toBe('preserved');
            expect(ghostNode.hasClass('ghost-element')).toBe(true);
        });

        it('duplicates existing ghost edges when creating ghost connections', () => {
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
            addEdge(
                core,
                {
                    data: {
                        source: 'source',
                        target: 'target',
                        isGhost: true,
                    },
                },
                ['ghost-element']
            );

            const ghostNode = addGhostFromNode(core, core.$id('target'));

            const createdGhostEdges = core.edges().filter((edge) => {
                return (
                    edge.data('isGhost') === true &&
                    edge.data('source') === 'source' &&
                    edge.data('target') === ghostNode.id()
                );
            });

            expect(createdGhostEdges).toHaveLength(2);
        });

        it('throws when attempting to create a ghost node from an edge', () => {
            core.add([
                {
                    group: 'nodes',
                    data: { id: 'source', label: '1', index: 1 },
                },
                {
                    group: 'nodes',
                    data: { id: 'target', label: '2', index: 2 },
                },
                {
                    group: 'edges',
                    data: { id: 'edge-1', source: 'source', target: 'target' },
                },
            ]);

            const edgeAsNode = core.$id(
                'edge-1'
            ) as unknown as cytoscape.NodeSingular;

            expect(() => addGhostFromNode(core, edgeAsNode)).toThrow(ParsedError);
        });

        it('throws when attempting to create a ghost node from a ghost node', () => {
            addNode(core, {
                data: {
                    id: 'ghost-node',
                    label: 'Ghost',
                    isGhost: true,
                },
            });

            expect(() => addGhostFromNode(core, core.$id('ghost-node'))).toThrow(
                ParsedError
            );
        });
    });

    describe('cloneNode', () => {
        it('clones a node with the same data and classes', () => {
            addNode(core, { data: { id: 'node1', label: 'Node 1' } }, [
                'class1',
                'class2',
            ]);

            const originalNode = core.$id('node1');
            const clonedNode = cloneNode(core, originalNode);

            expect(clonedNode).not.toBeNull();
            expect(clonedNode.id()).not.toBe(originalNode.id());
            expect(clonedNode.data('label')).toBe('Node 1');
            expect(clonedNode.data('index')).toBe(2);
            expect(clonedNode.hasClass('class1')).toBe(true);
            expect(clonedNode.hasClass('class2')).toBe(true);
        });

        it('clones connected incoming and outgoing edges', () => {
            core.add([
                {
                    group: 'nodes',
                    data: { id: 'prev', label: '1', index: 1 },
                    position: { x: 0, y: 0 },
                },
                {
                    group: 'nodes',
                    data: { id: 'node1', label: '2', index: 2 },
                    position: { x: 100, y: 0 },
                },
                {
                    group: 'nodes',
                    data: { id: 'next', label: '3', index: 3 },
                    position: { x: 200, y: 0 },
                },
            ]);

            addEdge(core, { data: { source: 'prev', target: 'node1' } }, [
                'incoming-class',
            ]);
            addEdge(core, { data: { source: 'node1', target: 'next' } }, [
                'outgoing-class',
            ]);

            const clonedNode = cloneNode(core, core.$id('node1'));

            const clonedIncomingEdges = core.edges().filter((edge) => {
                return (
                    edge.source().id() === 'prev' &&
                    edge.target().id() === clonedNode.id() &&
                    edge.hasClass('incoming-class')
                );
            });

            const clonedOutgoingEdges = core.edges().filter((edge) => {
                return (
                    edge.source().id() === clonedNode.id() &&
                    edge.target().id() === 'next' &&
                    edge.hasClass('outgoing-class')
                );
            });

            expect(core.nodes()).toHaveLength(4);
            expect(core.edges()).toHaveLength(4);
            expect(clonedIncomingEdges).toHaveLength(1);
            expect(clonedOutgoingEdges).toHaveLength(1);
        });

        it('throws when attempting to clone an edge', () => {
            core.add([
                {
                    group: 'nodes',
                    data: { id: 'source', label: '1', index: 1 },
                },
                {
                    group: 'nodes',
                    data: { id: 'target', label: '2', index: 2 },
                },
                {
                    group: 'edges',
                    data: { id: 'edge-1', source: 'source', target: 'target' },
                },
            ]);

            const edgeAsNode = core.$id(
                'edge-1'
            ) as unknown as cytoscape.NodeSingular;

            expect(() => cloneNode(core, edgeAsNode)).toThrow(ParsedError);
        });
    });
});
