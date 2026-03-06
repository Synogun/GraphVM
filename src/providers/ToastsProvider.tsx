import { DefaultSettingsData } from '@/constants/settingsDefaults';
import type { ToastData } from '@/types/popups';
import { ToastsContext } from '@Contexts';
import { Logger } from '@Logger';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

const logger = Logger.createContextLogger('ToastsProvider');

export function ToastsProvider({ children }: ToastsProviderProps) {
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

    const value = useMemo(
        () => ({
            pool: toastsPool,
            addToast,
            removeToast,
        }),
        [toastsPool, addToast, removeToast]
    );

    return <ToastsContext.Provider value={value}>{children}</ToastsContext.Provider>;
}

type ToastsProviderProps = {
    children: ReactNode;
};
