import { GRAPH_MAX_ZOOM, GRAPH_MIN_ZOOM } from '@/constants';
import { useGraphHydration, useGraphMutation, useRegisterGraphByTab } from '@/hooks';
import {
    bindAutopan,
    destroyGraph,
    extractElementsInfo,
    newGraph,
    updateSelectionOrder,
} from '@/services/graph';
import { mountContextMenu } from '@/services/graph/contextMenusService';
import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import type { GraphInstance } from '@/types/graph';
import { useSettings, useToasts } from '@Contexts';
import type cytoscape from 'cytoscape';
import { useEffect, useLayoutEffect, useRef } from 'react';

export function GraphCanvas({
    graphId,
    containerId,
    tabId,
}: Readonly<GraphCanvasProps>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<GraphInstance>(null);

    const setSelectionInfo = useGraphSelectionStore((s) => s.setSelectionInfo);
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);

    const { addToast } = useToasts();
    const addToastRef = useRef(addToast);

    const { syncAll, syncSelection, syncMeta } = useGraphMutation(graphId);

    const {
        graph: { limits: graphLimits },
    } = useSettings();
    const graphLimitsRef = useRef(graphLimits);

    useEffect(() => {
        addToastRef.current = addToast;
    }, [addToast]);

    useEffect(() => {
        graphLimitsRef.current = graphLimits;
    }, [graphLimits]);

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
            const core = e.cy;
            const selectedElementsInfo = extractElementsInfo(core.$(':selected'));

            if (e.type === 'add' || e.type === 'remove') {
                core.removeData('generationFamily');
            }

            syncMeta(core);
            setSelectionInfo(selectedElementsInfo);
        };

        const handleElementSelection = (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;
            const core = e.cy;

            const targetNodes = target.filter('node').map((n) => n.id());
            const targetEdges = target.filter('edge').map((n) => n.id());

            updateSelectionOrder(
                core,
                e.type === 'unselect' ? 'remove' : 'add',
                targetNodes,
                targetEdges
            );

            const selectedElementsInfo = extractElementsInfo(core.$(':selected'));

            setSelectionInfo(selectedElementsInfo);
            syncSelection(core);
        };

        const handleZoom = (e: cytoscape.EventObject) => {
            const core = e.cy;
            const zoom = core.zoom();
            const center = { x: core.width() / 2, y: core.height() / 2 };
            if (zoom > GRAPH_MAX_ZOOM) {
                core.zoom({ level: GRAPH_MAX_ZOOM, renderedPosition: center });
            } else if (zoom < GRAPH_MIN_ZOOM) {
                core.zoom({ level: GRAPH_MIN_ZOOM, renderedPosition: center });
            }
        };

        newCore.on('select unselect', 'node, edge', handleElementSelection);
        newCore.on('add remove', 'node, edge', handleGraphMutation);
        newCore.on('data', 'node, edge', handleGraphMutation);
        newCore.on('zoom', handleZoom);

        const cleanupAutopan = bindAutopan(newCore);
        const cleanupContextMenu = mountContextMenu(newCore, {
            syncAll,
            graphLimits: graphLimitsRef,
            onError: (message) => {
                addToastRef.current({ type: 'error', message });
            },
            onBindError: (parsedError) => {
                addToastRef.current({
                    type: 'warning',
                    message:
                        'Context menu is unavailable right now. ' +
                        parsedError.message,
                });
            },
        });

        graphRef.current = newCore;

        return () => {
            cleanupAutopan();
            cleanupContextMenu();
            newCore.off('select unselect', 'node, edge', handleElementSelection);
            newCore.off('add remove', 'node, edge', handleGraphMutation);
            newCore.off('data', 'node, edge', handleGraphMutation);
            newCore.off('zoom', handleZoom);
            destroyGraph(newCore);
            graphRef.current = null;
        };
    }, [tabId, containerId, setSelectionInfo, syncAll, syncMeta, syncSelection]);

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
    useGraphHydration(graphId, tabId);

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
