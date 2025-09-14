import cytoscape from 'cytoscape';
import type {
    AddNodeParameters,
    GraphConstructorParameters,
    GraphLayoutOptions,
    JSONGraphFormat,
    NewGraphParameters
} from './graph';
import { GraphConfig } from './graphConfig';

export class GraphClass {

    private core: cytoscape.Core;
    private config: GraphConfig;

    private containerId: string;
    private removedNodes: cytoscape.NodeSingular[] = [];
    private removedEdges: cytoscape.EdgeSingular[] = [];

    constructor({ containerId, graphOptions, config }: GraphConstructorParameters) {
        this.containerId = containerId;

        this.config = config ?? new GraphConfig;
        this.core = this.newGraph({ containerId, options: graphOptions });

        this.addNode();
        this.addNode();
        this.addNode();
        this.addNode();
        this.addNode();
        this.addNode();
    }

    newGraph({ containerId, options }: NewGraphParameters = {}): cytoscape.Core {

        containerId ??= this.containerId;
        this.removedNodes = [];
        this.removedEdges = [];

        const graphOptions = {
            ...this.config.constructorParameters, // default graph options
            ...options,
        };

        if (options?.data) {
            graphOptions.data = {
                ...this.config.constructorParameters.data, // default graph data
                ...options.data,
            };
        }

        const newGraph = cytoscape({
            ...graphOptions,
            container: document.getElementById(containerId),
        });

        newGraph.data('numNodes', newGraph.nodes().length);
        newGraph.data('numEdges', newGraph.edges().length);

        console.log('newGraph > created new graph with options:', graphOptions);
        console.log('numNodes:', newGraph.data('numNodes'));
        console.log('numEdges:', newGraph.data('numEdges'));

        console.log('newGraph > created new graph');
        return newGraph;
    }

    destroyGraph({ containerId }: { containerId?: string } = {}): void {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }
        }

        this.core.destroy();
        console.log('destroyGraph > destroyed graph');
    }

    exportElementsToText(format: 'txt' | 'json' = 'txt'): string {
        let graphData = '';

        if (format === 'txt') {
            graphData = `${this.core.nodes().length.toString()} ${this.core.edges().length.toString()}\n`;

            this.core.edges().forEach((edge) => {
                const sourceNode = this.core.getElementById(String(edge.data('source')));
                const targetNode = this.core.getElementById(String(edge.data('target')));
                const edgeWeight = !edge.data('weight') || edge.data('weight') === 1 ? ' ' : ` ${String(edge.data('weight'))}`;

                graphData += `${String(sourceNode.data('label'))} ${String(targetNode.data('label'))}${edgeWeight}\n`;
            });

        } else {
            const graphJson = this.core.json() as JSONGraphFormat;
            graphData = JSON.stringify(graphJson.elements, null, 2);
        }

        return graphData;
    }

    arrangeGraph(options: GraphLayoutOptions): void {
        const layoutOptions: GraphLayoutOptions = {
            ...this.config.layout, // default layout options
            ...options,
        };

        this.core.layout(layoutOptions).run();
        console.log('arrangeGraph > arranged graph with', options.name, 'layout');
    }

    centerGraph(eles?: cytoscape.Collection, padding = 30): void {
        if (eles?.length) {
            this.core.fit(eles, padding);
        } else {
            this.core.fit(this.core.nodes(), padding);
        }

        console.log(
            'centerGraph > centered graph on',
            eles?.length ? eles.toArray() : 'all nodes',
        );
    }

    getCore(): cytoscape.Core {
        return this.core;
    }

    getData(key?: string): unknown {
        return this.core.data(key);
    }

    setCore(graph: cytoscape.Core): void {
        this.core = graph;
    }

    getNodeCount(): number {
        return this.core.nodes().length;
    }

    getEdgeCount(): number {
        return this.core.edges().length;
    }

    getSelectedNodes(): cytoscape.NodeCollection {
        return this.core.nodes(':selected');
    }

    getSelectedEdges(): cytoscape.EdgeCollection {
        return this.core.edges(':selected');
    }

    getSelectedElements(): cytoscape.Collection {
        return this.core.$(':selected');
    }

    clearSelection() {
        this.core.elements().unselect();
        console.log('clearSelection > cleared selection');
    }

    addNode({ options, classes }: AddNodeParameters = {}): void {
        const numNodes = this.core.nodes().length;

        const newIdIndex = numNodes + this.removedNodes.length;
        const newId = `node-${newIdIndex.toString()}`;

        const newNodeData = {
            id: newId,
            index: newIdIndex,

            label: newIdIndex.toString(),
            ...this.config.nodeData, // default node data
            ...options?.data,
        };

        this.core.add({
            group: 'nodes',
            data: newNodeData,
            classes: classes ?? [],
        });

        this.core.data('numNodes', numNodes + 1);
        console.log('addNode > added node with id:', newId, this.core.data());
    }

    removeNodes(nodes: cytoscape.NodeCollection): void {
        if (nodes.length === 0) {
            console.log('removeNode > Select at least one node');
            return;
        }

        nodes.forEach((node) => {
            if (!this.core.hasElementWithId(node.id())) {
                console.log('removeNode > Node not found in graph:', node.id());
                return;
            }
            const nodeEdges = node.connectedEdges();
            if (nodeEdges.length > 0) {
                this.removeEdges(nodeEdges);
            }

            this.removedNodes.push(node);
            this.core.remove(node);

        });

        this.core.data('numNodes', this.core.nodes().length);
        console.log('removeNode > removed', nodes.length, 'node(s)');
    }

    updateNodes(nodes: cytoscape.NodeCollection, property: string, value: string): void {
        if (nodes.length === 0) {
            console.log('updateNodes > Select at least one node');
            return;
        }

        nodes.forEach((node) => {
            if (!this.core.hasElementWithId(node.id())) {
                console.log('updateNodes > Node not found in graph:', node.id());
                return;
            }

            node.data(property, value);
        });

        console.log('updateNodes > updated', nodes.length, 'node(s)');
    }

    getRemovedNodes(): cytoscape.NodeSingular[] {
        return this.removedNodes;
    }

    clearRemovedNodes(): void {
        this.removedNodes = [];
    }

    addEdge(options: cytoscape.EdgeDefinition, classes?: string[]): void {
        if (!options.data.source) {
            console.log('addEdge > Source node is required');
            return;
        }
        if (!options.data.target) {
            console.log('addEdge > Target node is required');
            return;
        }

        const newIdIndex = this.core.edges().length + this.removedEdges.length;
        const newId = `edge-${newIdIndex.toString()}`;

        const newEdgeData = {
            id: newId,
            index: newIdIndex,

            ...this.config.edgeData, // default edge data
            ...options.data,
        };

        this.core.add({
            group: 'edges',
            data: newEdgeData,
            classes: classes ?? [],
        });

        if (this.core.data('directed')) {
            this.core.edges(`#${newId}`).addClass('directed');
        }

        this.core.data('numEdges', this.core.edges().length);
        console.log('addEdge > added edge with source', options.data.source, 'and target', options.data.target);
    }

    addEdges(edgeMode = 'path', edges: string[], data: edgesDataParameters): void {
        if (edges.length < 2) {
            console.log('addPath > Provide at least two edge definitions to create a path');
            // TODO: Show user feedback
            return;
        }

        if (edgeMode === 'path') {
            for (let i = 0; i < edges.length; i++) {
                this.addEdge({
                    data: {
                        source: edges[i],
                        target: edges[i + 1],
                        ...data
                    }
                });
            }
        }

        if (edgeMode === 'complete') {
            for (let i = 0; i < edges.length; i++) {
                for (let j = 0; j < i; j++) {
                    this.addEdge({
                        data: {
                            source: edges[i],
                            target: edges[j],
                            ...data
                        }
                    });
                }
            }
        }
    }

    removeEdges(edges: cytoscape.EdgeCollection): void {
        if (edges.length === 0) {
            console.log('removeEdge > Select at least one edge');
            return;
        }

        edges.forEach((edge) => {
            if (!this.core.hasElementWithId(edge.id())) {
                console.log('removeEdge > Edge not found in graph:', edge.id());
                return;
            }

            this.removedEdges.push(edge);
            this.core.remove(edge);
        });
        console.log('removeEdge > removed', edges.length, 'edge(s)');
    }

    updateEdges(edges: cytoscape.EdgeCollection, property: string, value: string | number): void {
        if (edges.length === 0) {
            console.log('updateEdges > Select at least one edge');
            return;
        }

        if (property === 'weight' && String(value).trim() === '') {
            edges.data('weight', 1);
        } else if (property === 'label') {
            edges.map((ele) => {
                ele.removeClass(`edge-label-${String(ele.data('label'))}`);
                ele.data('label', value);
                ele.addClass(`edge-label-${String(value)}`);
            });
        } else {
            edges.map(ele => ele.data(property, value));
        }

        console.log('updateEdges > updated', edges.length, 'edge(s)');
    }

    getRemovedEdges(): cytoscape.EdgeSingular[] {
        return this.removedEdges;
    }

    clearRemovedEdges(): void {
        this.removedEdges = [];
    }
}

type edgesDataParameters = {
    weight?: number;
    color?: string;
    style?: string;
    curve?: string;
};

// type GraphFamily =
//     | 'Cycle'
//     | 'Wheel'
//     | 'Complete'
//     | 'Hlp'
//     | 'H\'lp'
//     | 'Bipartite'
//     | 'Complete Bipartite'
//     | 'Path'
//     | 'Star';

// [
//     {
//         selector: 'node',
//         style: {
//             'label': 'data(label)',
//             'background-color': 'data(color)',
//             'shape': ele => ele.data('shape') as cytoscape.Css.NodeShape,

//             'font-family': 'Fira Code, sans-serif',
//             'color': '#fff',
//             'text-outline-color': '#000',
//             'text-outline-width': 1,
//             'text-halign': 'center',
//             'text-valign': 'center',
//         },
//     },
//     {
//         selector: 'node:active',
//         style: {
//             'background-color': '#0169d9',
//             'border-color': '#0169d9',
//             'border-width': 2,
//         },
//     },
//     {
//         selector: 'node:selected',
//         style: {
//             'background-color': 'data(color)',
//             'border-color': '#0169d9',
//             'border-width': 2,
//         },
//     },
//     {
//         selector: 'edge',
//         style: {
//             'width': 3,
//             'line-color': 'data(color)',
//             'line-style': ele => ele.data('style') as cytoscape.Css.LineStyle,
//             'curve-style': ele => ele.data('curve') as curveStyle,

//             'target-arrow-color': 'data(color)',

//             'font-family': 'Fira Code, sans-serif',
//             'color': '#fff',
//             'text-outline-color': '#000',
//             'text-outline-width': 1,
//         },
//     },
//     {
//         selector: '.edge-label-weight',
//         style: {
//             label: 'data(weight)',
//         },
//     },
//     {
//         selector: '.edge-label-index',
//         style: {
//             label: 'data(index)',
//         },
//     },
//     {
//         selector: '.directed',
//         style: {
//             'target-arrow-shape': ele => ele.data('arrowShape') as cytoscape.Css.ArrowShape,
//         },
//     },
//     {
//         selector: 'edge:active',
//         style: {
//             'line-color': '#0169d9',
//             'target-arrow-color': '#0169d9',

//             'line-outline-width': 2.5,
//             'line-outline-color': '#0169d9',
//         },
//     },
//     {
//         selector: 'edge:selected',
//         style: {
//             'line-color': 'data(color)',
//             'target-arrow-color': 'data(color)',

//             'line-outline-width': 2.5,
//             'line-outline-color': '#0169d9',
//         },
//     },
// ]
