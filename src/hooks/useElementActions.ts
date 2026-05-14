import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import { DefaultLayoutOptions } from '@/constants/layoutDefaults';
import { useGetGraph, useGraphMutation } from '@/hooks';
import { addEdges, addNode, arrangeGraph } from '@/services/graph';
import { useGraphMetaStore } from '@/stores/graphMetaStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { isArrayOfStrings } from '@/types/typeGuards';
import { useSettings, useToasts } from '@Contexts';
import { useCallback } from 'react';

export function useElementActions() {
    const edgeMode = useGraphMetaStore((s) => s.edgeMode);
    const currentLayout = useLayoutStore((s) => s.current);
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
            arrangeGraph(graph, currentLayout ?? DefaultLayoutOptions);
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
            arrangeGraph(graph, currentLayout ?? DefaultLayoutOptions);
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
