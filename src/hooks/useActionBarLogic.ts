import { useEdgeMode, useElementActions, useGraphActions } from '@/hooks';
import { useModals } from '@Contexts';
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

    return {
        ...graphActions,
        ...elementActions,
        ...edgeModeProps,
        handleAlgorithms,
        handleImportExport,
        handleSettings,
        handleHelp,
    };
}
