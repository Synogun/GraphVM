import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import { useGetGraph, useGraphMutation } from '@/hooks';
import {
    arrangeGraph,
    centerGraph,
    removeEdges,
    removeNodes,
    resetGraph,
} from '@/services/graph';
import {
    useGraphSelection,
    useLayoutProperties,
    useSettings,
    useToasts,
} from '@Contexts';
import { useCallback } from 'react';

const DEFAULT_LAYOUT = { name: 'circle' };

export function useGraphActions() {
    const { current: currentLayout } = useLayoutProperties();
    const {
        graph: { defaultPaddingOnActions },
    } = useSettings();
    const {
        nodes: { selected: selectedNodes },
        edges: { selected: selectedEdges },
    } = useGraphSelection();
    const graphRef = useGetGraph('main-graph');
    const { syncAll, syncSelection } = useGraphMutation('main-graph');
    const { addToast } = useToasts();

    const handleNewGraph = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        resetGraph(graph);
        syncAll(graph);
    }, [graphRef, syncAll, addToast]);

    const handleArrangeGraph = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        arrangeGraph(graph, currentLayout ?? DEFAULT_LAYOUT);
    }, [graphRef, currentLayout, addToast]);

    const handleCenterGraph = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        const currentSelected = graph.elements(':selected');
        centerGraph(graph, currentSelected, defaultPaddingOnActions);
    }, [graphRef, defaultPaddingOnActions, addToast]);

    const handleDeselectAll = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        graph.elements(':selected').unselect();
        graph.data('nodeSelectionOrder', []);
        graph.data('edgeSelectionOrder', []);
        syncSelection(graph);
    }, [graphRef, syncSelection, addToast]);

    const handleSelectAll = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        graph.elements().select();
        graph.data(
            'nodeSelectionOrder',
            graph.nodes().map((node) => node.id())
        );
        graph.data(
            'edgeSelectionOrder',
            graph.edges().map((edge) => edge.id())
        );
        syncSelection(graph);
    }, [graphRef, syncSelection, addToast]);

    const handleDeleteSelected = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        let selectedElements = graph.elements(':selected');
        if (selectedElements.length === 0) {
            addToast({ message: 'Select nodes or edges to delete.' });
            return;
        }

        const nodesToRemove = selectedElements.filter('node');
        if (nodesToRemove.length > 0) {
            removeNodes(graph, nodesToRemove);
            graph.data('nodeSelectionOrder', []);
        }

        selectedElements = graph.elements(':selected');
        const edgesToRemove = selectedElements.filter('edge');
        if (edgesToRemove.length > 0) {
            try {
                removeEdges(graph, edgesToRemove);
            } catch (error: unknown) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
                return;
            }

            graph.data('edgeSelectionOrder', []);
        }

        syncAll(graph);
    }, [graphRef, syncAll, addToast]);

    return {
        handleNewGraph,
        handleArrangeGraph,
        handleCenterGraph,
        handleDeselectAll,
        handleSelectAll,
        handleDeleteSelected,
        isDeleteBtnDisabled:
            selectedNodes.length === 0 && selectedEdges.length === 0,
    };
}
