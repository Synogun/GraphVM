import { ParsedError } from '@/config/parsedError';
import type { SettingsContextProperties } from '@/types/settings';
import { createContext, useContext } from 'react';

export const SettingsContext = createContext<SettingsContextProperties | undefined>(
    undefined
);

export function useSettings() {
    const context = useContext(SettingsContext);

    if (context === undefined) {
        throw new ParsedError('useSettings must be used within a SettingsProvider');
    }

    return context;
}
