import type cytoscape from 'cytoscape';

export type NodesData = {
    id: string;
    label: string;
    color: string;
    shape: cytoscape.Css.NodeShape;
    isGhost: boolean;
    ghostOf?: string;
};

export type NodeContextProperties = {
    color: string;
    setColor: (color: string) => void;
    shape: cytoscape.Css.NodeShape;
    setShape: (shape: cytoscape.Css.NodeShape) => void;
};
