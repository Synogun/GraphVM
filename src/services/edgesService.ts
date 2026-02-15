import type { EdgesData } from '@/types/edges';
import {
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLineStyle,
} from '@/types/edgesTypeGuards';
import { getDefaultEdgesData } from '@/utils/styleHelpers';
import { Logger } from '@Logger';

const logger = Logger.createContextLogger('EdgesService');

export function makeEdgeId() {
    const currentTime = Date.now().toString();
    const randomInteger = Math.floor(Math.random() * 10000).toString();

    return `edge-${currentTime}-${randomInteger}`;
}

export function addEdge(
    core: cytoscape.Core,
    options: cytoscape.EdgeDefinition,
    classes?: string[]
): void {
    console.log(options);
    if (!options.data.source) {
        logger.warn('addEdge > Source node is required');
        return;
    }
    if (!options.data.target) {
        logger.warn('addEdge > Target node is required');
        return;
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

    const isDirected =
        options.data.directed && Boolean(options.data.directed)
            ? Boolean(options.data.directed)
            : Boolean(core.data('directed'));

    if (isDirected) {
        core.$id(newId).addClass('directed');
    }

    core.data('numEdges', core.edges().length);
    logger.info(
        'addEdge > added edge with source',
        options.data.source,
        'and target',
        options.data.target
    );
}

export function addEdges(
    core: cytoscape.Core,
    edges: string[],
    edgeMode: 'path' | 'complete' = 'path',
    data?: Partial<EdgesData>
): void {
    if (edges.length < 2) {
        logger.warn(
            'addPath > Provide at least two edge definitions to create a path'
        );
        // TODO: Show user feedback
        return;
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
        for (let i = 0; i < edges.length - 1; i++) {
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

export function removeEdges(
    core: cytoscape.Core,
    edges: cytoscape.EdgeCollection
): void {
    if (edges.length === 0) {
        logger.warn('removeEdge > Select at least one edge');
        return;
    }

    edges.forEach((edge) => {
        if (!core.hasElementWithId(edge.id())) {
            logger.warn('removeEdge > Edge not found in graph:', edge.id());
            return;
        }

        // this.removedEdges.push(edge);
        core.remove(edge);
    });
    logger.info('removeEdge > removed', edges.length, 'edge(s)');
}

export function updateEdges(
    core: cytoscape.Core,
    edges: string[],
    property: string,
    value: string | number
): void {
    if (edges.length === 0) {
        logger.warn('updateEdges > Select at least one edge');
        return;
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
            logger.warn('updateEdges > No validator found for property:', property);
            return;
        }

        parsedValue = validator.validate(value) ? value : validator.default;
    }

    edgesCollection.data(property, parsedValue);
    logger.info('updateEdges > updated', edgesCollection.length, 'edge(s)');
}
