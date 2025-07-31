import { GraphConfig } from '../graphConfig';

export interface GraphConstructorParameters {
    containerId: string;
    config?: GraphConfig;
    graphOptions?: cytoscape.CytoscapeOptions;
}

export interface GraphLayoutOptions {
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
}

export interface AddNodeParameters {
    options?: cytoscape.NodeDefinition;
    classes?: string[];
}

export interface NewGraphParameters {
    containerId?: string;
    options?: cytoscape.CytoscapeOptions;
}

export interface JSONGraphFormat {
    elements: {
        nodes: cytoscape.NodeDefinition[];
        edges: cytoscape.EdgeDefinition[];
    };
}
