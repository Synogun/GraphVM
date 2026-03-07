import { type ReactNode } from 'react';
import { EdgesProvider } from './EdgesProvider';
import { GraphMetaProvider } from './GraphMetaProvider';
import { GraphRegistryProvider } from './GraphRegistryProvider';
import { GraphSelectionProvider } from './GraphSelectionProvider';
import { LayoutProvider } from './LayoutProvider';
import { NodesProvider } from './NodesProvider';

export function PropertiesProvider({ children }: PropertiesProviderProps) {
    return (
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
    );
}

type PropertiesProviderProps = {
    children: ReactNode;
};
