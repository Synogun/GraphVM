import $ from 'jquery';
import cy from 'cytoscape';

import { findPropertyValueMode } from './utils';

const removedNodes: cytoscape.NodeSingular[] = [];

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// NODE FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function addNode(graph: cytoscape.Core, quantity = 1, options?: cytoscape.ElementDefinition): cytoscape.Core {
    // TODO: add more properties
    // TODO: change this to default node properties from global configs instead of hardcoding

    for (let i = 0; i < quantity; i++) {
        const newId: number = graph.nodes().length + removedNodes.length;
        graph.add({
            group: 'nodes',
            data: {
                id: `node-${newId.toString()}`,
                index: graph.nodes().length,

                label: options?.data.label
                    ? String(options.data.label)
                    : newId,

                color: options?.data.color
                    ? (options.data.color as cytoscape.Css.Colour)
                    : ('#999999' as cytoscape.Css.Colour),

                shape: options?.data.color
                    ? (options.data.color as cytoscape.Css.Colour)
                    : ('ellipse' as cytoscape.Css.NodeShape),
            },
            classes: [],
        });
        console.log(
            `addNode > added node with id 'node-${newId.toString()}' and label '${newId.toString()}'`,
        );
    }
    graph.data('numNodes', graph.nodes().length);
    return graph;
}

function removeNode(graph: cytoscape.Core, nodes?: string | string[]): cytoscape.Core {
    if (nodes && !Array.isArray(nodes)) {
        nodes = [nodes];
    } // Checks if nodes is a string and converts it to an array

    if (nodes && Array.isArray(nodes)) {
        // Intercept for specific nodes
        for (const node of nodes) {
            const ele = graph.$(`#${node}`);
            if (ele.length === 0) {
                console.log(`removeNode > Node '${node}' not found`);
                return graph;
            }
            removedNodes.push(ele);
            graph.remove(ele);
        }
        graph.data('numNodes', graph.nodes().length);
        graph.data('numEdges', graph.edges().length);

        console.log('removeNode > removed', nodes.length, 'node(s)');
    } else {
        // Default behavior for selected nodes
        const selected = graph.nodes(':selected');

        if (selected.length === 0) {
            console.log('removeNode > Select at least one node');
            return graph;
        }

        selected.map((ele) => {
            removedNodes.push(ele);
            graph.remove(ele);
        });
        console.log('removeNode > removed', selected.length, 'node(s)');
    }

    graph.data('numNodes', graph.nodes().length);
    graph.data('numEdges', graph.edges().length);

    return graph;
}

function updateNodesProp(graph: cytoscape.Core, prop: string, value: string): cytoscape.Core {
    const selected = graph.nodes(':selected');
    if (selected.length === 0) {
        console.log('updateNodesProp > Select at least one node');
        return graph;
    }

    // let prop = propId.split('-')[2];
    // let value = $(`#${propId}`).val();

    if (prop === 'label') {
        const lval = String(value).split(';');

        selected.map((ele, i) => {
            if (lval[i].trim() === '') lval[i] = ele.id().split('-')[1];

            ele.data(prop, lval[i].trim());
        });
    } else {
        selected.map((ele) => {
            ele.data(prop, value);
        });
    }

    console.log(
        'updateNodesProp > updated',
        selected.length,
        'node(s) with new',
        prop,
    );
    return graph;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// NODE UI FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export type NodeField = 'label' | 'color' | 'shape';
function getNodeFields(): { label: string; color: string; shape: string };
function getNodeFields(property: NodeField): string;
function getNodeFields(property?: NodeField): string | { label: string; color: string; shape: string } {
    const data = {
        label: String($('#node-label').val()),
        color: String($('#node-color').val()),
        shape: String($('#node-shape').val()),
    };
    return property ? data[property] : data;
}

function setNodeFields(property: 'label' | 'color' | 'shape', value: string): void;
function setNodeFields(properties: { label?: string; color?: string; shape?: string }): void;
function setNodeFields(
    properties?: 'label' | 'color' | 'shape' | { label?: string; color?: string; shape?: string },
    value?: string,
): void {
    if (typeof properties === 'string') {
        $(`#node-${properties}`).val(String(value));
    } else if (typeof properties === 'object') {
        for (const [key, val] of Object.entries(properties)) {
            if (val) {
                $(`#node-${key}`).val(val);
            }
        }
    } else {
        console.log('setNodeFields > invalid property', properties);
    }
}

function clearNodeFields(): void;
function clearNodeFields(property?: string): void {
    switch (property) {
        case 'label':
            $('#node-label').val('');
            break;

        case 'color':
            $('#node-color').val('#000000');
            break;

        case 'shape':
            $('#node-shape').val('ellipse');
            break;

        default:
            $('#node-label').val('');
            $('#node-color').val('#000000');
            $('#node-shape').val('ellipse');
            break;
    }
}

function updateNodeFields(graph: cy.Core) {
    const selected = graph.nodes(':selected');

    if (selected.length === 0) {
        clearNodeFields();
    }

    setNodeFields({
        label: selected.map((ele) => {
            return ele.data('label') !== undefined
                ? String(ele.data('label'))
                : ele.id();
        }).join(' ; '),
        color: findPropertyValueMode('color', selected) ?? '#000000',
        shape: findPropertyValueMode('shape', selected) ?? 'ellipse',
    });
}

export {
    removedNodes,
    addNode,
    removeNode,
    updateNodesProp,
    getNodeFields,
    setNodeFields,
    clearNodeFields,
    updateNodeFields,
};
