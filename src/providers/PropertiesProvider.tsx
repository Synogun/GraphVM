import { type ReactNode } from 'react';
import { EdgesProvider } from './EdgesProvider';
import { GraphProvider } from './GraphProvider';
import { LayoutProvider } from './LayoutProvider';
import { NodesProvider } from './NodesProvider';
import { SettingsProvider } from './SettingsProvider';

export function PropertiesProvider({ children }: PropertiesProviderProps) {
    return (
        <SettingsProvider>
            <GraphProvider>
                <LayoutProvider>
                    <NodesProvider>
                        <EdgesProvider>{children}</EdgesProvider>
                    </NodesProvider>
                </LayoutProvider>
            </GraphProvider>
        </SettingsProvider>
    );
}

type PropertiesProviderProps = {
    children: ReactNode;
};
