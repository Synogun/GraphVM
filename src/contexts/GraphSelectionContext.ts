import { ParsedError } from '@/config/parsedError';
import type { GraphSelectionContextProperties } from '@/types/graph';
import { createContext, useContext } from 'react';

export const GraphSelectionContext = createContext<
    GraphSelectionContextProperties | undefined
>(undefined);

export function useGraphSelection() {
    const context = useContext(GraphSelectionContext);

    if (context === undefined) {
        throw new ParsedError(
            'useGraphSelection must be used within a GraphSelectionProvider'
        );
    }

    return context;
}
