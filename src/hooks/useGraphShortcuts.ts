import {
    useAnimationLock,
    useEdgeMode,
    useElementActions,
    useGraphActions,
} from '@/hooks';
import type { ShortcutAction } from '@/types/ui/settings';
import {
    formatShortcutInput,
    isEditableTarget,
    isShortcutMatch,
} from '@/utils/shortcuts';
import { useModals, useSettings, useToasts } from '@Contexts';
import { useEffect, useMemo } from 'react';

const MUTATION_SHORTCUT_ACTIONS = new Set<ShortcutAction>([
    'addNode',
    'addEdges',
    'deleteSelected',
    'newGraph',
]);

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
        handleArrangeGraph,
        handleCenterGraph,
    } = useGraphActions();
    const { handleAddNode, handleAddEdges } = useElementActions();
    const { handleToggleEdgeModeShortcut } = useEdgeMode();
    const { isLocked } = useAnimationLock();
    const { addToast } = useToasts();

    const isAnyModalOpen =
        isAlgorithmsModalOpen ||
        isHelpModalOpen ||
        isSettingsModalOpen ||
        isImportExportModalOpen;

    const actionHandlers = useMemo<Partial<Record<ShortcutAction, () => void>>>(
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

            const handler = actionHandlers[matchedAction[0]];
            if (!handler) return;

            event.preventDefault();
            event.stopPropagation();

            if (isLocked && MUTATION_SHORTCUT_ACTIONS.has(matchedAction[0])) {
                addToast({
                    type: 'warning',
                    message: 'Stop the animation to edit the graph.',
                });
                return;
            }

            handler();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isAnyModalOpen, shortcuts, actionHandlers, isLocked, addToast]);
}
