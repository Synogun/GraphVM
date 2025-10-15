import type cytoscape from 'cytoscape';
import { ConfigService } from './ConfigService';
import { removeEdges } from './EdgesServices';

export function addNode(core: cytoscape.Core, options?: cytoscape.NodeDefinition, classes?: string[]): void {
    const configService = ConfigService.getInstance();
    const numNodes = core.nodes().length;

    const newIdIndex = numNodes + 1;
    const newId = `node-${Date.now().toString()}-${newIdIndex.toString()}`;

    const newNodeData = {
        ...configService.getNodesData(),
        id: newId,
        index: newIdIndex,
        label: newIdIndex.toString(),
        ...options?.data ?? {},
    };

    core.add({
        group: 'nodes',
        data: newNodeData,
        classes: classes ?? [],
    });

    core.data('numNodes', numNodes + 1);
    console.log('addNode > added node with id:', newId, core.data());
}

export function removeNodes(core: cytoscape.Core, nodes: cytoscape.NodeCollection): void {
    if (nodes.length === 0) {
        console.log('removeNode > Select at least one node');
        return;
    }

    nodes.forEach((node) => {
        if (!core.hasElementWithId(node.id())) {
            console.log('removeNode > Node not found in graph:', node.id());
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
    console.log('removeNode > removed', nodes.length, 'node(s)');
}

export function updateNodes(nodes: cytoscape.NodeCollection, property: string, value: string): void {
    if (nodes.length === 0) {
        console.log('updateNodes > Select at least one node');
        return;
    }

    nodes.forEach((node) => {
        node.data(property, value);
    });

    console.log('updateNodes > updated', nodes.length, 'node(s)');
}
