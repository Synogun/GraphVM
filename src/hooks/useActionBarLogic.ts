import { ParsedErrorToastEnum, parseError } from '@/config/parsedError';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { addEdges, removeEdges } from '@/services/edgesService';
import { arrangeGraph, centerGraph } from '@/services/layoutService';
import { addNode, removeNodes } from '@/services/nodesService';
import { isArrayOfStrings } from '@/types/typeGuards';
import {
    useGraphProperties,
    useLayoutProperties,
    useModals,
    useToasts,
} from '@Contexts';
import { useCallback, useEffect, type ChangeEvent } from 'react';

const DEFAULT_LAYOUT = { name: 'circle' };

export function useActionBarLogic() {
    const {
        directed,
        setDirected,
        nodes: {
            setCount: setNodeCount,
            selected: selectedNodes,
            setSelected: setSelectedNodes,
        },
        edges: {
            edgeMode,
            setEdgeMode,
            selected: selectedEdges,
            setSelected: setSelectedEdges,
            setCount: setEdgeCount,
        },
    } = useGraphProperties();

    const {
        setIsAlgorithmsModalOpen,
        setIsHelpModalOpen,
        setIsSettingsModalOpen,
        setIsImportExportModalOpen,
    } = useModals();

    const { current: currentLayout } = useLayoutProperties();
    const graphRef = useGetGraph('main-graph');

    const { addToast } = useToasts();

    useEffect(() => {
        if (directed && edgeMode === 'complete') {
            setEdgeMode('path');
        }
    }, [directed, edgeMode, setEdgeMode]);

    const handleNewGraph = useCallback(() => {
        const graph = graphRef.current;

        if (!graph) {
            addToast(ParsedErrorToastEnum.GraphNotFound);
            return;
        }

        graph.elements().remove();
        graph.data('directed', false);
        setNodeCount(0);
        setEdgeCount(0);
        setSelectedNodes([]);
        setSelectedEdges([]);
        graph.data('nodeSelectionOrder', []);
        graph.data('edgeSelectionOrder', []);
        setDirected(false);
    }, [
        graphRef,
        setDirected,
        setEdgeCount,
        setNodeCount,
        setSelectedEdges,
        setSelectedNodes,
        addToast,
    ]);

    const handleAlgorithms = useCallback(() => {
        setIsAlgorithmsModalOpen(true);
    }, [setIsAlgorithmsModalOpen]);

    const handleImportExport = useCallback(() => {
        setIsImportExportModalOpen(true);
    }, [setIsImportExportModalOpen]);

    const handleArrangeGraph = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToastEnum.GraphNotFound);
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
            addToast(ParsedErrorToastEnum.GraphNotFound);
            return;
        }

        const currentSelected = graph.elements(':selected');

        //TODO: add default padding to graph properties
        centerGraph(graph, currentSelected, 30);
    }, [graphRef, addToast]);

    const handleAddNode = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToastEnum.GraphNotFound);
            return;
        }

        addNode(graph);
        setNodeCount(graph.nodes().length);
        handleArrangeGraph();
    }, [graphRef, setNodeCount, handleArrangeGraph, addToast]);

    const handleAddEdges = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToastEnum.GraphNotFound);
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
            addEdges(graph, currentSelectedNodes, edgeMode);
        } catch (error: unknown) {
            const parsedError = parseError(error);
            addToast({ type: 'error', message: parsedError.message });
            return;
        }

        setEdgeCount(graph.edges().length);
        handleArrangeGraph();
    }, [graphRef, edgeMode, setEdgeCount, handleArrangeGraph, addToast]);

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
            addToast(ParsedErrorToastEnum.GraphNotFound);
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

            setSelectedNodes([]);
            setNodeCount(graphRef.current.nodes().length);
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

            setSelectedEdges([]);
            setEdgeCount(graphRef.current.edges().length);
            graphRef.current.data('edgeSelectionOrder', []);
        }
    }, [
        graphRef,
        setSelectedNodes,
        setNodeCount,
        setSelectedEdges,
        setEdgeCount,
        addToast,
    ]);

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
