import { ParsedError, parseError } from '@/config/parsedError';
import { isDefaultNodeData, isNodeShape } from '@/types/nodesTypeGuards';
import type { GraphLimits } from '@/types/settings';
import { getDefaultNodesData } from '@/utils/styleHelpers';
import type cytoscape from 'cytoscape';
import { addEdge, removeEdges } from './edgesService';

export function makeNodeId() {
    return `n-` + crypto.randomUUID().split('-')[0];
}

export function assertNodeLimit(
    currentCount: number,
    nodesToAdd: number,
    limits?: GraphLimits
) {
    if (!limits) {
        return;
    }

    const attempted = currentCount + nodesToAdd;

    if (attempted > limits.maxNodes) {
        throw new ParsedError(
            `Node limit exceeded. Maximum allowed is ${limits.maxNodes.toString()}.\n` +
                'You can change this in Settings > Graph Limits.',
            {
                context: {
                    limit: limits.maxNodes,
                    attempted,
                    current: currentCount,
                    adding: nodesToAdd,
                },
            }
        );
    }
}

export function addNode(
    core: cytoscape.Core,
    options?: cytoscape.NodeDefinition,
    classes?: string[],
    limits?: GraphLimits
): cytoscape.NodeSingular {
    assertNodeLimit(core.nodes().length, 1, limits);

    const defaultNodesData = getDefaultNodesData(core);
    const newIdIndex = core.nodes().length + 1;
    const newId = makeNodeId();

    const newNodeData = {
        ...defaultNodesData,
        id: newId,
        index: newIdIndex,
        label: newIdIndex.toString(),
        ...options?.data,
    };
    const newNodeClasses = [...(classes ?? [])];

    if (newNodeData.isGhost) {
        newNodeClasses.push('ghost-element');
    }

    const newNodeDefinition: cytoscape.NodeDefinition = {
        ...options,
        data: newNodeData,
        classes: newNodeClasses,
    };

    core.add(newNodeDefinition);

    return core.$id(newId);
}

export function addNodes(
    core: cytoscape.Core,
    nodesData: cytoscape.NodeDefinition[],
    classes?: string[],
    limits?: GraphLimits
) {
    assertNodeLimit(core.nodes().length, nodesData.length, limits);

    const defaultNodesData = getDefaultNodesData(core);
    const numNodes = core.nodes().length;

    const newNodes = nodesData.map((nodeData, index) => {
        const newIdIndex = numNodes + index + 1;
        const newId = makeNodeId();
        const newNodeClasses = [...(classes ?? [])];

        if (nodeData.data.isGhost) {
            newNodeClasses.push('ghost-element');
        }

        return {
            ...nodeData,
            classes: newNodeClasses,
            data: {
                ...defaultNodesData,
                id: newId,
                index: newIdIndex,
                label: newIdIndex.toString(),
                ...nodeData.data,
            },
        };
    });

    core.add(newNodes);
}

export function removeNodes(core: cytoscape.Core, nodes: cytoscape.NodeCollection) {
    if (nodes.length === 0) {
        throw new ParsedError('Select at least one node to remove.');
    }

    nodes.forEach((node) => {
        if (!core.hasElementWithId(node.id())) {
            throw new ParsedError('Node not found in graph', {
                context: { nodeId: node.id() },
            });
        }
        const nodeEdges = node.connectedEdges();
        if (nodeEdges.length > 0) {
            removeEdges(core, nodeEdges);
        }

        // this.removedNodes.push(node);
        core.remove(node);
    });
}

export function updateNodes(
    core: cytoscape.Core,
    nodes: string[],
    property: string,
    value: string | number | boolean
) {
    if (nodes.length === 0) {
        throw new ParsedError('Select at least one node to update.');
    }

    const defaultNodesData = getDefaultNodesData(core);
    const nodesCollection = core.nodes().filter((n) => nodes.includes(n.id()));

    const customValidation = [
        {
            property: 'shape',
            validate: isNodeShape,
            default: defaultNodesData.shape,
        },
    ];

    let parsedValue = value;
    if (customValidation.some((v) => v.property === property)) {
        const validator = customValidation.find((v) => v.property === property);

        if (!validator) {
            throw new ParsedError('No validator found for property:', {
                context: { property },
            });
        }

        parsedValue = validator.validate(value) ? value : validator.default;
    }

    nodesCollection.data(property, parsedValue);
}

export function addGhostFromNode(
    core: cytoscape.Core,
    element: cytoscape.NodeSingular,
    limits?: GraphLimits
) {
    if (element.isEdge()) {
        throw new ParsedError('Ghost nodes can only be created from nodes.', {
            context: { elementId: element.id() },
        });
    }

    if (element.data('isGhost')) {
        throw new ParsedError(
            'Cannot create a ghost node from another ghost node.',
            {
                context: { elementId: element.id() },
            }
        );
    }

    assertNodeLimit(core.nodes().length, 1, limits);

    const position = element.renderedPosition();

    const zoom = core.zoom();
    const pan = core.pan();

    const rawElementData: unknown = { ...element.data() };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...elementData } = isDefaultNodeData(rawElementData)
        ? rawElementData
        : {};

    const newNodeOptions: cytoscape.NodeDefinition = {
        position: {
            x: (position.x - pan.x) / zoom + 25, // Offset to avoid exact overlap
            y: (position.y - pan.y) / zoom + 25, // Offset to avoid exact overlap
        },
        data: {
            ...elementData,
            isGhost: true,
        },
    };

    let newNode: cytoscape.NodeSingular;
    try {
        newNode = addNode(core, newNodeOptions, ['ghost-element']);
    } catch (error: unknown) {
        const parsedError = parseError(error);
        throw new ParsedError('Failed to add ghost node.', {
            cause: parsedError,
            context: { elementId: element.id() },
        });
    }

    // No edges to connect, return early
    if (element.neighborhood().length === 0) {
        return;
    }

    const newEdgeData = {
        isGhost: true,
        style: 'dashed',
    };

    const incomers = element.incomers('edge');
    const outgoers = element.outgoers('edge');

    try {
        for (const edge of incomers.union(outgoers)) {
            if (edge.data('isGhost')) {
                continue;
                // TODO DECIDE: Allow with a setting?
            }

            const destiny = {
                source: edge.source().id(),
                target: newNode.id(),
            };

            if (outgoers.contains(edge)) {
                destiny.source = newNode.id();
                destiny.target = edge.target().id();
            }

            addEdge(
                core,
                { data: { ...newEdgeData, ...destiny } },
                ['ghost-element'],
                limits
            );
        }
    } catch (error: unknown) {
        const parsedError = parseError(error);
        newNode.remove();

        throw new ParsedError('Failed to add ghost edges.', {
            cause: parsedError,
            context: { elementId: element.id() },
        });
    }
}
