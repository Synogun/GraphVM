import type { ToastData } from '@/types/ui/popups';
import { ToastsContext, useSettings } from '@Contexts';
import { Logger } from '@Logger';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';

const logger = Logger.createContextLogger('ToastsProvider');

export function ToastsProvider({ children }: Readonly<ToastsProviderProps>) {
    const {
        ui: {
            toast: { duration: defaultToastDuration },
        },
    } = useSettings();

    const defaultToastDurationRef = useRef(defaultToastDuration);
    useEffect(() => {
        defaultToastDurationRef.current = defaultToastDuration;
    }, [defaultToastDuration]);

    const [toastsPool, setToastsPool] = useState<ToastData[]>([]);
    const toastsTimeouts = useRef(new Map<string, NodeJS.Timeout>());
    const activeKeysRef = useRef(new Set<string>());

    const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
        const dedupeKey = `${toast.type ?? 'info'}:${toast.message}`;

        if (activeKeysRef.current.has(dedupeKey)) {
            return;
        }

        const id = crypto.randomUUID();
        activeKeysRef.current.add(dedupeKey);

        setToastsPool((prev) => [...prev, { id, ...toast }]);

        const filterNotId = (t: ToastData) => t.id !== id;
        const timeoutCallback = () => {
            setToastsPool((prev) => prev.filter(filterNotId));
            toastsTimeouts.current.delete(id);
            activeKeysRef.current.delete(dedupeKey);
        };

        const timeout = setTimeout(
            timeoutCallback,
            toast.duration ?? defaultToastDurationRef.current
        );

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
        setToastsPool((prev) => {
            const toast = prev.find((t) => t.id === id);
            if (toast) {
                activeKeysRef.current.delete(
                    `${toast.type ?? 'info'}:${toast.message}`
                );
            }
            return prev.filter((t) => t.id !== id);
        });
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
