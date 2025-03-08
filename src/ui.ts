import $ from 'jquery';
import cy from 'cytoscape';

import { centerGraph, newGraph } from './graph';

import { addNode, removeNode, updateNodesProp, getNodeFields, updateNodeFields, NodeField } from './nodes';
import { addEdge, removeEdge, updateEdgesProp, getEdgeFields, updateEdgeFields, EdgeField } from './edges';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function togglePanel(panel: string, state?: boolean) {
    switch (panel) {
        case 'graph':
            $('#graph-panel').toggleClass('d-none', !state);
            break;

        case 'layout':
            $('#layout-panel').toggleClass('d-none', !state);
            break;

        case 'node':
            $('#node-panel').toggleClass('d-none', !state);
            break;

        case 'edge':
            $('#edge-panel').toggleClass('d-none', !state);
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
        condense: true,
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
    graph.on('select box', 'node', function (evt) {
        updateNodeFields(graph);

        if (graph.nodes(':selected').length >= 1) {
            togglePanel('node', true);
        }
        console.log('selected node', evt.target);
    });

    graph.on('unselect', 'node', function (evt) {
        updateNodeFields(graph);

        if (!graph.nodes(':selected').length) {
            togglePanel('node', false);
        }
        console.log('unselected node', evt.target);
    });

    // EDGE EVENTS
    graph.on('select box', 'edge', function (evt) {
        updateEdgeFields(graph);

        if (graph.edges(':selected').length >= 1) {
            togglePanel('edge', true);
        }
        console.log('selected edge', evt.target);
    });

    graph.on('unselect', 'edge', function (evt) {
        updateEdgeFields(graph);

        if (!graph.edges(':selected').length) {
            togglePanel('edge', false);
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
    $('#node-label, #node-color, #node-shape').on('change', function (evt) {
        const property = evt.target.id.split('-')[1] as NodeField;
        graph = updateNodesProp(graph, property, getNodeFields(property));
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
    $('#edge-weight, #edge-label, #edge-color, #edge-style, #edge-curve').on('change', function (evt) {
        const property = evt.target.id.split('-')[1] as EdgeField;
        graph = updateEdgesProp(graph, property, getEdgeFields(property));
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
