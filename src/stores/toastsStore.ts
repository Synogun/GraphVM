import { Logger } from '@Logger';
import type { ToastData } from '@/types/ui/popups';
import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';

const logger = Logger.createContextLogger('toastsStore');

type ToastsStore = {
    pool: ToastData[];
    _timeouts: Map<string, NodeJS.Timeout>;
    _activeKeys: Set<string>;
    addToast: (toast: Omit<ToastData, 'id'>) => void;
    removeToast: (id: string) => void;
};

export const useToastsStore = create<ToastsStore>()((set, get) => ({
    pool: [],
    _timeouts: new Map(),
    _activeKeys: new Set(),

    addToast: (toast) => {
        const { _activeKeys, _timeouts } = get();
        const dedupeKey = `${toast.type ?? 'info'}:${toast.message}`;

        if (_activeKeys.has(dedupeKey)) {
            return;
        }

        const id = crypto.randomUUID();
        _activeKeys.add(dedupeKey);
        set((s) => ({ pool: [...s.pool, { id, ...toast }] }));

        const duration =
            toast.duration ?? useSettingsStore.getState().ui.toast.duration;

        const timeout = setTimeout(() => {
            set((s) => ({ pool: s.pool.filter((t) => t.id !== id) }));
            _timeouts.delete(id);
            _activeKeys.delete(dedupeKey);
        }, duration);

        _timeouts.set(id, timeout);

        switch (toast.type) {
            case 'error':
                logger.error(toast.message);
                break;
            case 'warning':
                logger.warn(toast.message);
                break;
            default:
                logger.info(toast.message);
                break;
        }
    },

    removeToast: (id) => {
        const { _activeKeys, _timeouts } = get();
        set((s) => {
            const toast = s.pool.find((t) => t.id === id);
            if (toast) {
                _activeKeys.delete(`${toast.type ?? 'info'}:${toast.message}`);
            }
            return { pool: s.pool.filter((t) => t.id !== id) };
        });

        const timeout = _timeouts.get(id);
        if (timeout) {
            clearTimeout(timeout);
            _timeouts.delete(id);
        }
    },
}));
