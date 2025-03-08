import $ from 'jquery';
import cytoscape from 'cytoscape';

import { generateGraph } from './graph';
import { arrangeGraph, bindLeftEvents, bindGraphEvents, bindRightEvents } from './ui';
import { checkDevelopment } from './utils';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GLOBAL VARIABLES
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let graph: cytoscape.Core = generateGraph();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(function () {
    checkDevelopment();
    $('#loader-wrapper').fadeOut(700);

    graph = bindLeftEvents(graph);
    graph = bindGraphEvents(graph);
    graph = bindRightEvents(graph);

    graph = arrangeGraph(graph);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
