import { ParsedError } from '@/config/parsedError';
import {
    MaximumHlpGenerationParams,
    MaximumHlpGenerationParamsForL3,
    MinimumHlpGenerationParams,
} from '@/constants/algorithmDefaults';
import { addEdge, addNode, resetGraph } from '@/services';
import type { GraphLimits, HlpGraphParams } from '@/types';
import { makeHlpEdgeSet } from './makeEdgeSet';
import { makeHlpGeneratingSet } from './makeGeneratingSet';
import { makeHlpNodeSet } from './makeNodeSet';

function validateHlpGraphParams(params: HlpGraphParams) {
    const { L, P } = params;

    const { L: minimumL, P: minimumP } = MinimumHlpGenerationParams;
    if (L < minimumL) {
        throw new ParsedError(
            `Coordinate dimension must be at least ${minimumL.toString()} for a valid Hlp graph.`
        );
    }
    if (P < minimumP) {
        throw new ParsedError(
            `Coordinate modulo must be at least ${minimumP.toString()} for a valid Hlp graph.`
        );
    }

    const { L: maximumL, P: maximumP } = MaximumHlpGenerationParams;
    if (L > maximumL) {
        throw new ParsedError(
            `Coordinate dimension must be at most ${maximumL.toString()} for a valid Hlp graph.`
        );
    }
    if (
        (L === 3 && P > MaximumHlpGenerationParamsForL3.P) ||
        (L > 3 && P > maximumP)
    ) {
        throw new ParsedError(
            `Coordinate modulo must be at most ${maximumP.toString()} for a valid Hlp graph.`
        );
    }

    return true;
}

export function generateHlpGraph(
    graph: cytoscape.Core,
    params: HlpGraphParams,
    layout?: cytoscape.LayoutOptions,
    limits?: GraphLimits
) {
    const { L, P } = params;

    validateHlpGraphParams(params);

    resetGraph(graph);

    const generatingSet = makeHlpGeneratingSet(L);
    const nodeSet = makeHlpNodeSet(L, P);
    const edgeSet = makeHlpEdgeSet(nodeSet, generatingSet, P);

    const indexToIdMap = new Map<number, string>();

    graph.startBatch();

    nodeSet.forEach((node, index) => {
        const newNode = addNode(
            graph,
            { data: { label: `(${node.toString()})` } },
            undefined,
            limits
        );
        indexToIdMap.set(index, newNode.id());
    });

    edgeSet.forEach(([sourceIndex, targetIndex]) => {
        const sourceId = indexToIdMap.get(sourceIndex);
        const targetId = indexToIdMap.get(targetIndex);

        const oppositeEdgeExists = graph
            .edges()
            .some(
                (e) => e.data('source') === targetId && e.data('target') === sourceId
            );

        if (sourceId && targetId && !oppositeEdgeExists) {
            addEdge(
                graph,
                { data: { source: sourceId, target: targetId } },
                undefined,
                limits
            );
        }
    });

    if (layout) {
        graph.layout(layout).run();
    }
    graph.endBatch();
}
