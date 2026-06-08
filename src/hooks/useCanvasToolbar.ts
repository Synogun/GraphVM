import { GRAPH_MAX_ZOOM, GRAPH_MIN_ZOOM, ParsedErrorToasts } from '@/constants';
import { useGraphActions } from '@/hooks/useGraphActions';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { useToasts } from '@Contexts';
import type cytoscape from 'cytoscape';
import { useCallback, useEffect, useState } from 'react';

const ZOOM_FACTOR = 1.25;

function viewportCenter(core: cytoscape.Core) {
    return { x: core.width() / 2, y: core.height() / 2 };
}

export function useCanvasToolbar() {
    const graphRef = useGetGraph('main-graph');
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const { handleArrangeGraph, handleCenterGraph } = useGraphActions();
    const { addToast } = useToasts();
    const [zoomPercent, setZoomPercent] = useState(100);

    useEffect(() => {
        const core = graphRef.current;
        if (!core) return;

        const onZoom = () => {
            setZoomPercent(Math.round(core.zoom() * 100));
        };
        core.on('zoom', onZoom);
        setZoomPercent(Math.round(core.zoom() * 100));

        return () => {
            core.off('zoom', onZoom);
        };
    }, [activeTabId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleZoomIn = useCallback(() => {
        const core = graphRef.current;
        if (!core) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }
        core.zoom({
            level: Math.min(core.zoom() * ZOOM_FACTOR, GRAPH_MAX_ZOOM),
            renderedPosition: viewportCenter(core),
        });
    }, [graphRef, addToast]);

    const handleZoomOut = useCallback(() => {
        const core = graphRef.current;
        if (!core) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }
        core.zoom({
            level: Math.max(core.zoom() / ZOOM_FACTOR, GRAPH_MIN_ZOOM),
            renderedPosition: viewportCenter(core),
        });
    }, [graphRef, addToast]);

    const handleZoomTo = useCallback(
        (percent: number) => {
            const core = graphRef.current;
            if (!core) return;
            const clamped = Math.max(
                GRAPH_MIN_ZOOM * 100,
                Math.min(GRAPH_MAX_ZOOM * 100, percent)
            );
            core.zoom({
                level: clamped / 100,
                renderedPosition: viewportCenter(core),
            });
        },
        [graphRef]
    );

    return {
        handleArrangeGraph,
        handleCenterGraph,
        handleZoomIn,
        handleZoomOut,
        handleZoomTo,
        zoomPercent,
    };
}
