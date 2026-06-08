import { useAnimationStore } from '@/stores/animationStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import {
    formatShortcutInput,
    isEditableTarget,
    isShortcutMatch,
} from '@/utils/shortcuts';
import { useModals, useSettings } from '@Contexts';
import { useEffect } from 'react';

export function useAnimationShortcuts() {
    const { shortcuts } = useSettings();
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const {
        isAlgorithmsModalOpen,
        isHelpModalOpen,
        isSettingsModalOpen,
        isImportExportModalOpen,
    } = useModals();

    const isAnyModalOpen =
        isAlgorithmsModalOpen ||
        isHelpModalOpen ||
        isSettingsModalOpen ||
        isImportExportModalOpen;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isAnyModalOpen || isEditableTarget(event.target)) return;
            if (!activeTabId) return;

            const { tabs, play, pause, replay, stop, stepForward, stepBackward } =
                useAnimationStore.getState();

            const status = tabs[activeTabId]?.status ?? 'idle';
            if (status === 'idle') return;

            const shortcut = formatShortcutInput(event);
            if (!shortcut) return;

            let handled = false;

            if (isShortcutMatch(shortcuts.animPlayPause, shortcut)) {
                if (status === 'playing') {
                    pause(activeTabId);
                } else if (status === 'finished') {
                    replay(activeTabId);
                } else {
                    play(activeTabId);
                }
                handled = true;
            } else if (isShortcutMatch(shortcuts.animStepForward, shortcut)) {
                stepForward(activeTabId);
                handled = true;
            } else if (isShortcutMatch(shortcuts.animStepBackward, shortcut)) {
                stepBackward(activeTabId);
                handled = true;
            } else if (isShortcutMatch(shortcuts.animStop, shortcut)) {
                stop(activeTabId);
                handled = true;
            }

            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => {
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, [isAnyModalOpen, shortcuts, activeTabId]);
}
