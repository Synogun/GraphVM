import { type ReactNode } from 'react';
import { EdgesProvider } from './EdgesProvider';
import { GraphMetaProvider } from './GraphMetaProvider';
import { GraphRegistryProvider } from './GraphRegistryProvider';
import { GraphSelectionProvider } from './GraphSelectionProvider';
import { LayoutProvider } from './LayoutProvider';
import { NodesProvider } from './NodesProvider';
import { SettingsProvider } from './SettingsProvider';

export function PropertiesProvider({ children }: PropertiesProviderProps) {
    return (
        <SettingsProvider>
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
        </SettingsProvider>
    );
}

type PropertiesProviderProps = {
    children: ReactNode;
};
