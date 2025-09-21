import type cytoscape from 'cytoscape';

export type NodesData = {
    id?: string;
    label?: string;
    color?: string;
    shape?: {} & cytoscape.Css.NodeShape;
};

export type NodeContextProperties = {
    color: string;
    setColor: (color: string) => void;
    shape: string;
    setShape: (shape: string) => void;
};
