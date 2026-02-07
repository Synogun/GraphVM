import {
    DefaultEdgesData,
    DefaultGraphOptions,
    DefaultNodesData,
} from '@/config/graphDefaults';
import { Logger } from '@Logger';
import cytoscape from 'cytoscape';

const logger = Logger.createContextLogger('GraphService');

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
