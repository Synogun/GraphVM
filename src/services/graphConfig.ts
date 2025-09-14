import cy from 'cytoscape';

export class GraphConfig {
    // Default values
    public static default = {
        layout: {
            name: 'circle',

            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-in-out',

            fit: true,
            spacingFactor: 1.5,

            radius: 100,

            rows: 3,
            cols: 3,
            condensed: true,

            minNodeSpacing: 10,
        } as cy.LayoutOptions,

        stylesheet: [
            {
                selector: 'node',
                css: {
                    'label': 'data(label)',
                    'background-color': 'data(color)',
                    'shape': 'data(shape)',

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
                    'text-halign': 'center',
                    'text-valign': 'center',
                },
            },
            {
                selector: 'node:active',
                css: {
                    'background-color': '#0169d9',
                    'border-color': '#0169d9',
                    'border-width': 2,
                },
            },
            {
                selector: 'node:selected',
                css: {
                    'background-color': 'data(color)',
                    'border-color': '#0169d9',
                    'border-width': 2,
                },
            },
            {
                selector: 'edge',
                css: {
                    'width': 3,
                    'line-color': 'data(color)',
                    'line-style': 'data(style)',
                    'curve-style': 'data(curve)',

                    'target-arrow-color': 'data(color)',

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
                },
            },
            {
                selector: '.edge-label-weight',
                css: {
                    label: 'data(weight)',
                },
            },
            {
                selector: '.edge-label-index',
                css: {
                    label: 'data(index)',
                },
            },
            {
                selector: '.directed',
                css: {
                    'target-arrow-shape': 'data(arrowShape)',
                },
            },
            {
                selector: 'edge:active',
                css: {
                    'line-color': '#0169d9',
                    'target-arrow-color': '#0169d9',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
                },
            },
            {
                selector: 'edge:selected',
                css: {
                    'line-color': 'data(color)',
                    'target-arrow-color': 'data(color)',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
                },
            },
        ] as cy.StylesheetCSS[],

        constructorParameters: {
            elements: [],
            data: {
                directed: false,
                multigraph: false,
                numNodes: 0,
                numEdges: 0,
            },
            minZoom: 0.1,
        } as cy.CytoscapeOptions,

        // Default node data -> ele.data()
        nodeData: {
            color: '#999999',
            shape: 'ellipse',
        } as cy.NodeDataDefinition,

        // Default edge data -> ele.data()
        edgeData: {
            weight: 1,
            label: 'hidden',
            color: '#cccccc',
            style: 'solid',
            curve: 'bezier',
            arrowShape: 'triangle',
        } as Omit<cy.EdgeDataDefinition, 'source' | 'target'>,
    };

    private config;

    constructor() {
        this.config = {
            ...GraphConfig.default,
            constructorParameters: {
                ...GraphConfig.default.constructorParameters,
                layout: { ...GraphConfig.default.layout },
                style: [...GraphConfig.default.stylesheet],
            },
        };
    }

    // Getters for config properties
    public get layout() {
        return this.config.layout;
    }
    public set layout(layout: cy.LayoutOptions) {
        this.config.layout = {
            ...this.config.layout,
            ...layout,
        };
    }

    public get stylesheet() {
        return this.config.stylesheet;
    }
    public set stylesheet(stylesheet: cy.StylesheetCSS[]) {
        this.config.stylesheet = stylesheet;
    }

    public get constructorParameters() {
        return this.config.constructorParameters;
    }
    public set constructorParameters(params: cy.CytoscapeOptions) {
        // Remove layout and style from params to avoid overwriting them
        const { layout, style, ...rest } = params;

        this.config.constructorParameters = {
            ...this.config.constructorParameters,
            ...rest,
        };

        // If layout or style is provided, update them separately
        if (layout) {
            this.config.layout = {
                ...this.config.layout,
                ...layout,
            };
        }

        // If style is a function or a Promise, handle it accordingly
        if (style) {
            if (style instanceof Promise) {
                style.then((resolvedStyle) => {
                    this.config.stylesheet = resolvedStyle as cy.StylesheetCSS[];
                }).catch((error: unknown) => {
                    console.error('Error loading stylesheet:', error);
                });
            } else {
                this.config.stylesheet = style as cy.StylesheetCSS[];
            }
        }
    }

    public get nodeData() {
        return this.config.nodeData;
    }
    public set nodeData(data: cy.NodeDataDefinition) {
        this.config.nodeData = {
            ...this.config.nodeData,
            ...data,
        };
    }

    public get edgeData() {
        return this.config.edgeData;
    }
    public set edgeData(data: Omit<cy.EdgeDataDefinition, 'source' | 'target'>) {
        this.config.edgeData = {
            ...this.config.edgeData,
            ...data,
        };
    }

    // Reset to default settings
    public reset() {
        this.config = {
            ...GraphConfig.default,
            constructorParameters: {
                ...GraphConfig.default.constructorParameters,
                layout: { ...GraphConfig.default.layout },
                style: [...GraphConfig.default.stylesheet],
            },
        };
    }
}
