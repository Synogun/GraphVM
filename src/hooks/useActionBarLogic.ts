import { ParsedErrorToasts, parseError } from '@/config/parsedError';
import { useGraphMutation } from '@/hooks/useGraphMutation';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { addEdges, removeEdges } from '@/services/edgesService';
import { resetGraph } from '@/services/graphService';
import { arrangeGraph, centerGraph } from '@/services/layoutService';
import { addNode, removeNodes } from '@/services/nodesService';
import { isArrayOfStrings } from '@/types/typeGuards';
import {
    useGraphProperties,
    useLayoutProperties,
    useModals,
    useSettings,
    useToasts,
} from '@Contexts';
import { useCallback, useEffect, type ChangeEvent } from 'react';

const DEFAULT_LAYOUT = { name: 'circle' };

export function useActionBarLogic() {
    const {
        directed,
        nodes: { selected: selectedNodes },
        edges: { edgeMode, setEdgeMode, selected: selectedEdges },
    } = useGraphProperties();

    const {
        setIsAlgorithmsModalOpen,
        setIsHelpModalOpen,
        setIsSettingsModalOpen,
        setIsImportExportModalOpen,
    } = useModals();

    const { current: currentLayout } = useLayoutProperties();
    const {
        graph: { limits, arrangeOn },
    } = useSettings();
    const graphRef = useGetGraph('main-graph');
    const { syncMeta, syncAll } = useGraphMutation('main-graph');

    const { addToast } = useToasts();

    useEffect(() => {
        if (directed && edgeMode === 'complete') {
            setEdgeMode('path');
        }
    }, [directed, edgeMode, setEdgeMode]);

    const handleNewGraph = useCallback(() => {
        const graph = graphRef.current;

        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        resetGraph(graph);
        syncAll(graph);
    }, [graphRef, syncAll, addToast]);

    const handleAlgorithms = useCallback(() => {
        setIsAlgorithmsModalOpen(true);
    }, [setIsAlgorithmsModalOpen]);

    const handleImportExport = useCallback(() => {
        setIsImportExportModalOpen(true);
    }, [setIsImportExportModalOpen]);

    const handleArrangeGraph = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        arrangeGraph(graph, currentLayout ?? DEFAULT_LAYOUT);
    }, [graphRef, currentLayout, addToast]);

    const handleSettings = useCallback(() => {
        setIsSettingsModalOpen(true);
    }, [setIsSettingsModalOpen]);

    const handleHelp = useCallback(() => {
        setIsHelpModalOpen(true);
    }, [setIsHelpModalOpen]);

    const handleCenterGraph = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        const currentSelected = graph.elements(':selected');

        //TODO: add default padding to graph properties
        centerGraph(graph, currentSelected, 30);
    }, [graphRef, addToast]);

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
            handleArrangeGraph();
        }
    }, [
        graphRef,
        limits,
        arrangeOn.addNode,
        syncMeta,
        handleArrangeGraph,
        addToast,
    ]);

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
            handleArrangeGraph();
        }
    }, [
        graphRef,
        edgeMode,
        limits,
        arrangeOn.addEdge,
        syncMeta,
        handleArrangeGraph,
        addToast,
    ]);

    const handleToggleEdgeMode = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (directed) {
                addToast({
                    type: 'warning',
                    message: 'Edge mode is locked to path while graph is directed.',
                });
                return;
            }
            setEdgeMode(e.target.checked ? 'complete' : 'path');
        },
        [directed, setEdgeMode, addToast]
    );

    const handleDeleteSelected = useCallback(() => {
        if (!graphRef.current) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        let selectedElements = graphRef.current.elements(':selected');
        if (selectedElements.length === 0) {
            addToast({ message: 'Select nodes or edges to delete.' });
            return;
        }

        const nodesToRemove = selectedElements.filter('node');
        if (nodesToRemove.length > 0) {
            removeNodes(graphRef.current, nodesToRemove);

            graphRef.current.data('nodeSelectionOrder', []);
        }

        selectedElements = graphRef.current.elements(':selected');
        const edgesToRemove = selectedElements.filter('edge');
        if (edgesToRemove.length > 0) {
            try {
                removeEdges(graphRef.current, edgesToRemove);
            } catch (error: unknown) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
                return;
            }

            graphRef.current.data('edgeSelectionOrder', []);
        }
        syncAll(graphRef.current);
    }, [graphRef, syncAll, addToast]);

    return {
        edgeMode,
        selectedNodes,
        selectedEdges,
        handleNewGraph,
        handleAlgorithms,
        handleImportExport,
        handleArrangeGraph,
        handleSettings,
        handleHelp,
        handleCenterGraph,
        handleAddNode,
        handleAddEdges,
        handleToggleEdgeMode,
        handleDeleteSelected,
        isDeleteBtnDisabled:
            selectedNodes.length === 0 && selectedEdges.length === 0,
        isCompleteEdgeMode: edgeMode === 'complete',
        isEdgeModeLocked: directed,
    };
}
