import { useAnimationLock } from '@/hooks';
import { isEditableTarget } from '@/utils/shortcuts';
import { useModals, useToasts } from '@Contexts';
import { useEffect } from 'react';
import { useClipboardActions } from './useClipboardActions';

export function useClipboardShortcuts() {
    const { handleCopy, handleCut, handlePaste } = useClipboardActions();
    const { isLocked } = useAnimationLock();
    const { addToast } = useToasts();
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
            if (!(event.ctrlKey || event.metaKey)) return;

            if (event.key === 'c') {
                event.preventDefault();
                void handleCopy();
            } else if (event.key === 'x') {
                event.preventDefault();
                if (isLocked) {
                    addToast({
                        type: 'warning',
                        message: 'Stop the animation to edit the graph.',
                    });
                    return;
                }
                void handleCut();
            } else if (event.key === 'v') {
                event.preventDefault();
                if (isLocked) {
                    addToast({
                        type: 'warning',
                        message: 'Stop the animation to edit the graph.',
                    });
                    return;
                }
                void handlePaste();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isAnyModalOpen, isLocked, handleCopy, handleCut, handlePaste, addToast]);
}
