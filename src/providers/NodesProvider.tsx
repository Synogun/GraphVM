import { DefaultNodesData } from '@/config/graphDefaults';
import { NodesContext } from '@/contexts/NodesContext';
import { useState, type ReactNode } from 'react';

export function NodesProvider({ children }: NodesProviderProps) {
    const { color: defaultColor, shape: defaultShape } = DefaultNodesData;

    const [color, setColor] = useState(defaultColor);
    const [shape, setShape] = useState<cytoscape.Css.NodeShape>(defaultShape);

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
