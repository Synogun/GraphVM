import { GraphMetaContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';
import type { GenerationFamily } from '@/types/algorithms/generationAlgorithms';

export function GraphMetaProvider({ children }: Readonly<GraphMetaProviderProps>) {
    const [directed, setDirected] = useState(false);
    const [nodeCount, setNodeCount] = useState(0);
    const [edgeMode, setEdgeMode] = useState<'path' | 'complete'>('path');
    const [edgeCount, setEdgeCount] = useState(0);
    const [families, setFamilies] = useState<GenerationFamily[]>([]);

    const value = useMemo(
        () => ({
            directed,
            setDirected,
            families,
            setFamilies,
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
        [directed, nodeCount, edgeCount, edgeMode, families]
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
