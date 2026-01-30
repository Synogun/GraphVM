export type GraphInstance = cytoscape.Core | null;

export type GraphContextProperties = {
    nodes: {
        count: number;
        setCount: (count: number) => void;
        selected: string[];
        setSelected: (nodes: string[]) => void;
    };
    edges: {
        count: number;
        setCount: (count: number) => void;
        selected: string[];
        setSelected: (edges: string[]) => void;
        edgeMode: 'path' | 'complete';
        setEdgeMode: (edgeMode: 'path' | 'complete') => void;
    };
    registry: {
        register: (id: string, instance: GraphInstance) => void;
        unregister: (id: string) => void;
        get: (id: string) => GraphInstance;
        subscribe: (
            id: string,
            callback: (instance: GraphInstance) => void
        ) => () => void;
    };
};
