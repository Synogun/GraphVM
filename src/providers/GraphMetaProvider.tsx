import { GraphMetaContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';

export function GraphMetaProvider({ children }: GraphMetaProviderProps) {
    const [directed, setDirected] = useState(false);
    const [nodeCount, setNodeCount] = useState(0);
    const [edgeMode, setEdgeMode] = useState<'path' | 'complete'>('path');
    const [edgeCount, setEdgeCount] = useState(0);

    const value = useMemo(
        () => ({
            directed,
            setDirected,
            nodes: {
                count: nodeCount,
                setCount: setNodeCount,
            },
            edges: {
                count: edgeCount,
                setCount: setEdgeCount,
                edgeMode,
                setEdgeMode,
            },
        }),
        [directed, nodeCount, edgeCount, edgeMode]
    );

    return (
        <GraphMetaContext.Provider value={value}>
            {children}
        </GraphMetaContext.Provider>
    );
}

type GraphMetaProviderProps = {
    children: ReactNode;
};
