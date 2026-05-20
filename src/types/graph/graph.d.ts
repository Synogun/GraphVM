import type { GenerationFamily } from '@/types/algorithms/generationAlgorithms';

export type GraphInstance = cytoscape.Core | null;

export type AutopanOptions = {
    /** CSS selector for elements that trigger autopan on drag. */
    selector: string;
    /** Speed multiplier for panning when elements exceed canvas bounds. */
    speed: number;
    /** Activation margin (px) from each viewport edge where autopan engages. */
    margin: number;
};

export type GraphRegistryContextProperties = {
    register: (id: string, instance: GraphInstance) => void;
    unregister: (id: string) => void;
    get: (id: string) => GraphInstance;
    subscribe: (
        id: string,
        callback: (instance: GraphInstance) => void
    ) => () => void;
};

export type GraphSelectionContextProperties = {
    nodes: {
        selected: string[];
        setSelected: (nodes: string[]) => void;
    };
    edges: {
        selected: string[];
        setSelected: (edges: string[]) => void;
    };
    selectionInfo: {
        info: ElementsInfo;
        setInfo: (info: ElementsInfo) => void;
    };
};

export type ElementsInfo =
    | NodeSelectionInfo
    | EdgeSelectionInfo
    | NodesSelectionInfo
    | EdgesSelectionInfo
    | MixedSelectionInfo
    | CoreInfo
    | { group: 'none' };

export type BaseSelectionInfo = {
    group: 'node' | 'nodes' | 'edge' | 'edges' | 'mixed' | 'core' | 'none';
};

export type NodeSelectionInfo = {
    group: 'node';
    label: string;
    degree?: number;
    inDegree?: number;
    outDegree?: number;
    isGhost: boolean;
    ghostOf?: string;
    [key: string]: string | number | boolean | undefined;
} & BaseSelectionInfo;

export type NodesSelectionInfo = {
    group: 'nodes';
    count: number;
    areNeighbors: boolean;
    [key: string]: string | number | boolean | undefined;
} & BaseSelectionInfo;

export type EdgeSelectionInfo = {
    group: 'edge';
    label?: string;
    source?: string;
    target?: string;
    isSimple: boolean;
    isGhost: boolean;
    ghostOf?: string;
    [key: string]: string | number | boolean | undefined;
} & BaseSelectionInfo;

export type EdgesSelectionInfo = {
    group: 'edges';
    count: number;
    [key: string]: string | number | boolean | undefined;
} & BaseSelectionInfo;

export type MixedSelectionInfo = {
    group: 'mixed';
    nodeCount: number;
    edgeCount: number;
    components: number;
    [key: string]: string | number | boolean | undefined;
} & BaseSelectionInfo;

export type CoreInfo = {
    group: 'core';
    nodeCount: number;
    edgeCount: number;
    directed: boolean;
    [key: string]: string | number | boolean | undefined;
} & BaseSelectionInfo;

export type GraphMetaContextProperties = {
    directed: boolean;
    setDirected: (directed: boolean) => void;
    families: GenerationFamily[];
    setFamilies: (families: GenerationFamily[]) => void;
    nodes: {
        count: number;
        setCount: (count: number) => void;
    };
    edges: {
        count: number;
        setCount: (count: number) => void;
        edgeMode: 'path' | 'complete';
        setEdgeMode: (edgeMode: 'path' | 'complete') => void;
    };
};
