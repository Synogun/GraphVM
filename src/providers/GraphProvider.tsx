import { GraphContext } from '@/contexts/GraphContext';
import { useMemo, useState, type ReactNode } from 'react';

export function GraphProvider({ children }: GraphProviderProps) {
    const [nodeCount, setNodeCount] = useState(0);
    const [selectedNodes, setSelectedNodes] = useState<cytoscape.NodeCollection | null>(null);
    
    const [edgeMode, setEdgeMode] = useState<'path' | 'complete'>('path');
    const [edgeCount, setEdgeCount] = useState(0);
    const [selectedEdges, setSelectedEdges] = useState<cytoscape.EdgeCollection | null>(null);

    const nodes = useMemo(() => ({
        count: nodeCount,
        setCount: setNodeCount,
        selected: selectedNodes,
        setSelected: setSelectedNodes,
    }), [nodeCount, selectedNodes]);

    const edges = useMemo(() => ({
        count: edgeCount,
        setCount: setEdgeCount,
        selected: selectedEdges,
        setSelected: setSelectedEdges,
        edgeMode,
        setEdgeMode
    }), [edgeCount, selectedEdges, edgeMode]);

    const value = { nodes, edges };

    return (
        <GraphContext.Provider value={ value }>
            {children}
        </GraphContext.Provider>
    );
}

type GraphProviderProps = {
    children: ReactNode;
};
