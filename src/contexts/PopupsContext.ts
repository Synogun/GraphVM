import { ParsedError } from '@/config/parsedError';
import type { PopupsContextProperties } from '@/types/popups';
import { createContext, useContext } from 'react';

export const PopupsContext = createContext<PopupsContextProperties | undefined>(
    undefined
);

export function useModals() {
    const context = useContext(PopupsContext);

    if (context === undefined) {
        throw new ParsedError('useModals must be used within a PopupsProvider');
    }

    return context.modals;
}

export function useToasts() {
    const context = useContext(PopupsContext);

    if (context === undefined) {
        throw new ParsedError('useToasts must be used within a PopupsProvider');
    }

    return context.toasts;
}
