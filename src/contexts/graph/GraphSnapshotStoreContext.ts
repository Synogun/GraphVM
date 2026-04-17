import { ParsedError } from '@/config/parsedError';
import type cytoscape from 'cytoscape';
import { createContext, useContext } from 'react';

export type GraphSnapshotStore = {
    getSnapshot: (tabId: string) => cytoscape.CytoscapeOptions | null;
    setSnapshot: (
        tabId: string,
        snapshot: cytoscape.CytoscapeOptions | null
    ) => void;
};

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
