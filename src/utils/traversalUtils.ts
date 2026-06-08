import type cytoscape from 'cytoscape';

export function validateTraversalStart(
    graph: cytoscape.Core,
    startNodeId: string,
    onlySelected: boolean
): cytoscape.Collection {
    const elements = onlySelected
        ? graph.$('[!isGhost]:selected')
        : graph.$('[!isGhost]');

    const startNode = graph.$id(startNodeId);
    if (startNode.empty() || !startNode.isNode()) {
        throw new Error(`Start node "${startNodeId}" not found in the graph.`);
    }

    if (onlySelected && !startNode.selected()) {
        throw new Error('Start node must be selected when "onlySelected" is true.');
    }

    return elements;
}

export function resolveNeighbor(
    edge: cytoscape.EdgeSingular,
    nodeId: string
): cytoscape.NodeSingular {
    return edge.source().id() === nodeId ? edge.target() : edge.source();
}
