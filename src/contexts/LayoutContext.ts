import { ParsedError } from '@/config/parsedError';
import type { LayoutContextProperties } from '@/types/layout';
import { createContext, useContext } from 'react';

export const LayoutContext = createContext<LayoutContextProperties | undefined>(
    undefined
);

export function useLayoutProperties() {
    const context = useContext(LayoutContext);

    if (context === undefined) {
        throw new ParsedError(
            'useLayoutProperties must be used within a LayoutProvider'
        );
    }

    return context;
}
