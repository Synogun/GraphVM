import $ from 'jquery';
import cy from 'cytoscape';

import { centerGraph, newGraph } from './graph';

import { addNode, removeNode, updateNodesProp, getNodeFields, updateNodeFields } from './nodes';
import { addEdge, removeEdge, updateEdgesProp, getEdgeFields, updateEdgeFields } from './edges';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function togglePanel(panel: string) {
    switch (panel) {
        case 'graph':
            $('#graph-panel').toggleClass('d-none');
            break;

        case 'layout':
            $('#layout-panel').toggleClass('d-none');
            break;

        case 'node':
            $('#node-panel').toggleClass('d-none');
            break;

        case 'edge':
            $('#edge-panel').toggleClass('d-none');
            break;

        default:
            console.log('togglePanel: invalid panel', panel);
            break;
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GRAPH UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function updateGraphFields(graph: cy.Core) {
    $('#node-count').val(String(graph.data('numNodes')) + ' nodes');
    $('#edge-count').val(String(graph.data('numEdges')) + ' edges');
}

function arrangeGraph(graph: cy.Core) {
    const layout = getLayoutFields();
    graph.layout(layout).run();

    return graph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// LAYOUT UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function switchLayoutPanel(subpanel: string) {
    $('.layout-properties').addClass('d-none');
    $(`.${subpanel.toLocaleLowerCase()}-layout-properties`).removeClass('d-none');
}

function getLayoutFields() {
    const name = String($('#graph-layout').val());
    const layout = {
        // general properties
        name: name,
        animate: true,
        animationDuration: 500,
        animationEasing: 'ease-in-out',

        // circle layout properties
        radius: 100,

        // grid layout properties
        rows: 3,
        cols: 3,
        condense: false,
        spacingFactor: 0,

        // concentric layout properties
        minNodeSpacing: 50,
    };

    switch (name) {
        case 'circle': {
            layout.radius = parseInt(String($('#circle-radius').val()));
            break;
        }

        case 'grid': {
            layout.rows = parseInt(String($('#grid-rows').val()));
            layout.cols = parseInt(String($('#grid-cols').val()));
            layout.condense = $('#grid-condensed').is(':checked');
            layout.spacingFactor = $('#grid-condensed').is(':checked') ? 1.5 : 0;
            break;
        }

        case 'concentric': {
            layout.minNodeSpacing = 50;
            break;
        }

        default: {
            // do nothing
            break;
        }
    }

    return layout;
}

// function clearLayoutFields() {
//     // TODO: Use default values from settings in the future instead of hardcoding

//     // default layout
//     $('#graph-layout').val('circle');

//     // default circle layout
//     $('#circle-radius').val(100);

//     // default grid layout
//     $('#grid-rows').val(3);
//     $('#grid-cols').val(3);
//     $('#grid-condense').val(false);
// }

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// EVENT HANDLERS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function bindLeftEvents(graph: cy.Core): cy.Core {
    $('#btn-new-graph').on('click', function () {
        graph = newGraph(graph);
        graph = arrangeGraph(graph);
    });

    $('#btn-arrange-graph').on('click', function () { graph = arrangeGraph(graph); });
    $('#btn-center-graph').on('click', function () { graph = centerGraph(graph); });

    $('#btn-add-node').on('click', function () {
        graph = addNode(graph);
        graph = arrangeGraph(graph);
        updateGraphFields(graph);
    });
    $('#btn-add-edge').on('click', function () {
        graph = addEdge(graph);
        graph = arrangeGraph(graph);
        updateGraphFields(graph);
    });

    return graph;
}

function bindGraphEvents(graph: cy.Core): cy.Core {
    // NODE EVENTS
    graph.on('select', 'node', function (evt) {
        updateNodeFields(graph);

        if (graph.nodes(':selected').length === 1) {
            togglePanel('node');
        }
        console.log('selected node', evt.target);
    });

    graph.on('unselect', 'node', function (evt) {
        updateNodeFields(graph);

        if (!graph.nodes(':selected').length) {
            togglePanel('node');
        }
        console.log('unselected node', evt.target);
    });

    // EDGE EVENTS
    graph.on('select', 'edge', function (evt) {
        updateEdgeFields(graph);

        if (graph.edges(':selected').length === 1) {
            togglePanel('edge');
        }
        console.log('selected edge', evt.target);
    });

    graph.on('unselect', 'edge', function (evt) {
        updateEdgeFields(graph);

        if (!graph.edges(':selected').length) {
            togglePanel('edge');
        }
        console.log('unselected edge', evt.target);
    });

    return graph;
}

function bindRightEvents(graph: cy.Core): cy.Core {
    // LAYOUT PANEL
    $('#graph-layout, .circle-properties, .grid-properties').on('change', function () {
        const layout = getLayoutFields();
        switchLayoutPanel(layout.name);

        graph = arrangeGraph(graph);
        // console.log('updated graph layout', layout.name);
    });

    // NODES PANEL
    $('#node-label').on('change', function () {
        graph = updateNodesProp(graph, 'label', getNodeFields('label'));
        updateNodeFields(graph);
    });

    $('#node-color').on('change', function () {
        graph = updateNodesProp(graph, 'color', getNodeFields('color'));
        updateNodeFields(graph);
    });

    $('#node-shape').on('change', function () {
        graph = updateNodesProp(graph, 'shape', getNodeFields('shape'));
        updateNodeFields(graph);
    });

    $('#btn-delete-node').on('click', function () {
        graph = removeNode(graph);
        graph = arrangeGraph(graph);

        updateNodeFields(graph);
        if (!graph.nodes(':selected').length) {
            togglePanel('node');
        }
        updateGraphFields(graph);
    });

    // EDGES PANEL
    $('#edge-weight').on('change', function () {
        graph = updateEdgesProp(graph, 'weight', getEdgeFields('weight'));
        updateEdgeFields(graph);
    });

    $('#edge-label').on('change', function () {
        graph = updateEdgesProp(graph, 'label', getEdgeFields('label'));
        updateEdgeFields(graph);
    });

    $('#edge-color').on('change', function () {
        graph = updateEdgesProp(graph, 'color', getEdgeFields('color'));
        updateEdgeFields(graph);
    });

    $('#edge-style').on('change', function () {
        graph = updateEdgesProp(graph, 'style', getEdgeFields('style'));
        updateEdgeFields(graph);
    });

    $('#edge-curve').on('change', function () {
        graph = updateEdgesProp(graph, 'curve', getEdgeFields('curve'));
        updateEdgeFields(graph);
    });

    $('#btn-delete-edge').on('click', function () {
        graph = removeEdge(graph);
        graph = arrangeGraph(graph);

        updateEdgeFields(graph);
        if (!graph.edges(':selected').length) {
            togglePanel('edge');
        }
        updateGraphFields(graph);
    });

    return graph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export {
    togglePanel,
    updateGraphFields,
    arrangeGraph,
    bindLeftEvents,
    bindGraphEvents,
    bindRightEvents,
};
