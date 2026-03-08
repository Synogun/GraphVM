import { ParsedError } from '@/config/parsedError';
import type { GraphWorkspaceContextProperties } from '@/types/workspace';
import { createContext, useContext } from 'react';

export const GraphWorkspaceContext = createContext<
    GraphWorkspaceContextProperties | undefined
>(undefined);

export function useGraphWorkspace() {
    const context = useContext(GraphWorkspaceContext);

    if (context === undefined) {
        throw new ParsedError(
            'useGraphWorkspace must be used within a GraphWorkspaceProvider'
        );
    }

    return context;
}
