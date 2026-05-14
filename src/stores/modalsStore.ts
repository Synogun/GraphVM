import type { ModalsContextProperties } from '@/types/ui/popups';
import { create } from 'zustand';

type ModalsStore = ModalsContextProperties;

export const useModalsStore = create<ModalsStore>()((set) => ({
    isAlgorithmsModalOpen: false,
    isHelpModalOpen: false,
    isSettingsModalOpen: false,
    isImportExportModalOpen: false,
    setIsAlgorithmsModalOpen: (isOpen) => {
        set({ isAlgorithmsModalOpen: isOpen });
    },
    setIsHelpModalOpen: (isOpen) => {
        set({ isHelpModalOpen: isOpen });
    },
    setIsSettingsModalOpen: (isOpen) => {
        set({ isSettingsModalOpen: isOpen });
    },
    setIsImportExportModalOpen: (isOpen) => {
        set({ isImportExportModalOpen: isOpen });
    },
    isNodeLabelModalOpen: false,
    setIsNodeLabelModalOpen: (isOpen) => {
        set({ isNodeLabelModalOpen: isOpen });
    },
}));
