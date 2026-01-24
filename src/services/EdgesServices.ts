import type { EdgesData } from '@/types/edges';
import { DefaultStyleService } from './DefaultStyleService';
import { Logger } from '@Logger';

const logger = Logger.createContextLogger('EdgesServices');

export function makeEdgeId() {
    return `edge-${Date.now().toString()}-${Math.floor(Math.random() * 10000).toString()}`;
}

export function addEdge(
    core: cytoscape.Core,
    options: cytoscape.EdgeDefinition,
    classes?: string[]
): void {
    if (!options.data.source) {
        logger.warn('addEdge > Source node is required');
        return;
    }
    if (!options.data.target) {
        logger.warn('addEdge > Target node is required');
        return;
    }

    const defaultStyleService = DefaultStyleService.getInstance();
    const newIdIndex = core.edges().length + 1;
    const newId = `edge-${Date.now().toString()}-${newIdIndex.toString()}`;

    const newEdgeData = {
        ...defaultStyleService.getEdgesData(), // default edge data
        id: newId,
        index: newIdIndex,
        ...options.data,
    };

    core.add({
        group: 'edges',
        data: newEdgeData,
        classes: classes ?? [],
    });

    if (core.data('directed')) {
        core.edges(`#${newId}`).addClass('directed');
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
    data: EdgesData,
    edgeMode = 'path',
    edges: string[]
): void {
    if (edges.length < 2) {
        logger.warn('addPath > Provide at least two edge definitions to create a path');
        // TODO: Show user feedback
        return;
    }

    if (edgeMode === 'path') {
        for (let i = 0; i < edges.length; i++) {
            addEdge(core, {
                data: {
                    source: edges[i],
                    target: edges[i + 1],
                    ...data,
                },
            });
        }
    }

    if (edgeMode === 'complete') {
        for (let i = 0; i < edges.length; i++) {
            for (let j = 0; j < i; j++) {
                addEdge(core, {
                    data: {
                        source: edges[i],
                        target: edges[j],
                        ...data,
                    },
                });
            }
        }
    }
}

export function removeEdges(core: cytoscape.Core, edges: cytoscape.EdgeCollection): void {
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

    const edgesCollection = core.edges().filter((e) => edges.includes(e.id()));

    if (property === 'weight' && String(value).trim() === '') {
        // Weight fallback to default
        edgesCollection.data('weight', 1);
    } else if (property === 'label') {
        // Update label with class for styling
        edgesCollection.map((ele) => {
            ele.removeClass(`edge-label-${String(ele.data('label'))}`);
            ele.data('label', value);
            ele.addClass(`edge-label-${String(value)}`);
        });
    } else {
        // Generic property update
        edgesCollection.map((ele) => ele.data(property, value));
    }

    logger.info('updateEdges > updated', edgesCollection.length, 'edge(s)');
}
