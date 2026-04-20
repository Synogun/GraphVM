import { createGraphRegistry } from '@/utils/graphRegistry';
import { GraphRegistryContext } from '@Contexts';
import { useMemo, type ReactNode } from 'react';

export function GraphRegistryProvider({
    children,
}: Readonly<GraphRegistryProviderProps>) {
    const registry = useMemo(() => createGraphRegistry(), []);

    return (
        <GraphRegistryContext.Provider value={registry}>
            {children}
        </GraphRegistryContext.Provider>
    );
}

type GraphRegistryProviderProps = {
    children: ReactNode;
};
