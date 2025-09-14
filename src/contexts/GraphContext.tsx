import type cytoscape from 'cytoscape';
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

const GraphContext = createContext<GraphProperties | undefined>(undefined);

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

export function useGraphProperties() {
    const context = useContext(GraphContext);
    
    if (context === undefined) {
        throw new Error('useGraphProperties must be used within a GraphProvider');
    }
    
    return context;
}

type GraphProperties = {
    nodes: {
        count: number;
        setCount: (count: number) => void;
        selected: cytoscape.NodeCollection | null;
        setSelected: (nodes: cytoscape.NodeCollection | null) => void;
    };
    edges: {
        count: number;
        setCount: (count: number) => void;
        selected: cytoscape.EdgeCollection | null;
        setSelected: (edges: cytoscape.EdgeCollection | null) => void;
        edgeMode: 'path' | 'complete';
        setEdgeMode: (edgeMode: 'path' | 'complete') => void;
    };
};

type GraphProviderProps = {
    children: ReactNode;
};
