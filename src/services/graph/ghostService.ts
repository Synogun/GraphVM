import { ParsedError, parseError } from '@/config/parsedError';
import { DefaultEdgesData } from '@/constants/graphDefaults';
import type { GraphLimits } from '@/types/ui/settings';
import { extractElementData } from '@/utils';
import type cytoscape from 'cytoscape';
import { addEdge, removeEdges } from './edgesService';
import { addNode, removeNodes } from './nodesService';

export function addGhost(
    core: cytoscape.Core,
    sourceNode: cytoscape.NodeSingular,
    limits?: GraphLimits
): cytoscape.NodeSingular {
    if (sourceNode.isEdge()) {
        throw new ParsedError('Ghost nodes can only be created from nodes.', {
            context: { elementId: sourceNode.id() },
        });
    }

    if (sourceNode.data('isGhost')) {
        throw new ParsedError(
            'Cannot create a ghost node from another ghost node.',
            { context: { elementId: sourceNode.id() } }
        );
    }

    const position = sourceNode.renderedPosition();
    const zoom = core.zoom();
    const pan = core.pan();
    const parsedNodeData = extractElementData(sourceNode);

    let ghostNode: cytoscape.NodeSingular;
    try {
        ghostNode = addNode(
            core,
            {
                position: {
                    x: (position.x - pan.x) / zoom + 25,
                    y: (position.y - pan.y) / zoom + 25,
                },
                data: {
                    ...parsedNodeData,
                    isGhost: true,
                    ghostOf: sourceNode.id(),
                },
            },
            [...sourceNode.classes()],
            limits
        );
    } catch (error: unknown) {
        throw new ParsedError('Failed to add ghost node.', {
            cause: parseError(error),
            context: { elementId: sourceNode.id() },
        });
    }

    const incomers = sourceNode.incomers('edge');
    const outgoers = sourceNode.outgoers('edge');

    try {
        for (const originalEdge of incomers.union(outgoers)) {
            const parsedEdgeData = extractElementData(originalEdge);

            const endpoints = outgoers.contains(originalEdge)
                ? { source: ghostNode.id(), target: originalEdge.target().id() }
                : { source: originalEdge.source().id(), target: ghostNode.id() };

            addEdge(
                core,
                {
                    data: {
                        ...parsedEdgeData,
                        ...endpoints,
                        isGhost: true,
                        ghostOf: originalEdge.id(),
                    },
                },
                [...originalEdge.classes()],
                limits
            );
        }
    } catch (error: unknown) {
        ghostNode.remove();
        throw new ParsedError('Failed to add ghost edges.', {
            cause: parseError(error),
            context: { elementId: sourceNode.id() },
        });
    }

    return core.$id(ghostNode.id());
}

export function removeGhost(
    _core: cytoscape.Core,
    ghostElement: cytoscape.NodeSingular | cytoscape.EdgeSingular
): void {
    if (!ghostElement.data('isGhost')) {
        throw new ParsedError('Element is not a ghost node.', {
            context: { elementId: ghostElement.id() },
        });
    }

    if (ghostElement.isNode()) {
        removeNodes(_core, ghostElement);
    } else {
        removeEdges(_core, ghostElement);
    }
}

export function removeAllGhosts(core: cytoscape.Core): void {
    core.nodes('[?isGhost]').remove();
}

export function getGhostsOf(
    core: cytoscape.Core,
    sourceNodeId: string
): cytoscape.NodeCollection {
    return core.nodes(`[ghostOf = "${sourceNodeId}"]`);
}

export function getAllGhosts(core: cytoscape.Core): cytoscape.NodeCollection {
    return core.nodes('[?isGhost]');
}

export function promoteGhost(
    _core: cytoscape.Core,
    ghostNode: cytoscape.NodeSingular
): void {
    if (!ghostNode.data('isGhost')) {
        throw new ParsedError('Element is not a ghost node.', {
            context: { elementId: ghostNode.id() },
        });
    }

    ghostNode.data('isGhost', false);
    ghostNode.removeData('ghostOf');
    ghostNode.removeClass('ghost-element');

    ghostNode.connectedEdges('[?isGhost]').forEach((edge) => {
        edge.data('isGhost', false);
        edge.removeData('ghostOf');
        edge.data('style', DefaultEdgesData.style);
        edge.removeClass('ghost-element');
    });
}
