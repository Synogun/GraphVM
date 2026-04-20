import { type ReactNode } from 'react';
import { ElementsProvider } from './elements';
import {
    GraphMetaProvider,
    GraphRegistryProvider,
    GraphSelectionProvider,
    GraphSnapshotStoreProvider,
    GraphWorkspaceProvider,
} from './graph';

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
    return (
        <GraphWorkspaceProvider>
            <GraphSnapshotStoreProvider>
                <GraphRegistryProvider>
                    <GraphMetaProvider>
                        <GraphSelectionProvider>
                            <ElementsProvider>{children}</ElementsProvider>
                        </GraphSelectionProvider>
                    </GraphMetaProvider>
                </GraphRegistryProvider>
            </GraphSnapshotStoreProvider>
        </GraphWorkspaceProvider>
    );
}

type AppProvidersProps = {
    children: ReactNode;
};
