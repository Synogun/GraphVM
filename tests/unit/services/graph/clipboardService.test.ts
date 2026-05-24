import {
    deserializeAndPaste,
    serializeSelection,
} from '@/services/graph/clipboardService';
import { addEdge } from '@/services/graph/edgesService';
import { addNode } from '@/services/graph/nodesService';
import cytoscape from 'cytoscape';
import { beforeEach, describe, expect, it } from 'vitest';

describe('clipboardService', () => {
    let core: cytoscape.Core;

    beforeEach(() => {
        core = cytoscape({ headless: true, elements: [] });
    });

    describe('serializeSelection', () => {
        it('returns a payload tagged with graphvm and version', () => {
            const n1 = addNode(core);
            const payload = serializeSelection(core, [n1.id()], []);
            expect(payload.graphvm).toBe(true);
            expect(payload.version).toBe(1);
        });

        it('serializes selected node data and model-space position', () => {
            const n1 = addNode(core, { data: {}, position: { x: 100, y: 200 } });
            const payload = serializeSelection(core, [n1.id()], []);
            expect(payload.nodes).toHaveLength(1);
            expect(payload.nodes[0].data.id).toBe(n1.id());
            expect(payload.nodes[0].position).toEqual({ x: 100, y: 200 });
        });

        it('includes edges when both endpoints are selected', () => {
            const n1 = addNode(core);
            const n2 = addNode(core);
            const e1 = addEdge(core, { data: { source: n1.id(), target: n2.id() } });
            const payload = serializeSelection(core, [n1.id(), n2.id()], [e1.id()]);
            expect(payload.edges).toHaveLength(1);
            expect(payload.edges[0].data.id).toBe(e1.id());
        });

        it('excludes edges when only one endpoint is selected', () => {
            const n1 = addNode(core);
            const n2 = addNode(core);
            const e1 = addEdge(core, { data: { source: n1.id(), target: n2.id() } });
            const payload = serializeSelection(core, [n1.id()], [e1.id()]);
            expect(payload.edges).toHaveLength(0);
        });

        it('includes ghost elements as-is', () => {
            const n1 = addNode(core, { data: { isGhost: true } });
            const payload = serializeSelection(core, [n1.id()], []);
            expect(payload.nodes[0].data.isGhost).toBe(true);
        });

        it('returns empty nodes and edges when called with empty ids', () => {
            const payload = serializeSelection(core, [], []);
            expect(payload.nodes).toHaveLength(0);
            expect(payload.edges).toHaveLength(0);
        });
    });

    describe('deserializeAndPaste', () => {
        it('adds pasted nodes with new IDs different from original', () => {
            const n1 = addNode(core, { data: {}, position: { x: 0, y: 0 } });
            const originalId = n1.id();
            const payload = serializeSelection(core, [originalId], []);
            core.remove(n1);

            deserializeAndPaste(core, payload);

            expect(core.nodes()).toHaveLength(1);
            expect(core.nodes()[0].id()).not.toBe(originalId);
        });

        it('remaps edge endpoints to the new node IDs', () => {
            const n1 = addNode(core, { data: {}, position: { x: 0, y: 0 } });
            const n2 = addNode(core, { data: {}, position: { x: 50, y: 0 } });
            const e1 = addEdge(core, { data: { source: n1.id(), target: n2.id() } });
            const oldN1Id = n1.id();
            const oldN2Id = n2.id();
            const payload = serializeSelection(core, [n1.id(), n2.id()], [e1.id()]);
            core.remove(core.elements());

            deserializeAndPaste(core, payload);

            expect(core.nodes()).toHaveLength(2);
            expect(core.edges()).toHaveLength(1);
            const pastedEdge = core.edges()[0];
            expect(pastedEdge.source().id()).not.toBe(oldN1Id);
            expect(pastedEdge.target().id()).not.toBe(oldN2Id);
            expect(core.hasElementWithId(pastedEdge.source().id())).toBe(true);
            expect(core.hasElementWithId(pastedEdge.target().id())).toBe(true);
        });

        it('offsets node positions so centroid lands at viewport center', () => {
            // Headless core: width=1, height=1, zoom=1, pan={x:0,y:0}
            // viewportCenter = {x:0.5, y:0.5}
            // centroid of single node at {x:100,y:80} = {x:100, y:80}
            // offset = {x:-99.5, y:-79.5}, pasted position = {x:0.5, y:0.5}

            const viewportCenterX = (core.width() / 2 - core.pan().x) / core.zoom();
            const viewportCenterY = (core.height() / 2 - core.pan().y) / core.zoom();
            const n1 = addNode(core, { data: {}, position: { x: 100, y: 80 } });
            const payload = serializeSelection(core, [n1.id()], []);
            core.remove(n1);

            deserializeAndPaste(core, payload);

            expect(core.nodes()[0].position().x).toBeCloseTo(viewportCenterX);
            expect(core.nodes()[0].position().y).toBeCloseTo(viewportCenterY);
        });

        it('preserves node data properties on paste', () => {
            const n1 = addNode(core, {
                data: { label: 'preserved', color: '#ff0000' },
                position: { x: 0, y: 0 },
            });
            const payload = serializeSelection(core, [n1.id()], []);
            core.remove(n1);

            deserializeAndPaste(core, payload);

            const pasted = core.nodes()[0];
            expect(pasted.data('label')).toBe('preserved');
            expect(pasted.data('color')).toBe('#ff0000');
        });

        it('throws when node limit would be exceeded', () => {
            const n1 = addNode(core, { data: {}, position: { x: 0, y: 0 } });
            const payload = serializeSelection(core, [n1.id()], []);

            expect(() => {
                deserializeAndPaste(core, payload, { maxNodes: 1, maxEdges: 1000 });
            }).toThrow();
        });

        it('does nothing when payload has no nodes', () => {
            deserializeAndPaste(core, {
                graphvm: true,
                version: 1,
                nodes: [],
                edges: [],
            });
            expect(core.nodes()).toHaveLength(0);
        });
    });
});
