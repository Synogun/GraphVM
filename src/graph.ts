import cytoscape from 'cytoscape';

import { addNode } from './nodes';
import { addEdge } from './edges';


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GENERAL FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

type GraphFamily =
    | 'Cycle'
    | 'Wheel'
    | 'Complete'
    | 'Hlp'
    | 'H\'lp'
    | 'Bipartite'
    | 'Complete Bipartite'
    | 'Path'
    | 'Star';

type curveStyle =
    | 'haystack'
    | 'straight'
    | 'bezier'
    | 'unbundled-bezier'
    | 'segments'
    | 'taxi';

interface GraphOptions {
    directed?: boolean;
    numNodes?: number;
    edges?: { source: number; target: number }[];
    weights?: number[];
    family?: GraphFamily;
    layout?: cytoscape.LayoutOptions;
}

function generateGraph(options?: GraphOptions): cytoscape.Core {
    const graph = cytoscape({
        container: document.getElementById('graph'),
        elements: [],
        data: {
            directed: false,
            numNodes: 0,
            numEdges: 0,
        },

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'background-color': 'data(color)',
                    'shape': ele => ele.data('shape') as cytoscape.Css.NodeShape,

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
                    'text-halign': 'center',
                    'text-valign': 'center',
                },
            },
            {
                selector: 'node:active',
                style: {
                    'background-color': '#0169d9',
                    'border-color': '#0169d9',
                    'border-width': 2,
                },
            },
            {
                selector: 'node:selected',
                style: {
                    'background-color': 'data(color)',
                    'border-color': '#0169d9',
                    'border-width': 2,
                },
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': 'data(color)',
                    'line-style': ele => ele.data('style') as cytoscape.Css.LineStyle,
                    'curve-style': ele => ele.data('curve') as curveStyle,

                    'target-arrow-color': 'data(color)',

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
                },
            },
            {
                selector: '.edge-label-weight',
                style: {
                    label: 'data(weight)',
                },
            },
            {
                selector: '.edge-label-index',
                style: {
                    label: 'data(index)',
                },
            },
            {
                selector: '.directed',
                style: {
                    'target-arrow-shape': ele => ele.data('arrowShape') as cytoscape.Css.ArrowShape,
                },
            },
            {
                selector: 'edge:active',
                style: {
                    'line-color': '#0169d9',
                    'target-arrow-color': '#0169d9',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
                },
            },
            {
                selector: 'edge:selected',
                style: {
                    'line-color': 'data(color)',
                    'target-arrow-color': 'data(color)',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
                },
            },
        ],

        // minZoom: 0.4,
        maxZoom: 5,

        layout: {
            name: 'circle',
            radius: 100,
        },
    });

    if (options?.directed) graph.data('directed', options.directed);

    if (options?.numNodes) addNode(graph, options.numNodes);

    if (options?.edges?.length) addEdge(graph, options.edges);

    if (options?.layout) graph.layout(options.layout).run();

    return graph;
}

function newGraph(graph: cytoscape.Core): cytoscape.Core {
    // TODO: Figure a better way to do this;
    window.location.reload();
    return graph;
}

function centerGraph(graph: cytoscape.Core): cytoscape.Core {
    const selected = graph.$(':selected');
    const fitPadding = 30;

    if (selected.length > 0) {
        graph.fit(selected, fitPadding);
    } else {
        graph.fit(graph.nodes(), fitPadding);
    }

    console.log(
        'centerGraph > centered graph on',
        selected.length > 0 ? 'selected eles' : 'all nodes',
    );
    return graph;
}

export {
    generateGraph,
    newGraph,
    centerGraph,
};
