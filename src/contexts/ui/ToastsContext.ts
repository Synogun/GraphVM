import { useToastsStore } from '@/stores/toastsStore';

export function useToasts() {
    const pool = useToastsStore((s) => s.pool);
    const addToast = useToastsStore((s) => s.addToast);
    const removeToast = useToastsStore((s) => s.removeToast);

    return { pool, addToast, removeToast };
}
