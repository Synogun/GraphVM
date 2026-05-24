import { ParsedError } from '@/config/parsedError';
import { DefaultGhostEdgeData } from '@/constants/graphDefaults';
import type { EdgesData } from '@/types/elements/edges';
import {
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLabelStyle,
    isEdgeLineStyle,
} from '@/types/elements/edges/typeGuards';
import type { GraphLimits } from '@/types/ui/settings';
import { getDefaultEdgesData } from '@/utils/styleHelpers';

export function makeEdgeId() {
    return `e-` + crypto.randomUUID().split('-')[0]; // Shorten UUID for better readability
}

export function assertEdgeLimit(
    currentCount: number,
    edgesToAdd: number,
    limits?: GraphLimits
) {
    if (!limits) {
        return;
    }

    const attempted = currentCount + edgesToAdd;

    if (attempted > limits.maxEdges) {
        throw new ParsedError(
            `Edge limit exceeded. Maximum allowed is ${limits.maxEdges.toString()}. You can change this in Settings > Graph Limits.`,
            {
                context: {
                    limit: limits.maxEdges,
                    attempted,
                    current: currentCount,
                    adding: edgesToAdd,
                },
            }
        );
    }
}

function countEdgesToAdd(nodeIds: string[], edgeMode: 'path' | 'complete'): number {
    if (edgeMode === 'path') {
        return Math.max(0, nodeIds.length - 1);
    }

    return (nodeIds.length * (nodeIds.length - 1)) / 2;
}

export function addEdge(
    core: cytoscape.Core,
    options: cytoscape.EdgeDefinition,
    classes?: string[],
    limits?: GraphLimits
): cytoscape.EdgeSingular {
    if (!options.data.source) {
        throw new ParsedError('Source node is required');
    }
    if (!options.data.target) {
        throw new ParsedError('Target node is required');
    }

    assertEdgeLimit(core.edges().length, 1, limits);

    const defaultEdgesData = getDefaultEdgesData(core);
    const newIdIndex = core.edges().length + 1;
    const newId = makeEdgeId();

    let newEdgeData = {
        ...defaultEdgesData,
        id: newId,
        ...options.data,
        index: newIdIndex,
    };
    const newEdgeClasses = [...(classes ?? [])];

    if (
        options.data.isGhost ||
        core.$id(options.data.source).data('isGhost') ||
        core.$id(options.data.target).data('isGhost')
    ) {
        newEdgeData = {
            ...newEdgeData,
            ...DefaultGhostEdgeData,
        };
        newEdgeClasses.push('ghost-element');
    }

    core.add({
        group: 'edges',
        data: newEdgeData,
        classes: newEdgeClasses,
    });

    const isDirected = Boolean(options.data.directed ?? core.data('directed'));
    const insertedEdgeId = newEdgeData.id;

    if (isDirected) {
        core.$id(insertedEdgeId).addClass('directed');
    }

    return core.$id(insertedEdgeId);
}

export function addEdges(
    core: cytoscape.Core,
    edges: string[],
    edgeMode: 'path' | 'complete' = 'path',
    data?: Partial<EdgesData>,
    limits?: GraphLimits
) {
    if (edges.length < 2) {
        throw new ParsedError('At least two nodes are required to create edges');
    }

    assertEdgeLimit(core.edges().length, countEdgesToAdd(edges, edgeMode), limits);

    if (edgeMode === 'path') {
        for (let i = 0; i < edges.length - 1; i++) {
            addEdge(
                core,
                {
                    data: {
                        ...data,
                        source: edges[i],
                        target: edges[i + 1],
                    },
                },
                undefined,
                limits
            );
        }
    }

    if (edgeMode === 'complete') {
        for (let i = 0; i < edges.length; i++) {
            for (let j = 0; j < i; j++) {
                addEdge(
                    core,
                    {
                        data: {
                            ...data,
                            source: edges[i],
                            target: edges[j],
                        },
                    },
                    undefined,
                    limits
                );
            }
        }
    }
}

export function removeEdges(core: cytoscape.Core, edges: cytoscape.EdgeCollection) {
    if (edges.length === 0) {
        throw new ParsedError('Select at least one edge to remove');
    }

    edges.forEach((edge) => {
        if (!core.hasElementWithId(edge.id())) {
            throw new ParsedError(`Edge with id ${edge.id()} not found in graph`);
        }

        core.remove(edge);
    });
}

export function updateEdges(
    core: cytoscape.Core,
    edges: string[],
    property: string,
    value: string | number | boolean
) {
    if (edges.length === 0) {
        throw new ParsedError('Select at least one edge to update');
    }

    const defaultEdgesData = getDefaultEdgesData(core);
    let edgesCollection = core.edges().filter((e) => edges.includes(e.id()));

    const customValidation = [
        {
            property: 'labelStyle',
            validate: isEdgeLabelStyle,
            default: defaultEdgesData.labelStyle,
        },
        {
            property: 'label',
            validate: (val: unknown) => val,
            default: defaultEdgesData.label,
        },
        {
            property: 'weight',
            validate: (val: unknown) =>
                !Number.isNaN(Number(val)) && Number(val) >= 0,
            default: defaultEdgesData.weight,
        },
        {
            property: 'style',
            validate: isEdgeLineStyle,
            default: defaultEdgesData.style,
        },
        {
            property: 'curve',
            validate: isEdgeCurve,
            default: defaultEdgesData.curve,
        },
        {
            property: 'arrowShape',
            validate: isEdgeArrowShape,
            default: defaultEdgesData.arrowShape,
        },
    ];

    const validator = customValidation.find((v) => v.property === property);

    if (!validator) {
        throw new ParsedError(`No validator found for property: ${property}`);
    }

    const parsedValue = validator.validate(value) ? value : validator.default;

    if (property === 'style') {
        // Ghost Nodes can't change line style, in order to keep visual distinction
        edgesCollection = edgesCollection.filter((e) => !e.data('isGhost'));
    }

    if (property === 'labelStyle') {
        if (parsedValue === 'hidden') {
            edgesCollection.data('label', '');
        } else if (parsedValue === 'weight') {
            edgesCollection.forEach((edge) => {
                edge.data('label', String(edge.data('weight')));
            });
        } else if (parsedValue === 'index') {
            edgesCollection.forEach((edge) => {
                edge.data('label', String(edge.data('index')));
            });
        } else if (parsedValue === 'custom') {
            /* Since the label already exists, no need to re-set it */
        }
    }

    edgesCollection.data(property, parsedValue);
}
