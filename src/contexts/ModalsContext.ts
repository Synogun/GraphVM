import { ParsedError } from '@/config/parsedError';
import type { ModalsContextProperties } from '@/types/popups';
import { createContext, useContext } from 'react';

export const ModalsContext = createContext<ModalsContextProperties | undefined>(
    undefined
);

export function useModals() {
    const context = useContext(ModalsContext);

    if (context === undefined) {
        throw new ParsedError('useModals must be used within a ModalsProvider');
    }

    return context;
}
