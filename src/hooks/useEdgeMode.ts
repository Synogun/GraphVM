import { useGraphMeta, useToasts } from '@Contexts';
import { useCallback, useEffect, type ChangeEvent } from 'react';

export function useEdgeMode() {
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

    const handleToggleEdgeModeShortcut = useCallback(() => {
        if (directed) {
            addToast({
                type: 'warning',
                message: 'Edge mode is locked to path while graph is directed.',
            });
            return;
        }

        setEdgeMode(edgeMode === 'complete' ? 'path' : 'complete');
    }, [directed, edgeMode, setEdgeMode, addToast]);

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

    return {
        edgeMode,
        handleToggleEdgeMode,
        handleToggleEdgeModeShortcut,
        isCompleteEdgeMode: edgeMode === 'complete',
        isEdgeModeLocked: directed,
    };
}
