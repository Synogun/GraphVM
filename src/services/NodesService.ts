import { isNodeShape } from '@/types/nodesTypeGuards';
import { getDefaultNodesData } from '@/utils/styleHelpers';
import { Logger } from '@Logger';
import type cytoscape from 'cytoscape';
import { removeEdges } from './EdgesService';

const logger = Logger.createContextLogger('NodesService');

export function makeNodeId() {
    const currentTime = Date.now().toString();
    const randomInteger = Math.floor(Math.random() * 10000).toString();

    return `node-${currentTime}-${randomInteger}`;
}

export function addNode(
    core: cytoscape.Core,
    options?: cytoscape.NodeDefinition,
    classes?: string[]
): void {
    const defaultNodesData = getDefaultNodesData(core);
    const newIdIndex = core.nodes().length + 1;
    const newId = makeNodeId();

    const newNodeData = {
        ...defaultNodesData,
        id: newId,
        index: newIdIndex,
        label: newIdIndex.toString(),
        ...(options?.data ?? {}),
    };

    core.add({
        group: 'nodes',
        data: newNodeData,
        classes: [...(classes ?? [])],
    });

    core.data('numNodes', core.nodes().length);
    logger.info('addNode > added node with id:', newId, core.data());
}

export function addNodes(
    core: cytoscape.Core,
    nodesData: cytoscape.NodeDefinition[],
    classes?: string[]
): void {
    const defaultNodesData = getDefaultNodesData(core);
    const numNodes = core.nodes().length;

    const newNodes = nodesData.map((nodeData, index) => {
        const newIdIndex = numNodes + index + 1;
        const newId = makeNodeId();

        return {
            ...nodeData,
            classes: [...(classes ?? [])],
            data: {
                ...defaultNodesData,
                id: newId,
                index: newIdIndex,
                label: newIdIndex.toString(),
                ...nodeData.data,
            },
        };
    });

    core.add(newNodes);
    core.data('numNodes', numNodes + newNodes.length);
    logger.info(
        'addNodes > added nodes with ids:',
        newNodes.map((node) => node.data.id),
        core.data()
    );
}

export function removeNodes(
    core: cytoscape.Core,
    nodes: cytoscape.NodeCollection
): void {
    if (nodes.length === 0) {
        logger.warn('removeNode > Select at least one node');
        return;
    }

    nodes.forEach((node) => {
        if (!core.hasElementWithId(node.id())) {
            logger.warn('removeNode > Node not found in graph:', node.id());
            return;
        }
        const nodeEdges = node.connectedEdges();
        if (nodeEdges.length > 0) {
            removeEdges(core, nodeEdges);
        }

        // this.removedNodes.push(node);
        core.remove(node);
    });

    core.data('numNodes', core.nodes().length);
    logger.info('removeNode > removed', nodes.length, 'node(s)');
}

export function updateNodes(
    core: cytoscape.Core,
    nodes: string[],
    property: string,
    value: string
): void {
    if (nodes.length === 0) {
        logger.warn('updateNodes > Select at least one node');
        return;
    }

    const defaultNodesData = getDefaultNodesData(core);
    const nodesCollection = core.nodes().filter((n) => nodes.includes(n.id()));

    const customValidation = [
        {
            property: 'shape',
            validate: isNodeShape,
            default: defaultNodesData.shape,
        },
    ];

    let parsedValue = value;
    if (customValidation.some((v) => v.property === property)) {
        const validator = customValidation.find((v) => v.property === property);

        if (!validator) {
            logger.warn(
                'updateNodes > No validator found for property:',
                property
            );
            return;
        }

        parsedValue = validator.validate(value) ? value : validator.default;
    }

    nodesCollection.data(property, parsedValue);
    logger.info('updateNodes > updated', nodesCollection.length, 'node(s)');
}
