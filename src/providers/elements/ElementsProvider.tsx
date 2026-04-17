import { type ReactNode } from 'react';
import {
    GraphMetaProvider,
    GraphRegistryProvider,
    GraphSelectionProvider,
    GraphSnapshotStoreProvider,
    GraphWorkspaceProvider,
} from '../graph';
import { EdgesProvider } from './EdgesProvider';
import { LayoutProvider } from './LayoutProvider';
import { NodesProvider } from './NodesProvider';

export function ElementsProvider({ children }: Readonly<ElementsProviderProps>) {
    return (
        <GraphWorkspaceProvider>
            <GraphSnapshotStoreProvider>
                <GraphRegistryProvider>
                    <GraphMetaProvider>
                        <GraphSelectionProvider>
                            <LayoutProvider>
                                <NodesProvider>
                                    <EdgesProvider>{children}</EdgesProvider>
                                </NodesProvider>
                            </LayoutProvider>
                        </GraphSelectionProvider>
                    </GraphMetaProvider>
                </GraphRegistryProvider>
            </GraphSnapshotStoreProvider>
        </GraphWorkspaceProvider>
    );
}

type ElementsProviderProps = {
    children: ReactNode;
};
