import $ from 'jquery';
import cy from 'cytoscape';

import { findPropertyValueMode } from './utils';

const removedNodes: cytoscape.NodeSingular[] = [];

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// NODE FUNCTIONS
//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function addNode(graph: cytoscape.Core, quantity = 1, options?: cy.ElementDefinition | cy.ElementDefinition[], classes?: string[]): cytoscape.Core {
    if (quantity < 1) {
        console.log('addNode > Quantity must be greater than 0');
        return graph;
    }

    if (options && Array.isArray(options) && options.length < quantity) {
        // Checks if options is an array and has the same length as quantity
        console.log('addNode > Options length must be greater than or equal to quantity');
        return graph;
    } else if (options && !Array.isArray(options)) {
        // Checks if options is an object and converts it to an array
        options = [options];
    } else if (!options) {
        // Checks if options is undefined and converts it to an empty array
        options = [];
    }

    const defaultNodeProperties = {
        color: '#999999' as cytoscape.Css.Colour,
        shape: 'ellipse' as cytoscape.Css.NodeShape,
    };

    for (let i = 0; i < quantity; i++) {
        const newIdIndex: number = graph.nodes().length + removedNodes.length;
        const newId = `node-${newIdIndex.toString()}`;
        graph.add({
            group: 'nodes',
            data: {
                id: newId,
                index: graph.nodes().length,

                label: options[i]?.data.label
                    ? String(options[i].data.label)
                    : newIdIndex,

                color: options[i]?.data.color
                    ? (options[i].data.color as cytoscape.Css.Colour)
                    : defaultNodeProperties.color,

                shape: options[i]?.data.shape
                    ? (options[i].data.shape as cytoscape.Css.NodeShape)
                    : defaultNodeProperties.shape,
            },
            classes: classes ?? [],
        });
        console.log(
            `addNode > added node with id '${newId}' and label '${newIdIndex.toString()}'`,
        );
    }

    graph.data('numNodes', graph.nodes().length);
    return graph;
}

function removeNode(graph: cytoscape.Core, nodes?: string | string[]): cytoscape.Core {
    // Checks if nodes is a string and converts it to an array
    if (nodes && !Array.isArray(nodes)) {
        nodes = [nodes];
    }

    if (nodes && Array.isArray(nodes)) {
        // Intercept when deleting specific nodes

        for (const node of nodes) {
            const ele = graph.$(`#${node}`);
            if (ele.length === 0) {
                console.log(`removeNode > Node '${node}' not found`);
                return graph;
            }
            removedNodes.push(ele);
            graph.remove(ele);
        }
        console.log('removeNode > removed', nodes.length, 'node(s)');

    } else {
        // (Default behavior) When deleting selected nodes

        const selected = graph.nodes(':selected');

        if (selected.length === 0) {
            console.log('removeNode > Select at least one node');
            return graph;
        }

        selected.forEach((ele) => {
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

    if (prop === 'label') {
        const labelValue = String(value).split(';');

        selected.forEach((ele, i) => {
            if (labelValue[i].trim() === '') labelValue[i] = ele.id().split('-')[1];
            ele.data(prop, labelValue[i].trim());
        });
    } else {
        selected.forEach((ele) => {
            ele.data(prop, value);
        });
    }

    console.log('updateNodesProp > updated', selected.length, 'node(s) with new', prop);
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

function setNodeFields(property: NodeField, value: string): void;
function setNodeFields(properties: { label?: string; color?: string; shape?: string }): void;
function setNodeFields(properties?: NodeField | { label?: string; color?: string; shape?: string }, value?: string): void {
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

    if (selected.length === 0) { clearNodeFields(); }

    setNodeFields({
        label: selected.map((ele) => {
            return ele.data('label') !== undefined ? String(ele.data('label')) : ele.id();
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
