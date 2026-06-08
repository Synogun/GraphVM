import { loadWorkspaceState } from '@/services/persistence';
import { GraphSnapshotStoreContext } from '@Contexts';
import type cytoscape from 'cytoscape';
import { useMemo, type ReactNode } from 'react';

export function GraphSnapshotStoreProvider({
    children,
}: Readonly<GraphSnapshotStoreProviderProps>) {
    const store = useMemo(() => {
        const persisted = loadWorkspaceState();
        const snapshots = new Map<string, cytoscape.CytoscapeOptions | null>(
            persisted?.tabs.map((tab) => [tab.id, tab.graph]) ?? []
        );

        return {
            getSnapshot: (tabId: string) => snapshots.get(tabId) ?? null,
            setSnapshot: (
                tabId: string,
                snapshot: cytoscape.CytoscapeOptions | null
            ) => {
                snapshots.set(tabId, snapshot);
            },
            deleteSnapshot: (tabId: string) => {
                snapshots.delete(tabId);
            },
        };
    }, []);

    return (
        <GraphSnapshotStoreContext.Provider value={store}>
            {children}
        </GraphSnapshotStoreContext.Provider>
    );
}

type GraphSnapshotStoreProviderProps = {
    children: ReactNode;
};
