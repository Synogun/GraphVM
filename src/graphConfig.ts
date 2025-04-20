import cy from 'cytoscape';

type CurveStyle = 'haystack' | 'straight' | 'bezier' | 'unbundled-bezier' | 'segments' | 'taxi';

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
                style: {
                    'label': 'data(label)',
                    'background-color': 'data(color)',
                    'shape': (ele: cy.NodeSingular) => ele.data('shape') as cy.Css.NodeShape,

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
                style: {
                    'background-color': '#0169d9',
                    'border-color': '#0169d9',
                    'border-width': 2,
                },
            },
            {
                selector: 'node:selected',
                style: {
                    'background-color': 'data(color)',
                    'border-color': '#0169d9',
                    'border-width': 2,
                },
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': 'data(color)',
                    'line-style': (ele: cy.NodeSingular) => ele.data('style') as cy.Css.LineStyle,
                    'curve-style': (ele: cy.NodeSingular) => ele.data('curve') as CurveStyle,

                    'target-arrow-color': 'data(color)',

                    'font-family': 'Fira Code, sans-serif',
                    'color': '#fff',
                    'text-outline-color': '#000',
                    'text-outline-width': 1,
                },
            },
            {
                selector: '.edge-label-weight',
                style: {
                    label: 'data(weight)',
                },
            },
            {
                selector: '.edge-label-index',
                style: {
                    label: 'data(index)',
                },
            },
            {
                selector: '.directed',
                style: {
                    'target-arrow-shape': (ele: cy.NodeSingular) => ele.data('arrowShape') as cy.Css.ArrowShape,
                },
            },
            {
                selector: 'edge:active',
                style: {
                    'line-color': '#0169d9',
                    'target-arrow-color': '#0169d9',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
                },
            },
            {
                selector: 'edge:selected',
                style: {
                    'line-color': 'data(color)',
                    'target-arrow-color': 'data(color)',

                    'line-outline-width': 2.5,
                    'line-outline-color': '#0169d9',
                },
            },
        ] as cy.Stylesheet[],

        constructorParameters: {
            elements: [],
            data: {
                directed: false,
                multigraph: false,
                numberOfNodes: 0,
                numberOfEdges: 0,
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
            weight: '1',
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
    public set stylesheet(stylesheet: cy.Stylesheet[]) {
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
                    this.config.stylesheet = resolvedStyle;
                }).catch((error: unknown) => {
                    console.error('Error loading stylesheet:', error);
                });
            } else {
                this.config.stylesheet = style;
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
