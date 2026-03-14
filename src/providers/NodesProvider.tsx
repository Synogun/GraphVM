import { DefaultNodesData } from '@/constants/graphDefaults';
import { NodesContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';

export function NodesProvider({ children }: Readonly<NodesProviderProps>) {
    const { color: defaultColor, shape: defaultShape } = DefaultNodesData;

    const [color, setColor] = useState(defaultColor);
    const [shape, setShape] = useState<cytoscape.Css.NodeShape>(defaultShape);

    const value = useMemo(
        () => ({
            color,
            setColor,
            shape,
            setShape,
        }),
        [color, shape]
    );

    return <NodesContext.Provider value={value}>{children}</NodesContext.Provider>;
}

type NodesProviderProps = {
    children: ReactNode;
};
