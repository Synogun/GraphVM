import { useGetGraph } from '@/hooks';
import { useGraphMeta, useToasts } from '@Contexts';
import { useCallback, useEffect, type ChangeEvent } from 'react';

export function useEdgeMode() {
    const graphRef = useGetGraph('main-graph');
    const {
        directed,
        edges: { edgeMode, setEdgeMode },
    } = useGraphMeta();
    const { addToast } = useToasts();

    useEffect(() => {
        if (directed && edgeMode === 'complete') {
            setEdgeMode('path');
        }
    }, [directed, edgeMode, setEdgeMode]);

    const persistEdgeMode = useCallback(
        (newMode: 'path' | 'complete') => {
            setEdgeMode(newMode);
            const core = graphRef.current;
            if (core) {
                core.data('edgeMode', newMode);
            }
        },
        [graphRef, setEdgeMode]
    );

    const handleToggleEdgeModeShortcut = useCallback(() => {
        if (directed) {
            addToast({
                type: 'warning',
                message: 'Edge mode is locked to path while graph is directed.',
            });
            return;
        }

        persistEdgeMode(edgeMode === 'complete' ? 'path' : 'complete');
    }, [directed, edgeMode, persistEdgeMode, addToast]);

    const handleToggleEdgeMode = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (directed) {
                addToast({
                    type: 'warning',
                    message: 'Edge mode is locked to path while graph is directed.',
                });
                return;
            }
            persistEdgeMode(e.target.checked ? 'complete' : 'path');
        },
        [directed, persistEdgeMode, addToast]
    );

    return {
        edgeMode,
        handleToggleEdgeMode,
        handleToggleEdgeModeShortcut,
        isCompleteEdgeMode: edgeMode === 'complete',
        isEdgeModeLocked: directed,
    };
}
