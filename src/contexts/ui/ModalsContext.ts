import { useModalsStore } from '@/stores/modalsStore';

export function useModals() {
    const isAlgorithmsModalOpen = useModalsStore((s) => s.isAlgorithmsModalOpen);
    const isHelpModalOpen = useModalsStore((s) => s.isHelpModalOpen);
    const isSettingsModalOpen = useModalsStore((s) => s.isSettingsModalOpen);
    const isImportExportModalOpen = useModalsStore((s) => s.isImportExportModalOpen);
    const setIsAlgorithmsModalOpen = useModalsStore(
        (s) => s.setIsAlgorithmsModalOpen
    );
    const setIsHelpModalOpen = useModalsStore((s) => s.setIsHelpModalOpen);
    const setIsSettingsModalOpen = useModalsStore((s) => s.setIsSettingsModalOpen);
    const setIsImportExportModalOpen = useModalsStore(
        (s) => s.setIsImportExportModalOpen
    );
    const isNodeLabelModalOpen = useModalsStore((s) => s.isNodeLabelModalOpen);
    const setIsNodeLabelModalOpen = useModalsStore((s) => s.setIsNodeLabelModalOpen);

    return {
        isAlgorithmsModalOpen,
        setIsAlgorithmsModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isImportExportModalOpen,
        setIsImportExportModalOpen,
        isNodeLabelModalOpen,
        setIsNodeLabelModalOpen,
    };
}
