export type GraphInstance = cytoscape.Core | null;

export type GraphContextProperties = {
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
