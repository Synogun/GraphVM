import { ParsedError } from '@/config/parsedError';
import { isNodeShape } from '@/types/nodesTypeGuards';
import { getDefaultNodesData } from '@/utils/styleHelpers';
import type cytoscape from 'cytoscape';
import { removeEdges } from './edgesService';

export function makeNodeId() {
    const currentTime = Date.now().toString();
    const randomInteger = Math.floor(Math.random() * 10000).toString();

    return `node-${currentTime}-${randomInteger}`;
}

export function addNode(
    core: cytoscape.Core,
    options?: cytoscape.NodeDefinition,
    classes?: string[]
): cytoscape.NodeSingular {
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

    return core.$id(newId);
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
}

export function removeNodes(
    core: cytoscape.Core,
    nodes: cytoscape.NodeCollection
): void {
    if (nodes.length === 0) {
        throw new ParsedError('Select at least one node to remove.');
    }

    nodes.forEach((node) => {
        if (!core.hasElementWithId(node.id())) {
            throw new ParsedError('Node not found in graph', {
                context: { nodeId: node.id() },
            });
        }
        const nodeEdges = node.connectedEdges();
        if (nodeEdges.length > 0) {
            removeEdges(core, nodeEdges);
        }

        // this.removedNodes.push(node);
        core.remove(node);
    });
}

export function updateNodes(
    core: cytoscape.Core,
    nodes: string[],
    property: string,
    value: string
): void {
    if (nodes.length === 0) {
        throw new ParsedError('Select at least one node to update.');
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
            throw new ParsedError('No validator found for property:', {
                context: { property },
            });
        }

        parsedValue = validator.validate(value) ? value : validator.default;
    }

    nodesCollection.data(property, parsedValue);
}
