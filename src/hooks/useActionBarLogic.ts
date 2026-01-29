import { useGraphProperties } from '@/contexts/GraphContext';
import { useLayoutProperties } from '@/contexts/LayoutContext';
import { useModals } from '@/contexts/ModalsContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { addEdges, removeEdges } from '@/services/EdgesService';
import { arrangeGraph, centerGraph } from '@/services/LayoutService';
import { addNode, removeNodes } from '@/services/NodesService';
import { isArrayOfStrings } from '@/types/typeGuards';
import { Logger } from '@Logger';
import { useCallback, type ChangeEvent } from 'react';

const logger = Logger.createContextLogger('ActionBarLogic');

const DEFAULT_LAYOUT = { name: 'circle' };

export function useActionBarLogic() {
    const {
        nodes: { setCount: setNodeCount, selected: selectedNodes, setSelected: setSelectedNodes },
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

    const handleNewGraph = useCallback(() => {
        location.reload();
    }, []);

    const handleAlgorithms = useCallback(() => {
        setIsAlgorithmsModalOpen(true);
    }, [setIsAlgorithmsModalOpen]);

    const handleImportExport = useCallback(() => {
        setIsImportExportModalOpen(true);
    }, [setIsImportExportModalOpen]);

    const handleArrangeGraph = useCallback(() => {
        const cy = graphRef.current;
        if (!cy) return;

        arrangeGraph(cy, currentLayout ?? DEFAULT_LAYOUT);
    }, [graphRef, currentLayout]);

    const handleSettings = useCallback(() => {
        setIsSettingsModalOpen(true);
    }, [setIsSettingsModalOpen]);

    const handleHelp = useCallback(() => {
        setIsHelpModalOpen(true);
    }, [setIsHelpModalOpen]);

    const handleCenterGraph = useCallback(() => {
        const cy = graphRef.current;
        if (!cy) return;

        const currentSelected = cy.elements(':selected');
        centerGraph(cy, currentSelected, 30);
    }, [graphRef]);

    const handleAddNode = useCallback(() => {
        const cy = graphRef.current;
        if (!cy) return;

        addNode(cy);
        setNodeCount(cy.nodes().length);
        handleArrangeGraph();
    }, [graphRef, setNodeCount, handleArrangeGraph]);

    const handleAddEdges = useCallback(() => {
        const cy = graphRef.current;
        if (!cy) return;

        const currentSelectedNodes: unknown = cy.data('nodeSelectionOrder');

        if (!isArrayOfStrings(currentSelectedNodes)) {
            logger.error('Invalid selection order data');
            return;
        }

        if (currentSelectedNodes.length < 2) {
            logger.warn('Select at least two nodes to create an edge.');
            return;
        }

        addEdges(cy, {}, edgeMode, currentSelectedNodes);
        setEdgeCount(cy.edges().length);
        handleArrangeGraph();
    }, [edgeMode, graphRef, handleArrangeGraph, setEdgeCount]);

    const handleToggleEdgeMode = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setEdgeMode(e.target.checked ? 'complete' : 'path');
        },
        [setEdgeMode]
    );

    const handleDeleteSelected = useCallback(() => {
        if (!graphRef.current) {
            return;
        }

        let selectedElements = graphRef.current.elements(':selected');
        if (selectedElements.length === 0) {
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
            removeEdges(graphRef.current, edgesToRemove);

            setSelectedEdges([]);
            setEdgeCount(graphRef.current.edges().length);
            graphRef.current.data('edgeSelectionOrder', []);
        }
    }, [graphRef, setSelectedNodes, setNodeCount, setSelectedEdges, setEdgeCount]);

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
        isDeleteBtnDisabled: selectedNodes.length === 0 && selectedEdges.length === 0,
        isCompleteEdgeMode: edgeMode === 'complete',
    };
}
