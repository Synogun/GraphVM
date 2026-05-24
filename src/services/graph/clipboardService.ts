import type {
    ClipboardEdge,
    ClipboardNode,
    ClipboardPayload,
} from '@/types/clipboard';
import type { EdgesData } from '@/types/elements/edges';
import type { NodesData } from '@/types/elements/nodes';
import type { GraphLimits } from '@/types/ui/settings';
import type cytoscape from 'cytoscape';
import { addEdge, assertEdgeLimit } from './edgesService';
import { addNode, assertNodeLimit, makeNodeId } from './nodesService';

export function serializeSelection(
    core: cytoscape.Core,
    nodeIds: string[],
    edgeIds: string[]
): ClipboardPayload {
    const nodeIdSet = new Set(nodeIds);

    const nodes: ClipboardNode[] = nodeIds.map((id) => {
        const node = core.$id(id);
        return {
            data: node.data() as NodesData,
            position: { ...node.position() },
            classes: [...node.classes()],
        };
    });

    const edges: ClipboardEdge[] = edgeIds
        .filter((id) => {
            const edge = core.$id(id);
            const source = edge.data('source') as string;
            const target = edge.data('target') as string;
            return nodeIdSet.has(source) && nodeIdSet.has(target);
        })
        .map((id) => {
            const edge = core.$id(id);
            return {
                data: edge.data() as EdgesData,
                classes: [...edge.classes()],
            };
        });

    return { graphvm: true, version: 1, nodes, edges };
}

export function deserializeAndPaste(
    core: cytoscape.Core,
    payload: ClipboardPayload,
    limits?: GraphLimits
): void {
    if (payload.nodes.length === 0) return;

    assertNodeLimit(core.nodes().length, payload.nodes.length, limits);
    assertEdgeLimit(core.edges().length, payload.edges.length, limits);

    const idMap = new Map<string, string>();
    for (const node of payload.nodes) {
        idMap.set(node.data.id, makeNodeId());
    }

    const viewportCenter = {
        x: (core.width() / 2 - core.pan().x) / core.zoom(),
        y: (core.height() / 2 - core.pan().y) / core.zoom(),
    };

    const centroid = {
        x:
            payload.nodes.reduce((sum, n) => sum + n.position.x, 0) /
            payload.nodes.length,
        y:
            payload.nodes.reduce((sum, n) => sum + n.position.y, 0) /
            payload.nodes.length,
    };

    const offset = {
        x: viewportCenter.x - centroid.x,
        y: viewportCenter.y - centroid.y,
    };

    // Limits already checked above — pass undefined to skip inner checks
    for (const node of payload.nodes) {
        const newId = idMap.get(node.data.id);
        if (!newId) continue;
        addNode(
            core,
            {
                data: { ...node.data, id: newId },
                position: {
                    x: node.position.x + offset.x,
                    y: node.position.y + offset.y,
                },
            },
            node.classes
        );
    }

    for (const edge of payload.edges) {
        const newSource = idMap.get(edge.data.source);
        const newTarget = idMap.get(edge.data.target);
        if (!newSource || !newTarget) continue;

        // Omit original id and endpoints — addEdge generates new id, we supply remapped endpoints
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, source: _src, target: _tgt, ...restEdgeData } = edge.data;
        addEdge(
            core,
            { data: { ...restEdgeData, source: newSource, target: newTarget } },
            edge.classes
        );
    }
}
