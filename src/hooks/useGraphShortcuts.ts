import { useActionBarLogic } from '@/hooks/useActionBarLogic';
import type { ShortcutAction } from '@/types/settings';
import {
    formatShortcutInput,
    isEditableTarget,
    isShortcutMatch,
} from '@/utils/shortcuts';
import { useModals, useSettings } from '@Contexts';
import { useEffect, useMemo } from 'react';

export function useGraphShortcuts() {
    const { shortcuts } = useSettings();
    const {
        isAlgorithmsModalOpen,
        isHelpModalOpen,
        isSettingsModalOpen,
        isImportExportModalOpen,
    } = useModals();

    const {
        handleDeleteSelected,
        handleDeselectAll,
        handleSelectAll,
        handleNewGraph,
        handleAddNode,
        handleAddEdges,
        handleArrangeGraph,
        handleCenterGraph,
        handleToggleEdgeModeShortcut,
    } = useActionBarLogic();

    const isAnyModalOpen =
        isAlgorithmsModalOpen ||
        isHelpModalOpen ||
        isSettingsModalOpen ||
        isImportExportModalOpen;

    const actionHandlers = useMemo<Record<ShortcutAction, () => void>>(
        () => ({
            deleteSelected: handleDeleteSelected,
            deselectAll: handleDeselectAll,
            selectAll: handleSelectAll,
            newGraph: handleNewGraph,
            addNode: handleAddNode,
            addEdges: handleAddEdges,
            arrangeGraph: handleArrangeGraph,
            centerGraph: handleCenterGraph,
            toggleEdgeMode: handleToggleEdgeModeShortcut,
        }),
        [
            handleDeleteSelected,
            handleDeselectAll,
            handleSelectAll,
            handleNewGraph,
            handleAddNode,
            handleAddEdges,
            handleArrangeGraph,
            handleCenterGraph,
            handleToggleEdgeModeShortcut,
        ]
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isAnyModalOpen || isEditableTarget(event.target)) {
                return;
            }

            const shortcut = formatShortcutInput(event);
            if (!shortcut) {
                return;
            }

            const matchedAction = (
                Object.entries(shortcuts) as [ShortcutAction, string][]
            ).find(([, binding]) => isShortcutMatch(binding, shortcut));

            if (!matchedAction) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            actionHandlers[matchedAction[0]]();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isAnyModalOpen, shortcuts, actionHandlers]);
}
