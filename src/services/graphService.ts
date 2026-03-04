import {
    DefaultEdgesData,
    DefaultGraphOptions,
    DefaultNodesData,
} from '@/constants/graphDefaults';
import { Logger } from '@Logger';
import cytoscape from 'cytoscape';

const logger = Logger.createContextLogger('GraphService');

type ResetGraphState = {
    setNodeCount?: (count: number) => void;
    setEdgeCount?: (count: number) => void;
    setSelectedNodes?: (nodes: string[]) => void;
    setSelectedEdges?: (edges: string[]) => void;
    setDirected?: (directed: boolean) => void;
};

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

export function resetGraph(
    core: cytoscape.Core,
    reactState?: ResetGraphState
): void {
    logger.info('Resetting graph');

    core.elements().remove();
    core.data('directed', false);
    core.data('nodeSelectionOrder', []);
    core.data('edgeSelectionOrder', []);

    const nodeCount = core.nodes().length;
    const edgeCount = core.edges().length;

    reactState?.setNodeCount?.(nodeCount);
    reactState?.setEdgeCount?.(edgeCount);
    reactState?.setSelectedNodes?.([]);
    reactState?.setSelectedEdges?.([]);
    reactState?.setDirected?.(false);
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
