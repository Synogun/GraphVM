import { type ReactNode } from 'react';
import { EdgesProvider } from './EdgesProvider';
import { GraphProvider } from './GraphProvider';
import { LayoutProvider } from './LayoutProvider';
import { NodesProvider } from './NodesProvider';
    
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
