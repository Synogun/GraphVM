import { ParsedError } from '@/config/parsedError';
import type { GraphMetaContextProperties } from '@/types/graph';
import { createContext, useContext } from 'react';

export const GraphMetaContext = createContext<
    GraphMetaContextProperties | undefined
>(undefined);

export function useGraphMeta() {
    const context = useContext(GraphMetaContext);

    if (context === undefined) {
        throw new ParsedError(
            'useGraphMeta must be used within a GraphMetaProvider'
        );
    }

    return context;
}
