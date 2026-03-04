import { ParsedError } from '@/config/parsedError';
import type { EdgesData } from '@/types/edges';
import {
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLineStyle,
} from '@/types/edgesTypeGuards';
import { getDefaultEdgesData } from '@/utils/styleHelpers';

export function makeEdgeId() {
    return crypto.randomUUID();
}

export function addEdge(
    core: cytoscape.Core,
    options: cytoscape.EdgeDefinition,
    classes?: string[]
) {
    if (!options.data.source) {
        throw new ParsedError('Source node is required');
    }
    if (!options.data.target) {
        throw new ParsedError('Target node is required');
    }

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

    const isDirected = Boolean(options.data.directed)
        ? Boolean(options.data.directed)
        : Boolean(core.data('directed'));

    if (isDirected) {
        core.$id(newId).addClass('directed');
    }
}

export function addEdges(
    core: cytoscape.Core,
    edges: string[],
    edgeMode: 'path' | 'complete' = 'path',
    data?: Partial<EdgesData>
) {
    if (edges.length < 2) {
        throw new ParsedError('At least two nodes are required to create edges');
    }

    if (edgeMode === 'path') {
        for (let i = 0; i < edges.length - 1; i++) {
            addEdge(core, {
                data: {
                    ...(data ?? {}),
                    source: edges[i],
                    target: edges[i + 1],
                },
            });
        }
    }

    if (edgeMode === 'complete') {
        for (let i = 0; i < edges.length; i++) {
            for (let j = 0; j < i; j++) {
                addEdge(core, {
                    data: {
                        ...(data ?? {}),
                        source: edges[i],
                        target: edges[j],
                    },
                });
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

        // this.removedEdges.push(edge);
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
            validate: (val: string | number) => !isNaN(Number(val)),
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
