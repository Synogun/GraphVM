import { ParsedError } from '@/config/parsedError';
import type { NodeContextProperties } from '@/types/nodes';
import { createContext, useContext } from 'react';

export const NodesContext = createContext<NodeContextProperties | undefined>(
    undefined
);

export function useNodeProperties() {
    const context = useContext(NodesContext);

    if (context === undefined) {
        throw new ParsedError(
            'useNodeProperties must be used within a NodesProvider'
        );
    }
    return context;
}
