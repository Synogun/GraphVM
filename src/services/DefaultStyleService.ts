import type { EdgesData } from '@/types/edges';
import {
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLineStyle,
} from '@/types/edgesTypeGuards';
import type { NodesData } from '@/types/nodes';
import { isNodeShape } from '@/types/nodesTypeGuards';
import {
    type CytoscapeOptions,
    type EdgeSingular,
    type LayoutOptions,
    type NodeSingular,
    type StylesheetCSS,
} from 'cytoscape';

export class DefaultStyleService {
    private static instance: DefaultStyleService | null = null;
    public stylesheet: StylesheetCSS[] = [...defaultStylesheet];
    public graphOptions: CytoscapeOptions = { ...defaultGraphOptions };
    public layoutOptions = { ...defaultLayoutOptions };
    public nodesData: NodesData = { ...defaultNodesData };
    public edgesData: EdgesData = { ...defaultEdgesData };

    // constructor() {
    //     // Later we can load options from a file or external source
    // }

    public static getInstance(): DefaultStyleService {
        DefaultStyleService.instance ??= new DefaultStyleService();
        return DefaultStyleService.instance;
    }

    public static resetInstance(): void {
        DefaultStyleService.instance = null;
    }

    public resetStylesheet(): void {
        this.stylesheet = [...defaultStylesheet];
    }
    public getStylesheet(
        selector?: string
    ): StylesheetCSS[] | StylesheetCSS | null {
        if (!selector) return this.stylesheet;

        const found = this.stylesheet.find((s) => s.selector === selector);
        return found ?? null;
    }
    public setStylesheet(styles: StylesheetCSS | StylesheetCSS[]): void {
        if (Array.isArray(styles)) {
            this.stylesheet = styles;
            this.graphOptions = {
                ...this.graphOptions,
                style: this.stylesheet,
            };
            return;
        }

        const index = this.stylesheet.findIndex(
            (s) => s.selector === styles.selector
        );
        if (index !== -1) {
            this.stylesheet[index] = styles;
        } else {
            this.stylesheet.push(styles);
        }

        this.graphOptions = {
            ...this.graphOptions,
            style: this.stylesheet,
        };
    }

    public resetGraphOptions(): void {
        this.graphOptions = {
            ...defaultGraphOptions,
            layout: this.layoutOptions,
            style: this.stylesheet,
        };
    }
    public getGraphOptions(): CytoscapeOptions {
        return this.graphOptions;
    }
    public setGraphOptions(options: Partial<CytoscapeOptions>): void {
        this.graphOptions = {
            ...this.graphOptions,
            ...options,
        };
    }

    public resetLayoutOptions(): void {
        this.layoutOptions = { ...defaultLayoutOptions };
    }
    public getLayoutOptions(): LayoutOptions {
        return this.layoutOptions;
    }
    public setLayoutOptions(options: Partial<LayoutOptions>): void {
        this.layoutOptions = {
            ...this.layoutOptions,
            ...options,
        };

        this.graphOptions = {
            ...this.graphOptions,
            layout: this.layoutOptions,
        };
    }

    public resetNodesData(): void {
        this.nodesData = { ...defaultNodesData };
    }
    public getNodesData(): NodesData {
        return this.nodesData;
    }
    public setNodesData(data: Partial<NodesData>): void {
        this.nodesData = {
            ...this.nodesData,
            ...data,
        };
    }

    public resetEdgesData(): void {
        this.edgesData = { ...defaultEdgesData };
    }
    public getEdgesData(): EdgesData {
        return this.edgesData;
    }
    public setEdgesData(data: Partial<EdgesData>): void {
        this.edgesData = {
            ...this.edgesData,
            ...data,
        };
    }
}

export function getNodeShape(e: NodeSingular) {
    const shape: unknown = e.data('shape');
    return isNodeShape(shape) ? shape : 'ellipse';
}

export function getEdgeLabel(e: EdgeSingular) {
    const label: unknown = e.data('label');
    const defaultEdgesData = DefaultStyleService.getInstance().getEdgesData();

    if (typeof label === 'string') {
        if (label === 'hidden') return '';
        if (label === 'weight') return String(e.data('weight'));
        if (label === 'index') return String(e.data('index'));
        if (label === 'custom') {
            // TODO: implement custom label parsing with {propertyName} syntax
        }
    }

    return defaultEdgesData.label;
}

export function getEdgeStyle(e: EdgeSingular) {
    const style: unknown = e.data('style');
    return isEdgeLineStyle(style) ? style : 'solid';
}

export function getEdgeCurve(e: EdgeSingular) {
    const curve: unknown = e.data('curve');
    return isEdgeCurve(curve) ? curve : 'bezier';
}

export function getEdgeArrowShape(e: EdgeSingular) {
    const shape: unknown = e.data('arrowShape');
    return isEdgeArrowShape(shape) ? shape : 'triangle';
}

export function sheetToPlain(stylesheet: StylesheetCSS[]): StylesheetCSS[] {
    /**
     *
     * I'M NOT PROUD OF THIS CODE, BUT IT WORKS FOR NOW.
     * DON'T JUDGE ME.
     * TODO: Refactor this mess later
     *
     */
    const plainStylesheet = JSON.parse(
        JSON.stringify(stylesheet)
    ) as StylesheetCSS[];
    const propertyMap = {
        shape: { toPlain: 'data(shape)', toSheet: getNodeShape },
        'line-style': { toPlain: 'data(style)', toSheet: getEdgeStyle },
        'curve-style': { toPlain: 'data(curve)', toSheet: getEdgeCurve },
        'target-arrow-shape': {
            toPlain: 'data(arrowShape)',
            toSheet: getEdgeArrowShape,
        },
    };

    for (const style of plainStylesheet) {
        //@ts-expect-error For some reason the object reaches with a .style but TS can't infer it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        for (const [key, value] of Object.entries(style.style)) {
            if (value !== 'fn' || !(key in propertyMap)) continue;

            const propKey = key as keyof typeof propertyMap;
            //@ts-expect-error For some reason the object reaches with a .style but TS can't infer it
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            style.style[propKey] = propertyMap[propKey].toPlain;
        }
    }
    return plainStylesheet;
}

// -----------------------------------------------------------------

const defaultStylesheet: StylesheetCSS[] = [
    {
        selector: 'node',
        css: {
            label: 'data(label)',
            'background-color': 'data(color)',
            shape: getNodeShape,

            'font-family': 'Fira Code, sans-serif',
            color: '#fff',
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
            width: 3,
            label: getEdgeLabel,
            'line-color': 'data(color)',
            'line-style': getEdgeStyle,
            'curve-style': getEdgeCurve,

            'target-arrow-color': 'data(color)',

            'font-family': 'Fira Code, sans-serif',
            color: '#fff',
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
        selector: 'edge.directed',
        css: {
            'target-arrow-shape': getEdgeArrowShape,
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
];

const defaultLayoutOptions = {
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
};

const defaultGraphOptions: CytoscapeOptions = {
    layout: defaultLayoutOptions,
    style: defaultStylesheet,
    minZoom: 0.1,
};

const defaultNodesData: NodesData = {
    id: '',
    label: '',
    color: '#999999',
    shape: 'ellipse',
};

const defaultEdgesData: EdgesData = {
    id: '',
    source: '',
    target: '',
    weight: 1,
    label: 'hidden',
    color: '#cccccc',
    style: 'solid',
    curve: 'bezier',
    arrowShape: 'triangle',
};
