import $ from 'jquery';
import cytoscape from 'cytoscape';

import { generateGraph } from './graph';
import { arrangeGraph, bindLeftEvents, bindGraphEvents, bindRightEvents } from './ui';
import { checkDevelopment } from './utils';


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const appVersion = '1.0.0';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// GLOBAL VARIABLES
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let graph: cytoscape.Core = generateGraph();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(function () {
    checkDevelopment();
    $('#app-version').text(appVersion);
    $('#loader-wrapper').fadeOut(700);

    graph = bindLeftEvents(graph);
    graph = bindGraphEvents(graph);
    graph = bindRightEvents(graph);

    graph = arrangeGraph(graph);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
