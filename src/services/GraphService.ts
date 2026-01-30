import { Logger } from '@Logger';
import cytoscape from 'cytoscape';
import { DefaultStyleService } from './DefaultStyleService';

const logger = Logger.createContextLogger('GraphService');

export function newGraph(
    containerId?: string,
    options?: cytoscape.CytoscapeOptions
): cytoscape.Core {
    const ConfigManager = DefaultStyleService.getInstance();

    containerId ??= 'main-graph';

    const graphOptions = {
        ...ConfigManager.getGraphOptions(), // default graph options
        ...options,
    };

    graphOptions.data = {
        ...ConfigManager.getNodesData(), // default graph data
        ...(options?.data ?? {}),
    };

    const newGraph = cytoscape({
        ...graphOptions,
        container: document.getElementById(containerId),
    });

    newGraph.data('numNodes', newGraph.nodes().length);
    newGraph.data('numEdges', newGraph.edges().length);

    logger.info(
        'newGraph > created new graph instance in container:',
        containerId
    );
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
