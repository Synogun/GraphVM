import type { DFSAnimation, DFSStep } from '@/types/algorithms/animationTypes';
import { resolveNeighbor, validateTraversalStart } from '@/utils/traversalUtils';
import type cytoscape from 'cytoscape';

type RunDFSAnimationParams = {
    graph: cytoscape.Core;
    startNodeId: string;
    directed: boolean;
    onlySelected: boolean;
};

export function runDFSAnimation({
    graph,
    startNodeId,
    directed,
    onlySelected,
}: RunDFSAnimationParams): DFSAnimation {
    const elements = validateTraversalStart(graph, startNodeId, onlySelected);

    const steps: DFSStep[] = [];
    const stack: string[] = [startNodeId];
    const visited = new Set<string>();
    const depth: Record<string, number> = { [startNodeId]: 0 };

    snapshot(steps, {
        operation: 'push',
        nodeId: startNodeId,
        edgeId: undefined,
        currentNode: startNodeId,
        visited,
        stack,
        depth,
    });

    while (stack.length > 0) {
        const nodeId = stack.pop();
        if (!nodeId) break;
        if (visited.has(nodeId)) continue;

        snapshot(steps, {
            operation: 'pop',
            nodeId,
            edgeId: undefined,
            currentNode: nodeId,
            visited,
            stack,
            depth,
        });

        visited.add(nodeId);
        snapshot(steps, {
            operation: 'visit',
            nodeId,
            edgeId: undefined,
            currentNode: nodeId,
            visited,
            stack,
            depth,
        });

        const node = graph.$id(nodeId);
        const edges = directed
            ? node.outgoers().edges().filter('[!isGhost]')
            : node.connectedEdges('[!isGhost]');

        // Collect then reverse so first neighbor ends on top of stack (LIFO)
        const neighbors: { id: string; edgeId: string }[] = [];
        for (const edge of edges.toArray()) {
            const neighbor = resolveNeighbor(edge, nodeId);
            const neighborId = neighbor.id();
            if (
                !visited.has(neighborId) &&
                elements.has(neighbor) &&
                !stack.includes(neighborId)
            ) {
                neighbors.push({ id: neighborId, edgeId: edge.id() });
            }
        }

        neighbors.reverse();

        for (const { id: neighborId, edgeId } of neighbors) {
            depth[neighborId] ??= (depth[nodeId] ?? 0) + 1;
            snapshot(steps, {
                operation: 'discover-edge',
                nodeId: neighborId,
                edgeId,
                currentNode: nodeId,
                visited,
                stack,
                depth,
            });
            stack.push(neighborId);
            snapshot(steps, {
                operation: 'push',
                nodeId: neighborId,
                edgeId: undefined,
                currentNode: nodeId,
                visited,
                stack,
                depth,
            });
        }
    }

    return {
        algorithm: 'dfs',
        params: {
            algorithm: 'dfs',
            startNodeId,
            directed,
            onlySelected,
            graphNodeIds: elements.nodes().map((n) => n.id()),
        },
        steps,
    };
}

function snapshot(
    steps: DFSStep[],
    data: {
        operation: DFSStep['operation'];
        nodeId: string;
        edgeId: string | undefined;
        currentNode: string;
        visited: Set<string>;
        stack: string[];
        depth: Record<string, number>;
    }
): void {
    steps.push({
        operation: data.operation,
        nodeId: data.nodeId,
        edgeId: data.edgeId,
        currentNode: data.currentNode,
        visited: [...data.visited],
        frontier: [...data.stack],
        metrics: { depth: { ...data.depth } },
    });
}
