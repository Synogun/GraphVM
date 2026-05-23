import { useAnimationLock, useEdgeMode, useElementActions, useGetGraph, useGraphActions } from '@/hooks';
import { buildShareUrl, encodeSharePayload, serializeGraph } from '@/services/persistence';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import type { SharePayload } from '@/types/workspace';
import { useModals, useToasts } from '@Contexts';
import { useCallback } from 'react';

export function useActionBarLogic() {
    const {
        setIsAlgorithmsModalOpen,
        setIsHelpModalOpen,
        setIsSettingsModalOpen,
        setIsImportExportModalOpen,
    } = useModals();

    const graphActions = useGraphActions();
    const elementActions = useElementActions();
    const edgeModeProps = useEdgeMode();
    const { isLocked: isAnimationLocked, lockTooltip } = useAnimationLock();

    const graphRef = useGetGraph('main-graph');
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const tabs = useGraphWorkspaceStore((s) => s.tabs);
    const { addToast } = useToasts();

    const handleAlgorithms = useCallback(() => {
        setIsAlgorithmsModalOpen(true);
    }, [setIsAlgorithmsModalOpen]);

    const handleImportExport = useCallback(() => {
        setIsImportExportModalOpen(true);
    }, [setIsImportExportModalOpen]);

    const handleSettings = useCallback(() => {
        setIsSettingsModalOpen(true);
    }, [setIsSettingsModalOpen]);

    const handleHelp = useCallback(() => {
        setIsHelpModalOpen(true);
    }, [setIsHelpModalOpen]);

    const handleShareGraph = useCallback(async () => {
        const core = graphRef.current;
        if (!core) {
            addToast({ type: 'error', message: 'Graph not ready. Please try again.' });
            return;
        }

        const activeTab = tabs.find((t) => t.id === activeTabId);
        const name = activeTab?.name ?? 'Shared Graph';
        const graph = serializeGraph(core);

        const payload: SharePayload = { v: 1, name, graph };
        const encoded = encodeSharePayload(payload);
        const url = buildShareUrl(encoded);

        try {
            await navigator.clipboard.writeText(url);
            addToast({ type: 'success', message: 'Share link copied to clipboard!' });
        } catch {
            addToast({ type: 'error', message: 'Could not copy to clipboard. Please copy the URL manually.' });
        }
    }, [graphRef, activeTabId, tabs, addToast]);

    return {
        ...graphActions,
        ...elementActions,
        ...edgeModeProps,
        handleAlgorithms,
        handleImportExport,
        handleSettings,
        handleHelp,
        handleShareGraph,
        isAnimationLocked,
        lockTooltip,
    };
}
