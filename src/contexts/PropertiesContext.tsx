import { type ReactNode } from 'react';
import { EdgesProvider } from './EdgesContext';
import { GraphProvider } from './GraphContext';
import { LayoutProvider } from './LayoutContext';
import { NodesProvider } from './NodesContext';
    
export function PropertiesProvider({ children }: PropertiesProviderProps) {
    return (
        <GraphProvider>
            <LayoutProvider>
                <NodesProvider>
                    <EdgesProvider>
                        {children}
                    </EdgesProvider>
                </NodesProvider>
            </LayoutProvider>
        </GraphProvider>
    );
}

type PropertiesProviderProps = {
    children: ReactNode;
};
