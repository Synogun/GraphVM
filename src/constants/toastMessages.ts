import type { ToastData } from '@/types/ui/popups';

export const ParsedErrorToasts: Record<string, Omit<ToastData, 'id'>> = {
    GraphNotFound: { type: 'error', message: 'Graph instance not found.' },
};
