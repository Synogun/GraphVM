export type GraphInstance = cytoscape.Core | null;

export type AutopanOptions = {
    /** CSS selector for elements that trigger autopan on drag. */
    selector: string;
    /** Speed multiplier for panning when elements exceed canvas bounds. */
    speed: number;
    /** Activation margin (px) from each viewport edge where autopan engages. */
    margin: number;
};

export type GraphContextProperties = {
    directed: boolean;
    setDirected: (directed: boolean) => void;

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
