import { useGraphMutation } from '@/hooks/useGraphMutation';
import {
    bindAutopan,
    destroyGraph,
    extractElementsInfo,
    newGraph,
} from '@/services/graph';
import { bindContextMenu } from '@/services/graph/contextMenusService';
import type { GraphInstance } from '@/types/graph';
import {
    useGraphSelection,
    useGraphWorkspace,
    useSettings,
    useToasts,
} from '@Contexts';
import type cytoscape from 'cytoscape';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRegisterGraphByTab } from '../hooks/useGraphRegistry';
import { isArrayOfStrings } from '../types/typeGuards';

export function GraphCanvas({
    graphId,
    containerId,
    tabId,
}: Readonly<GraphCanvasProps>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<GraphInstance>(null);

    const {
        selectionInfo: { setInfo: setSelectionInfo },
    } = useGraphSelection();

    const { activeTabId, markTabPendingSave } = useGraphWorkspace();

    const { addToast } = useToasts();
    const addToastRef = useRef(addToast);

    const { syncAll, syncSelection, syncMeta } = useGraphMutation(graphId);

    const {
        graph: { limits: graphLimits },
    } = useSettings();

    useEffect(() => {
        addToastRef.current = addToast;
    }, [addToast]);

    useEffect(() => {
        if (!containerRef.current) {
            addToastRef.current({
                type: 'error',
                message: 'Graph container not found. Please try again.',
            });
            return;
        }

        const newCore = newGraph(containerId, {
            data: {
                nodeSelectionOrder: [],
                edgeSelectionOrder: [],
            },
        });

        const handleGraphMutation = (e: cytoscape.EventObject) => {
            if (!tabId) {
                return;
            }

            const core = e.cy;
            const selectedElementsInfo = extractElementsInfo(core.$(':selected'));

            syncMeta(core);

            setSelectionInfo(selectedElementsInfo);
            markTabPendingSave(tabId);
        };

        const handleElementSelection = (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;
            const core = e.cy;

            const currentSelectedNodes: unknown = core.data('nodeSelectionOrder');
            const currentSelectedEdges: unknown = core.data('edgeSelectionOrder');

            if (
                !isArrayOfStrings(currentSelectedNodes) ||
                !isArrayOfStrings(currentSelectedEdges)
            ) {
                const message = 'Invalid selection order data.';
                addToastRef.current({ type: 'error', message });
                return;
            }
            const targetNodes = target.filter('node').map((n) => n.id());
            const targetEdges = target.filter('edge').map((n) => n.id());

            let nodeSelectionOrder = [...currentSelectedNodes, ...targetNodes];
            let edgeSelectionOrder = [...currentSelectedEdges, ...targetEdges];

            if (e.type === 'unselect') {
                nodeSelectionOrder = nodeSelectionOrder.filter(
                    (id) => !targetNodes.includes(id)
                );
                edgeSelectionOrder = edgeSelectionOrder.filter(
                    (id) => !targetEdges.includes(id)
                );
            }

            core.data('nodeSelectionOrder', nodeSelectionOrder);
            core.data('edgeSelectionOrder', edgeSelectionOrder);

            const selectedElementsInfo = extractElementsInfo(core.$(':selected'));

            setSelectionInfo(selectedElementsInfo);
            syncSelection(core);
        };

        newCore.on('select unselect', 'node, edge', handleElementSelection);
        newCore.on('add remove', 'node, edge', handleGraphMutation);
        newCore.on('data', 'node, edge', handleGraphMutation);

        const cleanupAutopan = bindAutopan(newCore);
        const cleanupContextMenu = bindContextMenu(newCore, syncAll, graphLimits);

        graphRef.current = newCore;

        return () => {
            cleanupAutopan();
            cleanupContextMenu();
            newCore.off('select unselect', 'node, edge', handleElementSelection);
            newCore.off('add remove', 'node, edge', handleGraphMutation);
            newCore.off('data', 'node, edge', handleGraphMutation);
            destroyGraph(newCore);
            graphRef.current = null;
        };
    }, [
        tabId,
        containerId,
        graphLimits,
        markTabPendingSave,
        setSelectionInfo,
        syncAll,
        syncMeta,
        syncSelection,
    ]);

    useLayoutEffect(() => {
        if (!tabId || activeTabId !== tabId) {
            return;
        }

        const frameId = requestAnimationFrame(() => {
            const core = graphRef.current;

            if (!core) {
                return;
            }

            core.resize();
            core.fit(core.elements(), 30);
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [activeTabId, tabId]);

    useRegisterGraphByTab(graphId, graphRef, tabId);

    return (
        <div
            className="h-full w-full bg-base-100"
            ref={containerRef}
            id={containerId}
        />
    );
}

type GraphCanvasProps = {
    graphId: string;
    containerId: string;
    tabId?: string;
};
