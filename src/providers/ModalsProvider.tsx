import { ModalsContext } from '@/contexts/ModalsContext';
import { useMemo, useState, type ReactNode } from 'react';

export function ModalsProvider({ children }: ModalsProviderProps) {
    const [isAlgorithmsModalOpen, setIsAlgorithmsModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

    const value = useMemo(
        () => ({
            isAlgorithmsModalOpen,
            setIsAlgorithmsModalOpen,
            isHelpModalOpen,
            setIsHelpModalOpen,
            isSettingsModalOpen,
            setIsSettingsModalOpen,
            isImportExportModalOpen,
            setIsImportExportModalOpen,
        }),
        [isAlgorithmsModalOpen, isHelpModalOpen, isSettingsModalOpen, isImportExportModalOpen]
    );

    return <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>;
}

type ModalsProviderProps = {
    children: ReactNode;
};
