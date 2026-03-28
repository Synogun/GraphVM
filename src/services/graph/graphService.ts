import {
    DefaultEdgesData,
    DefaultGraphOptions,
    DefaultNodesData,
} from '@/constants/graphDefaults';
import type { ElementsInfo } from '@/types';
import { Logger } from '@Logger';
import cytoscape from 'cytoscape';

const logger = Logger.createContextLogger('GraphService');

export function setGraphDirected(
    core: cytoscape.Core,
    directed: boolean,
    edgeIds?: string[]
): void {
    core.data('directed', directed);

    const edges = edgeIds
        ? core.edges().filter((e) => edgeIds.includes(e.id()))
        : core.edges();

    if (directed) {
        edges.addClass('directed');
    } else {
        edges.removeClass('directed');
    }
}

export function resetGraph(core: cytoscape.Core): void {
    logger.info('Resetting graph');

    core.elements().remove();
    core.data('directed', false);
    core.data('nodeSelectionOrder', []);
    core.data('edgeSelectionOrder', []);
}

export function newGraph(
    containerId?: string,
    options?: cytoscape.CytoscapeOptions
): cytoscape.Core {
    containerId ??= 'main-graph';

    const graphOptions = {
        ...DefaultGraphOptions,
        ...options,
    };

    const newGraph = cytoscape({
        ...graphOptions,
        container: document.getElementById(containerId),
    });

    newGraph.data('defaultNodesData', { ...DefaultNodesData });
    newGraph.data('defaultEdgesData', { ...DefaultEdgesData });

    const initialDirected =
        typeof options?.data === 'object' &&
        typeof (options.data as Record<string, unknown>).directed === 'boolean'
            ? ((options.data as Record<string, unknown>).directed as boolean)
            : false;
    setGraphDirected(newGraph, initialDirected);

    return newGraph;
}

export function destroyGraph(core: cytoscape.Core): void {
    const container = core.container();

    if (container) {
        container.innerHTML = '';
    }

    core.destroy();
}

export function extractElementsInfo(
    elements: cytoscape.CollectionReturnValue
): ElementsInfo {
    if (elements.length === 0) {
        return { group: 'none' };
    }

    if (elements.length === 1) {
        const element: cytoscape.SingularData = elements[0];

        if (element.isNode()) {
            return {
                group: 'node',
                label: String(element.data('label')),
                degree: element.degree(),
            };
        }

        if (element.isEdge()) {
            return {
                group: 'edge',
                label: String(element.data('label')),
                source: `Node ${String(element.source().data('label'))}`,
                target: `Node ${String(element.target().data('label'))}`,
                sourceDegree: element.source().degree(),
                targetDegree: element.target().degree(),
                isSimple: element.isSimple(),
            };
        }
    } else {
        const nodes: cytoscape.NodeCollection = elements.filter((el) => el.isNode());
        const edges: cytoscape.EdgeCollection = elements.filter((el) => el.isEdge());

        if (nodes.length > 0 && edges.length === 0) {
            const nodeIds = new Set(nodes.map((n) => n.id()));
            const areNeighbors = nodes.every((node) =>
                node
                    .neighborhood('node')
                    .map((neighbor) => neighbor.id())
                    .some((id) => nodeIds.has(id))
            );

            return {
                group: 'nodes',
                count: nodes.length,
                areNeighbors,
            };
        } else if (edges.length > 0 && nodes.length === 0) {
            return {
                group: 'edges',
                count: edges.length,
            };
        } else {
            return {
                group: 'mixed',
                nodeCount: nodes.length,
                edgeCount: edges.length,
                components: elements.components().length,
            };
        }
    }

    return { group: 'none' };
}
