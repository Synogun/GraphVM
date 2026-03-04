import { ParsedError } from '@/config/parsedError';
import {
    MinimumBipartiteGenerationParams,
    MinimumCircleGenerationParams,
    MinimumCompleteBipartiteGenerationParams,
    MinimumCompleteGenerationParams,
    MinimumGridGenerationParams,
    MinimumSimpleGenerationParams,
    MinimumStarGenerationParams,
    MinimumWheelGenerationParams,
} from '@/constants/algorithmDefaults';
import type {
    BipartiteGraphParams,
    CircleGraphParams,
    CompleteBipartiteGraphParams,
    CompleteGraphParams,
    GridGraphParams,
    SimpleGraphParams,
    StarGraphParams,
    WheelGraphParams,
} from '@/types/algorithms';
import type cytoscape from 'cytoscape';
import { addEdge, addEdges } from '../edgesService';
import { resetGraph } from '../graphService';
import { arrangeGraph } from '../layoutService';
import { addNode } from '../nodesService';

export function generateCompleteGraph(
    graph: cytoscape.Core,
    params: CompleteGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { nodeCount } = params;

    const minimumNodeCount = MinimumCompleteGenerationParams.nodeCount;
    if (nodeCount < minimumNodeCount) {
        throw new ParsedError(
            `Node count must be at least ${minimumNodeCount.toString()} for a valid complete graph.`
        );
    }

    resetGraph(graph);

    // Add nodes
    for (let i = 0; i < nodeCount; i++) {
        addNode(graph);
    }

    const nodes = graph.nodes();

    // Add edges between every pair of nodes
    addEdges(
        graph,
        nodes.map((node) => node.id()),
        'complete'
    );

    // Apply layout if provided
    if (layout) {
        arrangeGraph(graph, layout);
    }
}

export function generateGridGraph(
    graph: cytoscape.Core,
    params: GridGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { rows, cols } = params;

    const minimumRows = MinimumGridGenerationParams.rows;
    const minimumCols = MinimumGridGenerationParams.cols;
    if (rows < minimumRows || cols < minimumCols) {
        throw new ParsedError(
            `Rows must be at least ${minimumRows.toString()} and ` +
                `columns must be at least ${minimumCols.toString()}.`
        );
    }

    resetGraph(graph);

    const totalNodes = rows * cols;

    // Add nodes
    for (let i = 0; i < totalNodes; i++) {
        addNode(graph);
    }

    const nodes = graph.nodes();

    // Add edges to form a grid
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const index = r * cols + c;
            const nodeId = nodes[index].id();

            // Connect to right neighbor
            if (c < cols - 1) {
                const rightNeighborId = nodes[index + 1].id();
                const edge = {
                    data: { source: nodeId, target: rightNeighborId },
                };

                addEdge(graph, edge);
            }

            // Connect to bottom neighbor
            if (r < rows - 1) {
                const bottomNeighborId = nodes[index + cols].id();
                const edge = {
                    data: { source: nodeId, target: bottomNeighborId },
                };

                addEdge(graph, edge);
            }
        }
    }

    // Apply layout if provided
    if (params.applyGridLayout) {
        arrangeGraph(graph, { name: 'grid', rows, cols });
    } else if (layout) {
        arrangeGraph(graph, layout);
    }
}

export function generateCircleGraph(
    graph: cytoscape.Core,
    params: CircleGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { nodeCount } = params;

    const minimumNodeCount = MinimumCircleGenerationParams.nodeCount;
    if (nodeCount < minimumNodeCount) {
        throw new ParsedError(
            `Node count must be at least ${minimumNodeCount.toString()} for a valid circle graph.`
        );
    }

    resetGraph(graph);

    // Add nodes
    for (let i = 0; i < nodeCount; i++) {
        addNode(graph);
    }

    const nodes = graph.nodes();

    // Add edges to form a circle
    for (let i = 0; i < nodeCount; i++) {
        const nextIndex = (i + 1) % nodeCount;
        const edge = {
            data: { source: nodes[i].id(), target: nodes[nextIndex].id() },
        };
        addEdge(graph, edge);
    }

    // Apply layout if provided
    if (params.applyCircleLayout) {
        arrangeGraph(graph, { name: 'circle' });
    } else if (layout) {
        arrangeGraph(graph, layout);
    }
}

export function generateStarGraph(
    graph: cytoscape.Core,
    params: StarGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { nodeCount } = params;

    const minimumNodeCount = MinimumStarGenerationParams.nodeCount;
    if (nodeCount < minimumNodeCount) {
        throw new ParsedError(
            `Node count must be at least ${minimumNodeCount.toString()} for a valid star graph.`
        );
    }

    // Clear existing graph
    resetGraph(graph);

    // Add central node
    const centerNode = addNode(graph);
    const centerNodeId = centerNode.id();

    // Add outer nodes and connect to center
    for (let i = 0; i < nodeCount; i++) {
        const outerNode = addNode(graph);
        const edge = {
            data: { source: centerNodeId, target: outerNode.id() },
        };
        addEdge(graph, edge);
    }

    // Apply layout if provided
    if (params.applyConcentricLayout) {
        arrangeGraph(graph, { name: 'concentric' });
    } else if (layout) {
        arrangeGraph(graph, layout);
    }
}

export function generateWheelGraph(
    graph: cytoscape.Core,
    params: WheelGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { nodeCount } = params;

    const minimumNodeCount = MinimumWheelGenerationParams.nodeCount;
    if (nodeCount < minimumNodeCount) {
        throw new ParsedError(
            `Node count must be at least ${minimumNodeCount.toString()} for a valid wheel graph.`
        );
    }

    resetGraph(graph);

    // Connect outer nodes to center
    const centerNode = addNode(graph);
    const centerNodeId = centerNode.id();

    // Add outer nodes
    for (let i = 0; i < nodeCount; i++) {
        addNode(graph);
    }

    const nodes = graph.nodes().filter((node) => node.id() !== centerNodeId);

    // Connect outer nodes in a cycle
    for (let i = 0; i < nodeCount; i++) {
        const nextIndex = (i + 1) % nodeCount;
        const edge = {
            data: { source: nodes[i].id(), target: nodes[nextIndex].id() },
        };

        addEdge(graph, edge);
    }

    for (let i = 0; i < nodeCount; i++) {
        const edge = {
            data: { source: centerNodeId, target: nodes[i].id() },
        };
        addEdge(graph, edge);
    }

    // Apply layout if provided
    if (params.applyConcentricLayout) {
        arrangeGraph(graph, { name: 'concentric' });
    } else if (layout) {
        arrangeGraph(graph, layout);
    }
}

export function generateBipartiteGraph(
    graph: cytoscape.Core,
    params: BipartiteGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { setASize, setBSize } = params;

    const minimumSetASize = MinimumBipartiteGenerationParams.setASize;
    const minimumSetBSize = MinimumBipartiteGenerationParams.setBSize;
    if (setASize < minimumSetASize || setBSize < minimumSetBSize) {
        throw new ParsedError(
            `Set sizes must be at least ${minimumSetASize.toString()} and ${minimumSetBSize.toString()}.`
        );
    }

    resetGraph(graph);

    // Add nodes for set A
    const setANodes: cytoscape.NodeSingular[] = [];

    for (let i = 0; i < setASize; i++) {
        const node = addNode(graph);
        setANodes.push(node);
    }

    // Add nodes for set B
    const setBNodes: cytoscape.NodeSingular[] = [];

    for (let i = 0; i < setBSize; i++) {
        const node = addNode(graph);
        setBNodes.push(node);
    }

    // Randomly connect nodes from set A to set B
    setANodes.forEach((nodeA) => {
        setBNodes.forEach((nodeB) => {
            if (Math.random() < 0.5) {
                const edge = {
                    data: { source: nodeA.id(), target: nodeB.id() },
                };
                addEdge(graph, edge);
            }
        });
    });

    // Apply layout if provided
    if (layout) {
        arrangeGraph(graph, layout);
    }
}

export function generateCompleteBipartiteGraph(
    graph: cytoscape.Core,
    params: CompleteBipartiteGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { setASize, setBSize } = params;

    const minimumSetASize = MinimumCompleteBipartiteGenerationParams.setASize;
    const minimumSetBSize = MinimumCompleteBipartiteGenerationParams.setBSize;
    if (setASize < minimumSetASize || setBSize < minimumSetBSize) {
        throw new ParsedError(
            `Set sizes must be at least ${minimumSetASize.toString()} and ${minimumSetBSize.toString()}.`
        );
    }

    resetGraph(graph);

    // Add nodes for set A
    const setANodes: cytoscape.NodeSingular[] = [];

    for (let i = 0; i < setASize; i++) {
        const node = addNode(graph);
        setANodes.push(node);
    }

    // Add nodes for set B
    const setBNodes: cytoscape.NodeSingular[] = [];

    for (let i = 0; i < setBSize; i++) {
        const node = addNode(graph);
        setBNodes.push(node);
    }

    // Connect every node in set A to every node in set B
    setANodes.forEach((nodeA) => {
        setBNodes.forEach((nodeB) => {
            const edge = {
                data: { source: nodeA.id(), target: nodeB.id() },
            };
            addEdge(graph, edge);
        });
    });

    // Apply layout if provided
    if (layout) {
        arrangeGraph(graph, layout);
    }
}

export function generateSimpleGraph(
    graph: cytoscape.Core,
    params: SimpleGraphParams,
    layout?: cytoscape.LayoutOptions
) {
    const { nodeCount, edgeCount } = params;

    const minimumNodeCount = MinimumSimpleGenerationParams.nodeCount;
    const minimumEdgeCount = MinimumSimpleGenerationParams.edgeCount;
    if (nodeCount < minimumNodeCount || edgeCount < minimumEdgeCount) {
        throw new ParsedError(
            `Node count must be at least ${minimumNodeCount.toString()} and ` +
                `edge count must be at least ${minimumEdgeCount.toString()} for a valid simple graph.`
        );
    }

    resetGraph(graph);

    // Add nodes
    for (let i = 0; i < nodeCount; i++) {
        addNode(graph);
    }

    const nodes = graph.nodes();
    const totalEdgeCount = Math.min(edgeCount, (nodeCount * (nodeCount - 1)) / 2);

    // Randomly add edges between nodes until we reach the desired edge count
    const existingEdges = new Set<string>();
    while (existingEdges.size < totalEdgeCount) {
        const sourceIndex = Math.floor(Math.random() * nodeCount);
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (sourceIndex === targetIndex) continue; // No self-loops

        const edgeKey = [sourceIndex, targetIndex].sort().join('-');
        if (existingEdges.has(edgeKey)) continue; // No duplicate edges
        existingEdges.add(edgeKey);

        const edge = {
            data: {
                source: nodes[sourceIndex].id(),
                target: nodes[targetIndex].id(),
            },
        };
        addEdge(graph, edge);
    }

    // Apply layout if provided
    if (params.applyFcoseLayout) {
        arrangeGraph(graph, { name: 'circle' });
    } else if (layout) {
        arrangeGraph(graph, layout);
    }
}
