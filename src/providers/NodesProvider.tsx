import { NodesContext } from '@/contexts/NodesContext';
import { useState, type ReactNode } from 'react';

export function NodesProvider({ children }: NodesProviderProps) {
    const [color, setColor] = useState('#999999');
    const [shape, setShape] = useState<cytoscape.Css.NodeShape>('ellipse');

    const value = {
        color,
        setColor,
        shape,
        setShape,
    };

    return (
        <NodesContext.Provider value={value}>{children}</NodesContext.Provider>
    );
}

type NodesProviderProps = {
    children: ReactNode;
};
