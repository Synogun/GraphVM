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

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export type ToastData = {
    id: string;
    icon?: React.ReactNode;
    title?: string;
    message: string;
    type?: ToastType;
    duration?: number;
};

export type ToastContextProperties = {
    pool: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => void;
    removeToast: (id: string) => void;
};

export type PopupsContextProperties = {
    modals: ModalsContextProperties;
    toasts: ToastContextProperties;
};
