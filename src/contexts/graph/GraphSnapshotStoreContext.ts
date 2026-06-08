import { ParsedError } from '@/config/parsedError';
import type { GraphSnapshotStore } from '@/types/workspace';
import { createContext, useContext } from 'react';

export const GraphSnapshotStoreContext = createContext<
    GraphSnapshotStore | undefined
>(undefined);

export function useSnapshotStore(): GraphSnapshotStore {
    const context = useContext(GraphSnapshotStoreContext);

    if (context === undefined) {
        throw new ParsedError(
            'useSnapshotStore must be used within a GraphSnapshotStoreProvider'
        );
    }

    return context;
}
