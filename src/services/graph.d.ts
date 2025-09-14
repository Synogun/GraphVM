import { GraphConfig } from './graphConfig';

export type GraphConstructorParameters = {
    containerId: string;
    config?: GraphConfig;
    graphOptions?: cytoscape.CytoscapeOptions;
};

export type GraphLayoutOptions = {
    name: string;

    animate?: boolean;
    animationDuration?: number;
    animationEasing?: string;
    fit?: boolean;

    radius?: number;
    rows?: number;
    cols?: number;
    condense?: boolean;
    spacingFactor?: number;

    minNodeSpacing?: number;
};

export type AddNodeParameters = {
    options?: cytoscape.NodeDefinition;
    classes?: string[];
};

export type NewGraphParameters = {
    containerId?: string;
    options?: cytoscape.CytoscapeOptions;
};

export type JSONGraphFormat = {
    elements: {
        nodes: cytoscape.NodeDefinition[];
        edges: cytoscape.EdgeDefinition[];
    };
};
