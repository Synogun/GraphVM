import { createContext, useContext } from 'react';

export const ModalsContext = createContext<ModalsContextProperties | undefined>(
    undefined
);

export function useModals() {
    const context = useContext(ModalsContext);

    if (context === undefined) {
        throw new Error('useModals must be used within a ModalsProvider');
    }

    return context;
}

export type ModalsContextProperties = {
    isAlgorithmsModalOpen: boolean;
    setIsAlgorithmsModalOpen: (isOpen: boolean) => void;
    isHelpModalOpen: boolean;
    setIsHelpModalOpen: (isOpen: boolean) => void;
    isSettingsModalOpen: boolean;
    setIsSettingsModalOpen: (isOpen: boolean) => void;
    isImportExportModalOpen: boolean;
    setIsImportExportModalOpen: (isOpen: boolean) => void;
};
