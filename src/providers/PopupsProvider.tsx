import { DefaultSettingsData } from '@/constants/settingsDefaults';
import type { ToastData } from '@/types/popups';
import { PopupsContext } from '@Contexts';
import { Logger } from '@Logger';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

const logger = Logger.createContextLogger('PopupsProvider');

export function PopupsProvider({ children }: PopupsProviderProps) {
    const [isAlgorithmsModalOpen, setIsAlgorithmsModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

    const [toastsPool, setToastsPool] = useState<ToastData[]>([]);
    const toastsTimeouts = useRef(new Map<string, NodeJS.Timeout>());

    const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = (Date.now() * Math.random()).toString();
        setToastsPool((prev) => [...prev, { id, ...toast }]);

        const timeout = setTimeout(() => {
            setToastsPool((prev) => prev.filter((t) => t.id !== id));
            toastsTimeouts.current.delete(id);
        }, toast.duration ?? DefaultSettingsData.ui.toast.duration);

        switch (toast.type) {
            case 'error':
                logger.error(toast.message);
                break;
            case 'warning':
                logger.warn(toast.message);
                break;
            case 'info':
            case 'success':
            default:
                logger.info(toast.message);
                break;
        }

        toastsTimeouts.current.set(id, timeout);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToastsPool((prev) => prev.filter((toast) => toast.id !== id));
        const timeout = toastsTimeouts.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            toastsTimeouts.current.delete(id);
        }
    }, []);

    const modals = useMemo(
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
        [
            isAlgorithmsModalOpen,
            isHelpModalOpen,
            isSettingsModalOpen,
            isImportExportModalOpen,
        ]
    );

    const toasts = useMemo(
        () => ({
            pool: toastsPool,
            addToast,
            removeToast,
        }),
        [toastsPool, addToast, removeToast]
    );

    const value = useMemo(() => ({ modals, toasts }), [modals, toasts]);

    return <PopupsContext.Provider value={value}>{children}</PopupsContext.Provider>;
}

type PopupsProviderProps = {
    children: ReactNode;
};
