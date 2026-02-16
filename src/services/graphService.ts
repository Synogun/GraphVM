import {
    DefaultEdgesData,
    DefaultGraphOptions,
    DefaultNodesData,
} from '@/config/graphDefaults';
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

    logger.info('setGraphDirected > set directed to', directed);
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

    newGraph.data('numNodes', newGraph.nodes().length);
    newGraph.data('numEdges', newGraph.edges().length);

    logger.info('newGraph > created new graph instance in container:', containerId);
    return newGraph;
}

export function destroyGraph(core: cytoscape.Core): void {
    const container = core.container();

    if (container) {
        container.innerHTML = '';
    }

    core.destroy();
    logger.info('destroyGraph > destroyed graph');
}
