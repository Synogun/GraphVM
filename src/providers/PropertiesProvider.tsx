import { type ReactNode } from 'react';
import { EdgesProvider } from './EdgesProvider';
import { GraphMetaProvider } from './GraphMetaProvider';
import { GraphRegistryProvider } from './GraphRegistryProvider';
import { GraphSelectionProvider } from './GraphSelectionProvider';
import { GraphWorkspaceProvider } from './GraphWorkspaceProvider';
import { LayoutProvider } from './LayoutProvider';
import { NodesProvider } from './NodesProvider';

export function PropertiesProvider({ children }: Readonly<PropertiesProviderProps>) {
    return (
        <GraphWorkspaceProvider>
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
        </GraphWorkspaceProvider>
    );
}

type PropertiesProviderProps = {
    children: ReactNode;
};
