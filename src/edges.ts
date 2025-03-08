import $ from 'jquery';
import cy from 'cytoscape';

import { findPropertyValueMode } from './utils';

const removedEdges: cytoscape.EdgeSingular[] = [];

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EDGE FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function addEdge(graph: cytoscape.Core, edges?: { source: number; target: number }[]): cytoscape.Core;
function addEdge(graph: cytoscape.Core, source: cytoscape.NodeSingular, target: cytoscape.NodeSingular): cytoscape.Core;
function addEdge(
    graph: cytoscape.Core,
    sourceOrEdges?:
        | cytoscape.NodeSingular
        | { source: number; target: number }[],
    target?: cytoscape.NodeSingular,
): cytoscape.Core {
    if (Array.isArray(sourceOrEdges)) {
        for (const edge of sourceOrEdges) {
            const source = graph.nodes(`[index = ${String(edge.source)}]`).first().id();
            const target = graph.nodes(`[index = ${String(edge.target)}]`).first().id();
            const newEdge = graph.add({
                group: 'edges',
                classes: [],
                data: {
                    id: `edge-${String(graph.edges().length + removedEdges.length)}`,
                    source,
                    target,
                    weight: 1,
                    index: graph.edges().length,

                    // Styling
                    label: 'hidden', // 0: hidden, 1: weight, 2: index
                    color: '#cccccc',
                    style: 'solid' as cytoscape.Css.LineStyle,
                    curve: 'bezier',
                    arrowShape: 'triangle',
                },
            });
            if (graph.data('directed')) {
                graph.edges(`#${newEdge.id()}`).addClass('directed');
            }
        }
        console.log('addEdge > added', sourceOrEdges.length, 'edge(s)');

    } else if (sourceOrEdges && target) {
        // TODO: add more properties
        // TODO: change this to default edge properties from settings instead of hardcoding
        const newEdge = graph.add({
            group: 'edges',
            data: {
                id: `edge-${String(graph.$('edge').length + removedEdges.length)}`,
                source: sourceOrEdges.id(),
                target: target.id(),
                weight: 1,
                index: graph.edges().length,

                // Styling
                label: 'hidden', // 0: hidden, 1: weight, 2: index
                color: '#cccccc',
                style: 'solid' as cytoscape.Css.LineStyle,
                curve: 'bezier',
                arrowShape: 'triangle',
            },
            classes: [],
        });
        if (graph.data('directed')) {
            graph.edges(`#${newEdge.id()}`).addClass('directed');
        }
        console.log(
            'addEdge > added edge with source',
            sourceOrEdges.id(),
            'and target',
            target.id(),
        );
    } else {
        const selected = graph.nodes(':selected');
        if (selected.length < 2) {
            console.log('addEdge > Select at least two nodes');
            return graph;
        }

        // TODO: Add option on settings to choose between sequential and all-to-all edges
        // sequential edges
        // for(let i = 0; i < selected.length; i++) {
        //     let source = selected[i].id();
        //     let target = selected[(i + 1) % selected.length].id();

        //     let newEdge = { group: "edges", data: { id: `e${graph.edges().length}`, source: source, target: target, weight: 1 } };
        //     graph.add(newEdge);

        //     console.log("addEdge > added edge with source", source, "and target", target);
        //     console.log(newEdge);
        // }

        // all-to-all edges
        for (let i = 0; i < selected.length; i++) {
            for (let j = i; j < selected.length; j++) {
                if (i === j) continue;

                const source = selected[i];
                const target = selected[j];

                addEdge(graph, source, target);
            }
        }
    }

    graph.data('numEdges', graph.edges().length);
    return graph;
}

function removeEdge(
    graph: cytoscape.Core,
    edges?: string | string[],
): cytoscape.Core {
    if (edges && !Array.isArray(edges)) {
        edges = [edges];
    } // Checks if edges is a string and converts it to an array

    if (edges && Array.isArray(edges)) {
        // Intercept for specific edges
        for (const edge of edges) {
            const ele = graph.$(`#${edge}`);
            if (ele.length === 0) {
                console.log(`removeEdge > Edge '${edge}' not found`);
                return graph;
            }
            removedEdges.push(ele);
            graph.remove(ele);
        }

        console.log('removeEdge > removed', edges.length, 'edge(s)');
    } else {
        // Default behavior for selected edges
        const selected = graph.edges(':selected');
        if (!selected.length) {
            console.log('removeEdge > Select at least one edge');
            return graph;
        }

        selected.map((ele) => {
            removedEdges.push(ele);
            graph.remove(ele);
        });

        console.log('removeEdge > removed', selected.length, 'edge(s)');
    }

    graph.data('numEdges', graph.edges().length);
    return graph;
}

function updateEdgesProp(
    graph: cytoscape.Core,
    prop: string,
    value: unknown,
): cytoscape.Core {
    const selected = graph.edges(':selected');

    if (selected.length === 0) {
        console.log('updateEdgesProp > Select at least one edge');
        return graph;
    }

    if (prop === 'weight' && String(value).trim() === '') value = 1;
    else if (prop === 'label') {
        selected.map((ele) => {
            ele.removeClass(`edge-label-${String(ele.data('label'))}`);
            ele.data('label', value);
            ele.addClass(`edge-label-${String(value)}`);
        });
    } else selected.map(ele => ele.data(prop, value));

    console.log('updated', selected.length, 'edge(s) with new', prop);
    return graph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EDGE UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type EdgeField = 'weight' | 'label' | 'color' | 'style' | 'curve';
function getEdgeFields(): { weight: string; label: string; color: string; style: string; curve: string };
function getEdgeFields(property: EdgeField): string;
function getEdgeFields(property?: EdgeField) {
    const data = {
        weight: String($('#edge-weight').val()),
        label: String($('#edge-label').val()),
        color: String($('#edge-color').val()),
        style: String($('#edge-style').val()),
        curve: String($('#edge-curve').val()),
    };
    return property ? data[property] : data;
}

function setEdgeFields(property: 'label' | 'weight' | 'color' | 'style' | 'curve', value: string): void;
function setEdgeFields(properties: { weight?: string; label?: string; color?: string; style?: string; curve?: string }): void;
function setEdgeFields(
    properties?:
        | 'label' | 'weight' | 'color' | 'style' | 'curve'
        | { weight?: string; label?: string; color?: string; style?: string; curve?: string },
    value?: string,
): void {
    if (typeof properties === 'string') {
        $(`#edge-${properties}`).val(String(value));
    } else if (typeof properties === 'object') {
        for (const [key, val] of Object.entries(properties)) {
            if (val) {
                $(`#edge-${key}`).val(val);
            }
        }
    } else {
        console.log('setEdgeFields > invalid property', properties);
    }
}

function clearEdgeFields(): void;
function clearEdgeFields(property?: string): void {
    switch (property) {
        case 'weight': {
            $('#edge-weight').val(1);
            break;
        }

        case 'label': {
            $('#edge-label').val('');
            break;
        }

        case 'color': {
            $('#edge-color').val('#000000');
            break;
        }

        case 'style': {
            $('#edge-style').val('solid');
            break;
        }

        case 'curve': {
            $('#edge-curve').val('bezier');
            break;
        }

        default: {
            $('#edge-weight').val(1);
            $('#edge-label').val('');
            $('#edge-color').val('#000000');
            $('#edge-style').val('solid');
            $('#edge-curve').val('bezier');
            break;
        }
    }
}

function updateEdgeFields(graph: cy.Core) {
    const selected = graph.edges(':selected');

    if (selected.length === 0) {
        clearEdgeFields();
        return false;
    }

    const val = {
        weight: findPropertyValueMode('weight', selected) ?? '1',
        label: findPropertyValueMode('label', selected) ?? 'hidden',
        color: findPropertyValueMode('color', selected) ?? '#000000',
        style: findPropertyValueMode('style', selected) ?? 'solid',
        curve: findPropertyValueMode('curve', selected) ?? 'bezier',
    };
    setEdgeFields(val);

    return true;
}

export {
    removedEdges,
    addEdge,
    removeEdge,
    updateEdgesProp,
    getEdgeFields,
    setEdgeFields,
    clearEdgeFields,
    updateEdgeFields,
};
