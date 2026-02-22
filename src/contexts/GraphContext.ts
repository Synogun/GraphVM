import { ParsedError } from '@/config/parsedError';
import type { GraphContextProperties } from '@/types/graph';
import { createContext, useContext } from 'react';

export const GraphContext = createContext<GraphContextProperties | undefined>(
    undefined
);

export function useGraphProperties() {
    const context = useContext(GraphContext);

    if (context === undefined) {
        throw new ParsedError(
            'useGraphProperties must be used within a GraphProvider'
        );
    }

    return context;
}
