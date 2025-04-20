import $ from 'jquery';
import cytoscape from 'cytoscape';
import { Graph, LayoutOptions } from './graph.js';
import { findPropertyValueMode } from './utils.js';
// import { GraphConfig } from './graphConfig';

export type NodeField = 'label' | 'color' | 'shape';
export interface NodeFieldValues {
    label: string;
    color: string;
    shape: string;
}

export type EdgeField = 'weight' | 'label' | 'color' | 'style' | 'curve';
export interface EdgeFieldValues {
    weight: string;
    label: string;
    color: string;
    style: string;
    curve: string;
}

export class UserInterface {

    private nodeSelectionOrder: string[] = [];
    private edgeInsertionMode = 'path'; // path | complete

    constructor(
        private graph: Graph,
        // private config: UiConfig = new UiConfig,
    ) {
        this.graph = graph;
        // this.config = new UiConfig;
    }

    init() {
        this.bindActionsBarEvents();
        this.bindGraphEvents();
        this.bindPropertiesPanelEvents();

        this.updateGraphFields();
    }

    // Graph
    updateGraphFields() {
        const graph = this.graph.getCore();

        $('#node-count').val(String(graph.data('numberOfNodes')) + ' nodes');
        $('#edge-count').val(String(graph.data('numberOfEdges')) + ' edges');
    }

    resetSelection() {
        this.nodeSelectionOrder = [];
        this.edgeInsertionMode = 'path';
        this.graph.clearSelection();
    }

    // Nodes
    getNodeFields(): NodeFieldValues {
        return {
            label: String($('#node-label').val()),
            color: String($('#node-color').val()),
            shape: String($('#node-shape').val()),
        };
    }

    setNodeFields(properties: NodeFieldValues): void {
        for (const [key, val] of Object.entries(properties)) {
            if (val) {
                $(`#node-${key}`).val(String(val));
            }
        }
    }

    clearNodeFields(property?: NodeField): void {
        switch (property) {
            case 'label':
                $('#node-label').val('');
                break;

            case 'color':
                $('#node-color').val('#000000');
                break;

            case 'shape':
                $('#node-shape').val('ellipse');
                break;

            default:
                $('#node-label').val('');
                $('#node-color').val('#000000');
                $('#node-shape').val('ellipse');
                break;
        }
    }

    updateNodeFields(nodes: cytoscape.NodeCollection): void {
        if (!nodes.length) {
            this.clearNodeFields();
            return;
        }

        this.setNodeFields({
            label: nodes.map((ele) => {
                return ele.data('label') ? String(ele.data('label')) : ele.id();
            }).join(' ; '),
            color: findPropertyValueMode('color', nodes) ?? '#000000',
            shape: findPropertyValueMode('shape', nodes) ?? 'ellipse',
        });
    }

    // Edges
    getEdgeFields(): EdgeFieldValues {
        return {
            weight: String($('#edge-weight').val()),
            label: String($('#edge-label').val()),
            color: String($('#edge-color').val()),
            style: String($('#edge-style').val()),
            curve: String($('#edge-curve').val()),
        };
    }

    setEdgeFields(properties: EdgeFieldValues): void {
        for (const [key, val] of Object.entries(properties)) {
            if (val) {
                $(`#edge-${key}`).val(String(val));
            }
        }
    }

    clearEdgeFields(property?: EdgeField): void {
        switch (property) {
            case 'weight':
                $('#edge-weight').val(1);
                break;

            case 'label':
                $('#edge-label').val('');
                break;

            case 'color':
                $('#edge-color').val('#000000');
                break;

            case 'style':
                $('#edge-style').val('solid');
                break;

            case 'curve':
                $('#edge-curve').val('bezier');
                break;

            default:
                $('#edge-weight').val(1);
                $('#edge-label').val('');
                $('#edge-color').val('#000000');
                $('#edge-style').val('solid');
                $('#edge-curve').val('bezier');
                break;
        }
    }

    updateEdgeFields(edges: cytoscape.EdgeCollection): void {
        if (!edges.length) {
            this.clearEdgeFields();
            return;
        }

        this.setEdgeFields({
            weight: findPropertyValueMode('weight', edges) ?? '1',
            label: findPropertyValueMode('label', edges) ?? 'hidden',
            color: findPropertyValueMode('color', edges) ?? '#000000',
            style: findPropertyValueMode('style', edges) ?? 'solid',
            curve: findPropertyValueMode('curve', edges) ?? 'bezier',
        });
    }

    togglePanel(panel: string, state?: boolean) {
        const panelId = `#${panel}-panel`;

        if (state === undefined) {
            $(panelId).toggleClass('d-none');
        } else {
            $(panelId).toggleClass('d-none', !state);
        }
    }

    getLayoutFields() {
        let layout = {};
        const name = String($('#graph-layout').val());

        switch (name) {
            case 'circle':
                layout = {
                    radius: parseInt(String($('#circle-radius').val())),
                };
                break;

            case 'grid':
                layout = {
                    rows: parseInt(String($('#grid-rows').val())),
                    cols: parseInt(String($('#grid-cols').val())),
                    condense: $('#grid-condensed').is(':checked'),
                    spacingFactor: $('#grid-condensed').is(':checked') ? 1.5 : 0,
                };
                break;

            case 'concentric':
                layout = {
                    minNodeSpacing: 50,
                };
                break;

            default:
                // do nothing
                break;
        }

        return { name, ...layout };
    }

    switchLayoutPanel(panel: string) {
        panel = panel.toLocaleLowerCase();

        $('.layout-properties').addClass('d-none');
        $(`.${panel}-layout-properties`).removeClass('d-none');
    }

    bindActionsBarEvents() {

        const handleNewGraph = () => {
            const layout = this.getLayoutFields();

            const newGraph = this.graph.newGraph();

            this.graph.setCore(newGraph);
            this.graph.clearSelection();

            this.bindGraphEvents();

            this.updateGraphFields();
            this.graph.arrangeGraph(layout);
        };

        const handleArrangeGraph = () => {
            const layout = this.getLayoutFields();
            this.graph.arrangeGraph(layout);
        };

        const handleCenterGraph = () => {
            const graph = this.graph.getCore();
            const selected = graph.$(':selected');

            this.graph.centerGraph(selected);
        };

        const handleAddNode = () => {
            const layout = this.getLayoutFields();

            this.graph.addNode();

            this.resetSelection();
            this.updateGraphFields();
            this.graph.arrangeGraph(layout);
        };

        const handleAddEdge = () => {
            const selected = this.graph.getSelectedNodes();

            if (selected.length < 2) {
                alert('Select at least two nodes to create an edge.');
                return;
            }

            if (this.edgeInsertionMode === 'path') {
                for (let i = 0; i < selected.length - 1; i++) {
                    const source = this.nodeSelectionOrder[i];
                    const target = this.nodeSelectionOrder[i + 1];

                    this.graph.addEdge({ data: { source, target } });
                }
            }

            if (this.edgeInsertionMode === 'complete') {
                selected.forEach((sourceNode, i) => {
                    selected.slice(i + 1).forEach((targetNode) => {
                        this.graph.addEdge({
                            data: {
                                source: sourceNode.id(),
                                target: targetNode.id(),
                            },
                        });
                    });
                });
            }

            this.resetSelection();
            this.updateGraphFields();

            const layout = this.getLayoutFields();
            this.graph.arrangeGraph(layout);
        };

        $('#btn-new-graph').on('click', handleNewGraph);
        $('#btn-arrange-graph').on('click', handleArrangeGraph);
        $('#btn-center-graph').on('click', handleCenterGraph);
        $('#btn-add-node').on('click', handleAddNode);
        $('#btn-add-edge').on('click', handleAddEdge);
    }

    bindGraphEvents() {

        const handleNodeSelection = (evt: cytoscape.EventObject) => {
            const target = evt.target as cytoscape.NodeSingular;
            // const core = this.graph.getCore();

            if (evt.type === 'tap' && this.edgeInsertionMode === 'path') {
                this.nodeSelectionOrder.push(target.id());
                this.edgeInsertionMode = 'path';

                console.log('path selected:', this.nodeSelectionOrder);

            } else if (evt.type === 'boxselect') {
                this.nodeSelectionOrder = [];
                this.edgeInsertionMode = 'complete';

                console.log('node bundle selected', this.graph.getSelectedNodes().map(ele => ele.id()).join(', '));
            }

            // console.log('selected node', target.data('label'));
        };

        const handleNodeUnselection = (evt: cytoscape.EventObject) => {
            const target = evt.target as cytoscape.NodeSingular;
            const selected = this.graph.getSelectedNodes();

            this.nodeSelectionOrder = this.nodeSelectionOrder.filter(id => id !== target.id());

            if (selected.length <= 0) {
                this.edgeInsertionMode = 'path';
            }

            console.log('node unselected', target.data('label'), this.nodeSelectionOrder);
        };

        const handleNodePanel = (evt: cytoscape.EventObject) => {
            const selected = this.graph.getSelectedNodes();

            this.updateNodeFields(selected);

            if (evt.type === 'select' && selected.length > 0) {
                this.togglePanel('node', true);

            } else if (evt.type === 'unselect' && selected.length <= 0) {
                this.togglePanel('node', false);
            }
        };

        const handleEdgePanel = (evt: cytoscape.EventObject) => {
            const selected = this.graph.getSelectedEdges();

            this.updateEdgeFields(selected);

            if (evt.type === 'select' && selected.length > 0) {
                this.togglePanel('edge', true);

            } else if (evt.type === 'unselect' && selected.length <= 0) {
                this.togglePanel('edge', false);
            }
        };

        // ----------------
        // Setup the handlers

        const graph = this.graph.getCore();
        graph.on('tap', (evt) => { if (evt.target === graph) { this.resetSelection(); } });
        graph.on('tap boxselect', 'node', handleNodeSelection);
        graph.on('select unselect', 'node', handleNodePanel);
        graph.on('unselect', 'node', handleNodeUnselection);
        graph.on('select unselect', 'edge', handleEdgePanel);
        this.graph.setCore(graph);
    }


    bindPropertiesPanelEvents() {

        const handleLayoutChange = () => {
            const layout: LayoutOptions = this.getLayoutFields();
            this.switchLayoutPanel(layout.name);

            this.graph.arrangeGraph(layout);
        };

        const handleNodePropertyChange = (evt: JQuery.ChangeEvent) => {
            const selected = this.graph.getSelectedNodes();
            const target = evt.target as HTMLElement;

            const property = target.id.split('-')[1] as NodeField;
            const values = this.getNodeFields();

            this.graph.updateNodes(selected, property, values[property]);
            this.updateNodeFields(selected);
        };

        const handleDeleteNodes = () => {
            const selected = this.graph.getCore().nodes(':selected');
            const layout: LayoutOptions = this.getLayoutFields();

            this.graph.removeNodes(selected);
            this.updateNodeFields(selected);

            this.updateGraphFields();
            this.graph.arrangeGraph(layout);

            if (!selected.length) {
                this.togglePanel('node', false);
            }
        };

        const handleEdgePropertyChange = (evt: JQuery.ChangeEvent) => {
            const selected = this.graph.getSelectedEdges();
            const target = evt.target as HTMLElement;

            const property = target.id.split('-')[1] as EdgeField;
            const values = this.getEdgeFields();

            this.graph.updateEdges(selected, property, values[property]);
            this.updateEdgeFields(selected);
        };

        const handleDeleteEdge = () => {
            const selected = this.graph.getCore().edges(':selected');
            const layout: LayoutOptions = this.getLayoutFields();

            this.graph.removeEdges(selected);
            this.updateEdgeFields(selected);

            this.updateGraphFields();
            this.graph.arrangeGraph(layout);

            if (!selected.length) {
                this.togglePanel('edge', false);
            }
        };

        const layoutDOM = ['#graph-layout', '.circle-properties', '.grid-properties'].join();
        $(layoutDOM).on('change', handleLayoutChange);

        const nodeDOM = ['#node-label', '#node-color', '#node-shape'].join();
        $(nodeDOM).on('change', handleNodePropertyChange);

        $('#btn-delete-node').on('click', handleDeleteNodes);

        const edgeDOM = ['#edge-weight', '#edge-label', '#edge-color', '#edge-style', '#edge-curve'].join();
        $(edgeDOM).on('change', handleEdgePropertyChange);

        $('#btn-delete-edge').on('click', handleDeleteEdge);
    }
}
