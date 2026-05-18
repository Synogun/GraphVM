import { ParsedErrorToasts } from '@/constants';
import { useGraphActions } from '@/hooks/useGraphActions';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { useToasts } from '@Contexts';
import { useCallback, useEffect, useState } from 'react';

const ZOOM_FACTOR = 1.25;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;

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
        core.zoom(Math.min(core.zoom() * ZOOM_FACTOR, MAX_ZOOM));
    }, [graphRef, addToast]);

    const handleZoomOut = useCallback(() => {
        const core = graphRef.current;
        if (!core) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }
        core.zoom(Math.max(core.zoom() / ZOOM_FACTOR, MIN_ZOOM));
    }, [graphRef, addToast]);

    const handleZoomTo = useCallback(
        (percent: number) => {
            const core = graphRef.current;
            if (!core) return;
            const clamped = Math.max(
                MIN_ZOOM * 100,
                Math.min(MAX_ZOOM * 100, percent)
            );
            core.zoom(clamped / 100);
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
