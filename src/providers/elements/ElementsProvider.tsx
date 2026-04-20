import { type ReactNode } from 'react';
import { EdgesProvider } from './EdgesProvider';
import { LayoutProvider } from './LayoutProvider';
import { NodesProvider } from './NodesProvider';

export function ElementsProvider({ children }: Readonly<ElementsProviderProps>) {
    return (
        <LayoutProvider>
            <NodesProvider>
                <EdgesProvider>{children}</EdgesProvider>
            </NodesProvider>
        </LayoutProvider>
    );
}

type ElementsProviderProps = {
    children: ReactNode;
};
