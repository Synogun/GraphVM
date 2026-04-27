import { useMemo, type ReactNode } from 'react';
import { ElementsProvider } from './elements';
import {
    GraphMetaProvider,
    GraphRegistryProvider,
    GraphSelectionProvider,
    GraphSnapshotStoreProvider,
    GraphWorkspaceProvider,
} from './graph';

import { IconContext } from 'react-icons';
import { ModalsProvider, SettingsProvider, ToastsProvider } from './ui';

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
    const iconStyle = useMemo(() => ({ style: { verticalAlign: 'middle' } }), []);

    return (
        <IconContext.Provider value={iconStyle}>
            <SettingsProvider>
                <ToastsProvider>
                    <ModalsProvider>
                        <GraphWorkspaceProvider>
                            <GraphSnapshotStoreProvider>
                                <GraphRegistryProvider>
                                    <GraphMetaProvider>
                                        <GraphSelectionProvider>
                                            <ElementsProvider>
                                                {children}
                                            </ElementsProvider>
                                        </GraphSelectionProvider>
                                    </GraphMetaProvider>
                                </GraphRegistryProvider>
                            </GraphSnapshotStoreProvider>
                        </GraphWorkspaceProvider>
                    </ModalsProvider>
                </ToastsProvider>
            </SettingsProvider>
        </IconContext.Provider>
    );
}

type AppProvidersProps = {
    children: ReactNode;
};
