import { ParsedError } from '@/config/parsedError';
import type { EdgesData } from '@/types/edges';
import {
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLineStyle,
} from '@/types/edgesTypeGuards';
import type { GraphLimits } from '@/types/settings';
import { getDefaultEdgesData } from '@/utils/styleHelpers';

export function makeEdgeId() {
    return crypto.randomUUID();
}

export function assertEdgeLimit(
    currentCount: number,
    edgesToAdd: number,
    limits?: GraphLimits
): void {
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
) {
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

    const newEdgeData = {
        ...defaultEdgesData,
        id: newId,
        index: newIdIndex,
        ...options.data,
    };

    core.add({
        group: 'edges',
        data: newEdgeData,
        classes: [...(classes ?? [])],
    });

    const isDirected = Boolean(options.data.directed ?? core.data('directed'));

    if (isDirected) {
        core.$id(newId).addClass('directed');
    }
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
    value: string | number
): void {
    if (edges.length === 0) {
        throw new ParsedError('Select at least one edge to update');
    }

    const defaultEdgesData = getDefaultEdgesData(core);
    const edgesCollection = core.edges().filter((e) => edges.includes(e.id()));

    const customValidation = [
        {
            property: 'weight',
            validate: (val: string | number) => !Number.isNaN(Number(val)),
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

    let parsedValue = value;
    if (customValidation.some((v) => v.property === property)) {
        const validator = customValidation.find((v) => v.property === property);

        if (!validator) {
            throw new ParsedError(`No validator found for property: ${property}`);
        }

        parsedValue = validator.validate(value) ? value : validator.default;
    }

    edgesCollection.data(property, parsedValue);
}
