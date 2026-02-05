import type { EdgesData } from '@/types/edges';
import type { NodesData } from '@/types/nodes';
import {
    getEdgeArrowShape,
    getEdgeCurve,
    getEdgeLabel,
    getEdgeStyle,
    getNodeShape,
} from '@/utils/styleHelpers';
import type { CytoscapeOptions, StylesheetCSS } from 'cytoscape';

export const DefaultNodesData: NodesData = {
    id: '',
    label: '',
    color: '#999999',
    shape: 'ellipse',
};

export const DefaultEdgesData: EdgesData = {
    id: '',
    source: '',
    target: '',
    weight: 1,
    label: 'hidden',
    color: '#cccccc',
    style: 'solid',
    curve: 'bezier',
    arrowShape: 'triangle',
};

export const DefaultLayoutOptions = {
    name: 'circle',

    animate: true,
    animationDuration: 500,
    animationEasing: 'ease-in-out',

    fit: true,
    spacingFactor: 1.5,

    radius: 100,

    rows: 3,
    cols: 3,
    condensed: true,

    minNodeSpacing: 10,
};

export const DefaultStylesheet: StylesheetCSS[] = [
    {
        selector: 'node',
        css: {
            label: 'data(label)',
            'background-color': 'data(color)',
            shape: getNodeShape,

            'font-family': 'Fira Code, sans-serif',
            color: '#fff',
            'text-outline-color': '#000',
            'text-outline-width': 1,
            'text-halign': 'center',
            'text-valign': 'center',
        },
    },
    {
        selector: 'node:active',
        css: {
            'background-color': '#0169d9',
            'border-color': '#0169d9',
            'border-width': 2,
        },
    },
    {
        selector: 'node:selected',
        css: {
            'background-color': 'data(color)',
            'border-color': '#0169d9',
            'border-width': 2,
        },
    },
    {
        selector: 'edge',
        css: {
            width: 3,
            label: getEdgeLabel,
            'line-color': 'data(color)',
            'line-style': getEdgeStyle,
            'curve-style': getEdgeCurve,

            'target-arrow-color': 'data(color)',

            'font-family': 'Fira Code, sans-serif',
            color: '#fff',
            'text-outline-color': '#000',
            'text-outline-width': 1,
        },
    },
    {
        selector: '.edge-label-weight',
        css: {
            label: 'data(weight)',
        },
    },
    {
        selector: '.edge-label-index',
        css: {
            label: 'data(index)',
        },
    },
    {
        selector: 'edge.directed',
        css: {
            'target-arrow-shape': getEdgeArrowShape,
        },
    },
    {
        selector: 'edge:active',
        css: {
            'line-color': '#0169d9',
            'target-arrow-color': '#0169d9',

            'line-outline-width': 2.5,
            'line-outline-color': '#0169d9',
        },
    },
    {
        selector: 'edge:selected',
        css: {
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',

            'line-outline-width': 2.5,
            'line-outline-color': '#0169d9',
        },
    },
];

export const DefaultGraphOptions: CytoscapeOptions = {
    layout: DefaultLayoutOptions,
    style: DefaultStylesheet,
    minZoom: 0.1,
};
