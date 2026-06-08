import { ParsedError } from '@/config/parsedError';
import { makeHlpGeneratingSet } from '@/services/algorithms/generation/HlpPrimeGeneration';
import type {
    EdgeColoringAnimation,
    EdgeColoringStep,
    HlpEdgeColoringParams,
} from '@/types';
import type cytoscape from 'cytoscape';
import { generatePalette } from './colorPalette';
import { runMisraGriesAnimation } from './misraGriesService';

function computeGreedyColorAssignments(
    graph: cytoscape.Core
): Record<string, number> {
    const assignments: Record<string, number> = {};
    const edges = graph.edges('[!isGhost]');

    edges.forEach((edge) => {
        const eId = edge.id();
        const source = edge.data('source') as string;
        const target = edge.data('target') as string;

        // Collect colors used by incident edges (at source and target)
        const usedColors = new Set<number>();
        graph
            .$id(source)
            .connectedEdges('[!isGhost]')
            .forEach((e) => {
                if (e.id() !== eId && assignments[e.id()]) {
                    usedColors.add(assignments[e.id()]);
                }
            });
        graph
            .$id(target)
            .connectedEdges('[!isGhost]')
            .forEach((e) => {
                if (e.id() !== eId && assignments[e.id()]) {
                    usedColors.add(assignments[e.id()]);
                }
            });

        // Find smallest color index not used
        let color = 0;
        while (usedColors.has(color)) color++;
        assignments[eId] = color;
    });

    return assignments;
}

export function runHlpEdgeColoringAnimation(
    graph: cytoscape.Core,
    params: HlpEdgeColoringParams
): EdgeColoringAnimation {
    const firstNode = graph.nodes().first();
    const metadata = firstNode.data('metadata') as
        | { coord?: number[]; L?: number; P?: number }
        | undefined;

    if (metadata?.L === undefined || metadata.P === undefined) {
        throw new ParsedError(
            'Graph is not an HLP graph. Generate one using Graph Templates → HLP.'
        );
    }

    const { L, P } = metadata;

    const generatingSet = makeHlpGeneratingSet(L);
    const palette = generatePalette(generatingSet.length + 1);

    if (P % 2 !== 0) {
        // Odd P: delegate to Misra-Gries and re-tag
        const mgResult = runMisraGriesAnimation(graph, { algorithm: 'misra-gries' });

        // Recompute final colorAssignments from scratch using greedy coloring,
        // since Misra-Gries animation tracking may have stale entries for complex graphs.
        const finalAssignments = computeGreedyColorAssignments(graph);

        const originalSteps = mgResult.steps;
        const fixedSteps =
            originalSteps.length > 0
                ? [
                      ...originalSteps.slice(0, -1),
                      {
                          ...originalSteps[originalSteps.length - 1],
                          colorAssignments: finalAssignments,
                      },
                  ]
                : originalSteps;

        return {
            algorithm: 'hlp-edge-coloring',
            params,
            palette: mgResult.palette,
            steps: fixedSteps,
        };
    }

    // Even P: cycle coloring
    // Build node coordinate map: coordKey → nodeId
    const coordMap = new Map<string, string>();
    graph.nodes().forEach((node) => {
        const coord = (node.data('metadata') as { coord: number[] }).coord;
        coordMap.set(coord.join(','), node.id());
    });

    // Track colored edges
    const colorAssignments: Record<string, number> = {};
    const colored = new Set<string>();
    const steps: EdgeColoringStep[] = [];

    // Build edgeIdMap from edge metadata
    const edgeIdMap = new Map<string, string>(); // "u__v" → edgeId
    graph.edges('[!isGhost]').forEach((edge) => {
        const u = edge.data('source') as string;
        const v = edge.data('target') as string;
        edgeIdMap.set(`${u}__${v}`, edge.id());
        edgeIdMap.set(`${v}__${u}`, edge.id());
    });

    // For each generator, process the cycles
    for (let gi = 0; gi < generatingSet.length; gi++) {
        const g = generatingSet[gi];
        // Find inverse generator index
        const gInv = g.map((x) => -x);
        const gi_inv = generatingSet.findIndex((gen) =>
            gen.every((val, idx) => val === gInv[idx])
        );
        if (gi_inv === -1) continue; // shouldn't happen

        // Process each node as potential cycle start
        graph.nodes().forEach((startNode) => {
            const startId = startNode.id();
            if (colored.has(`cycle_${gi.toString()}_${startId}`)) return; // already part of a processed cycle

            // Walk the cycle of length P
            const cycleNodes: string[] = [];
            let curCoord = (startNode.data('metadata') as { coord: number[] }).coord;
            for (let step = 0; step < P; step++) {
                const key = curCoord.join(',');
                const nodeId = coordMap.get(key);
                if (!nodeId) break;
                cycleNodes.push(nodeId);
                curCoord = curCoord.map(
                    (val, idx) => (((val + g[idx]) % P) + P) % P
                );
            }

            if (cycleNodes.length !== P) return;

            // Mark all nodes in this cycle as visited for this generator
            for (const nid of cycleNodes) {
                colored.add(`cycle_${gi.toString()}_${nid}`);
            }

            // Color cycle edges: even positions get gi, odd positions get gi_inv
            for (let i = 0; i < P; i++) {
                const u = cycleNodes[i];
                const v = cycleNodes[(i + 1) % P];
                const edgeId =
                    edgeIdMap.get(`${u}__${v}`) ?? edgeIdMap.get(`${v}__${u}`);
                if (!edgeId || colorAssignments[edgeId]) continue;
                const colorIdx = i % 2 === 0 ? gi : gi_inv;
                colorAssignments[edgeId] = colorIdx;
                steps.push({
                    operation: 'color-edge',
                    edgeId,
                    fanVertexIds: [],
                    pathEdgeIds: [],
                    colorAssignments: { ...colorAssignments },
                });
            }
        });
    }

    return {
        algorithm: 'hlp-edge-coloring',
        params,
        palette,
        steps,
    };
}
