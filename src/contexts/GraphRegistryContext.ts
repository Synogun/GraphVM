import { ParsedError } from '@/config/parsedError';
import type { GraphRegistryContextProperties } from '@/types/graph';
import { createContext, useContext } from 'react';

export const GraphRegistryContext = createContext<
    GraphRegistryContextProperties | undefined
>(undefined);

export function useGraphRegistry() {
    const context = useContext(GraphRegistryContext);

    if (context === undefined) {
        throw new ParsedError(
            'useGraphRegistry must be used within a GraphRegistryProvider'
        );
    }

    return context;
}
