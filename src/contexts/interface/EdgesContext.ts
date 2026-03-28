import { ParsedError } from '@/config/parsedError';
import type { EdgesContextProperties } from '@/types/edges';
import { createContext, useContext } from 'react';

export const EdgesContext = createContext<EdgesContextProperties | undefined>(
    undefined
);

export function useEdgesProperties() {
    const context = useContext(EdgesContext);

    if (context === undefined) {
        throw new ParsedError(
            'useEdgesProperties must be used within an EdgesProvider'
        );
    }

    return context;
}
