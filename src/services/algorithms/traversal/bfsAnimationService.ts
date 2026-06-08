import type { BFSAnimation, BFSStep } from '@/types/algorithms/animationTypes';
import { resolveNeighbor, validateTraversalStart } from '@/utils/traversalUtils';
import type cytoscape from 'cytoscape';

type RunBFSAnimationParams = {
    graph: cytoscape.Core;
    startNodeId: string;
    directed: boolean;
    onlySelected: boolean;
};

export function runBFSAnimation({
    graph,
    startNodeId,
    directed,
    onlySelected,
}: RunBFSAnimationParams): BFSAnimation {
    const elements = validateTraversalStart(graph, startNodeId, onlySelected);

    const steps: BFSStep[] = [];
    const queue: string[] = [startNodeId];
    const visited = new Set<string>();
    const depth: Record<string, number> = { [startNodeId]: 0 };

    snapshot(steps, {
        operation: 'enqueue',
        nodeId: startNodeId,
        edgeId: undefined,
        currentNode: startNodeId,
        visited,
        queue,
        depth,
    });

    while (queue.length > 0) {
        const nodeId = queue.shift();
        if (!nodeId) break;
        if (visited.has(nodeId)) continue;

        snapshot(steps, {
            operation: 'dequeue',
            nodeId,
            edgeId: undefined,
            currentNode: nodeId,
            visited,
            queue,
            depth,
        });

        visited.add(nodeId);

        snapshot(steps, {
            operation: 'visit',
            nodeId,
            edgeId: undefined,
            currentNode: nodeId,
            visited,
            queue,
            depth,
        });

        const node = graph.$id(nodeId);
        const edges = directed
            ? node.outgoers().edges().filter('[!isGhost]')
            : node.connectedEdges('[!isGhost]');

        for (const edge of edges.toArray()) {
            const neighbor = resolveNeighbor(edge, nodeId);
            const neighborId = neighbor.id();

            if (
                visited.has(neighborId) ||
                !elements.has(neighbor) ||
                queue.includes(neighborId)
            ) {
                continue;
            }

            snapshot(steps, {
                operation: 'discover-edge',
                nodeId: neighborId,
                edgeId: edge.id(),
                currentNode: nodeId,
                visited,
                queue,
                depth,
            });

            depth[neighborId] = (depth[nodeId] ?? 0) + 1;
            queue.push(neighborId);

            snapshot(steps, {
                operation: 'enqueue',
                nodeId: neighborId,
                edgeId: undefined,
                currentNode: nodeId,
                visited,
                queue,
                depth,
            });
        }
    }

    return {
        algorithm: 'bfs',
        params: {
            algorithm: 'bfs',
            startNodeId,
            directed,
            onlySelected,
            graphNodeIds: elements.nodes().map((n) => n.id()),
        },
        steps,
    };
}

function snapshot(
    steps: BFSStep[],
    data: {
        operation: BFSStep['operation'];
        nodeId: string;
        edgeId: string | undefined;
        currentNode: string;
        visited: Set<string>;
        queue: string[];
        depth: Record<string, number>;
    }
): void {
    steps.push({
        operation: data.operation,
        nodeId: data.nodeId,
        edgeId: data.edgeId,
        currentNode: data.currentNode,
        visited: [...data.visited],
        frontier: [...data.queue],
        metrics: { depth: { ...data.depth } },
    });
}
