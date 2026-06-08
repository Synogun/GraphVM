import type { EdgesData, NodesData } from '../types/elements';
import type { AutopanOptions } from '@/types/graph';
import {
    getEdgeArrowShape,
    getEdgeCurve,
    getEdgeLabel,
    getEdgeStyle,
    getNodeShape,
} from '@/utils/styleHelpers';
import type { CytoscapeOptions, StylesheetCSS } from 'cytoscape';
import { DefaultLayoutOptions } from './layoutDefaults';

export const DefaultNodesData: NodesData = {
    id: '',
    label: '',
    color: '#999999',
    shape: 'ellipse',
    isGhost: false,
};

export const DefaultGhostNodeData: Partial<NodesData> = {
    isGhost: true,
};

export const DefaultEdgesData: EdgesData = {
    id: '',
    source: '',
    target: '',
    weight: 1,
    labelStyle: 'hidden',
    label: '',
    color: '#cccccc',
    style: 'solid',
    curve: 'bezier',
    arrowShape: 'triangle',
    isGhost: false,
};

export const DefaultGhostEdgeData: Partial<EdgesData> = {
    isGhost: true,
    style: 'dashed',
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
    {
        selector: '.ghost-element',
        css: {
            opacity: 0.5,
        },
    },
    {
        selector: 'edge.ghost-element',
        css: {
            'line-style': 'dashed',
        },
    },
    {
        selector: '.hidden',
        css: {
            display: 'none',
        },
    },
    {
        selector: 'node.anim-visited',
        css: {
            'background-color': '#22c55e',
        },
    },
    {
        selector: 'node.anim-in-frontier',
        css: {
            'background-color': '#3b82f6',
        },
    },
    {
        selector: 'node.anim-current',
        css: {
            'background-color': '#f59e0b',
            'border-color': '#d97706',
            'border-width': 3,
        },
    },
    {
        selector: 'edge.anim-active-edge',
        css: {
            'line-color': '#f97316',
            'target-arrow-color': '#f97316',
            width: 4,
        },
    },
    {
        selector: 'edge[animColor]',
        css: { 'line-color': 'data(animColor)', width: 3 },
    },
    {
        selector: 'node.anim-fan-vertex',
        css: { 'background-color': 'hsl(var(--a))' },
    },
];

export const DefaultAutopanOptions: AutopanOptions = {
    selector: 'node',
    speed: 8,
    margin: 25,
};

export const GRAPH_MIN_ZOOM = 0.1;
export const GRAPH_MAX_ZOOM = 5;

export const DefaultGraphOptions: CytoscapeOptions = {
    layout: DefaultLayoutOptions,
    style: DefaultStylesheet,
    minZoom: GRAPH_MIN_ZOOM,
    maxZoom: GRAPH_MAX_ZOOM,
};
