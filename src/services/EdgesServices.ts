import type { EdgesData } from '@/types/edges';
import { DefaultStyleService } from './DefaultStyleService';

export function makeEdgeId() {
    return `edge-${Date.now().toString()}-${Math.floor(Math.random() * 10000).toString()}`;
}

export function addEdge(
    core: cytoscape.Core,
    options: cytoscape.EdgeDefinition,
    classes?: string[]
): void {
    if (!options.data.source) {
        console.log('addEdge > Source node is required');
        return;
    }
    if (!options.data.target) {
        console.log('addEdge > Target node is required');
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
    console.log(
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
        console.log('addPath > Provide at least two edge definitions to create a path');
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
        console.log('removeEdge > Select at least one edge');
        return;
    }

    edges.forEach((edge) => {
        if (!core.hasElementWithId(edge.id())) {
            console.log('removeEdge > Edge not found in graph:', edge.id());
            return;
        }

        // this.removedEdges.push(edge);
        core.remove(edge);
    });
    console.log('removeEdge > removed', edges.length, 'edge(s)');
}

export function updateEdges(
    core: cytoscape.Core,
    edges: string[],
    property: string,
    value: string | number
): void {
    if (edges.length === 0) {
        console.log('updateEdges > Select at least one edge');
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

    console.log('updateEdges > updated', edgesCollection.length, 'edge(s)');
}
