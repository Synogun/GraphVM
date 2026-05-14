import { useMemo, type ReactNode } from 'react';
import { IconContext } from 'react-icons';
import { GraphRegistryProvider, GraphSnapshotStoreProvider } from './graph';

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
    const iconStyle = useMemo(() => ({ style: { verticalAlign: 'middle' } }), []);

    return (
        <IconContext.Provider value={iconStyle}>
            <GraphSnapshotStoreProvider>
                <GraphRegistryProvider>{children}</GraphRegistryProvider>
            </GraphSnapshotStoreProvider>
        </IconContext.Provider>
    );
}

type AppProvidersProps = {
    children: ReactNode;
};
