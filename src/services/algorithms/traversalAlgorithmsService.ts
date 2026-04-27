import { Logger } from '@Logger';

const logger = Logger.createContextLogger('TraversalAlgorithmsService');

export function runBFSAlgorithm({
    graph,
    startNodeId,
    directed,
    onlySelected,
}: {
    graph: cytoscape.Core;
    startNodeId: string;
    directed: boolean;
    onlySelected: boolean;
}): { path: cytoscape.Collection; found: cytoscape.NodeSingular | null } {
    let elements = graph.elements('[!isGhost]');
    const rawRoot = graph.getElementById(startNodeId);
    const root: cytoscape.NodeSingular | null =
        rawRoot.nonempty() && rawRoot.isNode() ? rawRoot : null;

    if (root === null) {
        throw new Error('Start node not found in the graph.');
    }

    if (onlySelected) {
        if (!root.selected()) {
            throw new Error(
                'Start node must be selected if "onlySelected" is true.'
            );
        }

        elements = elements.filter((ele) => ele.selected());

        if (!elements.has(root)) {
            throw new Error(
                'Start node must be selected if "onlySelected" is true.'
            );
        }
    }

    if (elements.empty()) {
        throw new Error('No elements to traverse.');
    }

    if (elements.edges().empty()) {
        throw new Error('Graph must contain edges to perform BFS traversal.');
    }

    const result = elements.bfs({ roots: `#${startNodeId}`, directed });
    parseBFSResult(result);

    return { path: elements, found: root };
}

export function parseBFSResult(result: cytoscape.SearchFirstResult) {
    const path = result.path;
    const found = result.found;

    const pathIds = path
        .map((ele) => {
            if (ele.isNode()) {
                return `n${String(ele.data('label'))}`;
            }

            return `e${String(ele.data('index'))}`;
        })
        .join(' -> ');
    const foundId = found.map((ele) => `n${String(ele.data('label'))}`).join(', ');

    logger.info(`BFS Traversal Path: ${pathIds}`);
    logger.info(`Target Node Found: ${foundId}`);
}
