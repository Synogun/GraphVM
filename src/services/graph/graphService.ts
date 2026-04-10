import {
    DefaultEdgesData,
    DefaultGraphOptions,
    DefaultNodesData,
} from '@/constants/graphDefaults';
import type { EdgeSelectionInfo, ElementsInfo, NodeSelectionInfo } from '@/types';
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

function extractSingleElementInfo(element: cytoscape.SingularData): ElementsInfo {
    if (element.isNode()) {
        const info: NodeSelectionInfo = {
            group: 'node',
            id: element.id(),
            label: String(element.data('label')),
            degree: element.degree(),
            inDegree: element.indegree(),
            outDegree: element.outdegree(),
            isGhost: Boolean(element.data('isGhost')),
        };

        if (element.cy().data('directed')) {
            delete info.degree;
        } else {
            delete info.inDegree;
            delete info.outDegree;
        }

        return info;
    }

    if (element.isEdge()) {
        const isGraphDirected = Boolean(element.cy().data('directed'));

        const source = element.source();
        const target = element.target();

        const sourceLabel = String(source.data('label'));
        const targetLabel = String(target.data('label'));
        const sourceDegree = source.degree();
        const targetDegree = target.degree();

        const info: EdgeSelectionInfo = {
            group: 'edge',
            id: element.id(),
            label: String(element.data('label')),
            source: `Node ${sourceLabel} (${source.id()})`,
            target: `Node ${targetLabel} (${target.id()})`,
            [`Node ${sourceLabel} degree`]: sourceDegree,
            [`Node ${targetLabel} degree`]: targetDegree,
            isSimple: element.isSimple(),
            isGhost: Boolean(element.data('isGhost')),
        };

        if (!isGraphDirected) {
            delete info.source;
            delete info.target;
        }

        return info;
    }

    return { group: 'none' };
}

function extractMultipleElementsInfo(
    elements: cytoscape.CollectionReturnValue
): ElementsInfo {
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

function extractCoreInfo(core: cytoscape.Core): ElementsInfo {
    const nodeCount = core.nodes('[!isGhost]').length;
    const ghostNodeCount = core.nodes('[?isGhost]').length;
    const edgeCount = core.edges('[!isGhost]').length;
    const ghostEdgeCount = core.edges('[?isGhost]').length;

    const directed = Boolean(core.data('directed'));

    return {
        group: 'core',
        directed,
        nodeCount,
        edgeCount,
        ghostNodeCount,
        ghostEdgeCount,
        components: core.elements('[!isGhost]').components().length,
    };
}

export function extractElementsInfo(
    elements: cytoscape.CollectionReturnValue
): ElementsInfo {
    if (elements.length === 0) {
        return extractCoreInfo(elements.cy());
    }
    if (elements.length === 1) {
        const element: cytoscape.SingularData = elements[0];
        return extractSingleElementInfo(element);
    } else {
        return extractMultipleElementsInfo(elements);
    }
}
