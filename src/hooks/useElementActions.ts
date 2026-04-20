import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import { useGetGraph, useGraphMutation } from '@/hooks';
import { addEdges, addNode, arrangeGraph } from '@/services/graph';
import { isArrayOfStrings } from '@/types/typeGuards';
import {
    useGraphMeta,
    useLayoutProperties,
    useSettings,
    useToasts,
} from '@Contexts';
import { useCallback } from 'react';

const DEFAULT_LAYOUT = { name: 'circle' };

export function useElementActions() {
    const {
        edges: { edgeMode },
    } = useGraphMeta();
    const { current: currentLayout } = useLayoutProperties();
    const {
        graph: { limits, arrangeOn },
    } = useSettings();
    const graphRef = useGetGraph('main-graph');
    const { syncMeta } = useGraphMutation('main-graph');
    const { addToast } = useToasts();

    const handleAddNode = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        try {
            addNode(graph, undefined, undefined, limits);
        } catch (error: unknown) {
            const parsedError = parseError(error);
            addToast({ type: 'error', message: parsedError.message });
            return;
        }

        syncMeta(graph);
        if (arrangeOn.addNode) {
            arrangeGraph(graph, currentLayout ?? DEFAULT_LAYOUT);
        }
    }, [graphRef, limits, arrangeOn.addNode, currentLayout, syncMeta, addToast]);

    const handleAddEdges = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        const currentSelectedNodes: unknown = graph.data('nodeSelectionOrder');

        if (!isArrayOfStrings(currentSelectedNodes)) {
            addToast({ type: 'warning', message: 'Invalid selection order data.' });
            return;
        }

        if (currentSelectedNodes.length < 2) {
            addToast({ message: 'Select at least two nodes to create an edge.' });
            return;
        }

        try {
            addEdges(graph, currentSelectedNodes, edgeMode, undefined, limits);
        } catch (error: unknown) {
            const parsedError = parseError(error);
            addToast({ type: 'error', message: parsedError.message });
            return;
        }

        syncMeta(graph);
        if (arrangeOn.addEdge) {
            arrangeGraph(graph, currentLayout ?? DEFAULT_LAYOUT);
        }
    }, [
        graphRef,
        edgeMode,
        limits,
        arrangeOn.addEdge,
        currentLayout,
        syncMeta,
        addToast,
    ]);

    return {
        handleAddNode,
        handleAddEdges,
    };
}
