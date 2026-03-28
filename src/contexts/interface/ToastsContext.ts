import { ParsedError } from '@/config/parsedError';
import type { ToastContextProperties } from '@/types/popups';
import { createContext, useContext } from 'react';

export const ToastsContext = createContext<ToastContextProperties | undefined>(
    undefined
);

export function useToasts() {
    const context = useContext(ToastsContext);

    if (context === undefined) {
        throw new ParsedError('useToasts must be used within a ToastsProvider');
    }

    return context;
}
