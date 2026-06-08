import { useGetGraph } from '@/hooks';
import { useGraphMetaStore } from '@/stores/graphMetaStore';
import { useToasts } from '@Contexts';
import { useCallback, type ChangeEvent } from 'react';

export function useEdgeMode() {
    const graphRef = useGetGraph('main-graph');
    const directed = useGraphMetaStore((s) => s.directed);
    const edgeMode = useGraphMetaStore((s) => s.edgeMode);
    const setEdgeMode = useGraphMetaStore((s) => s.setEdgeMode);
    const { addToast } = useToasts();

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
