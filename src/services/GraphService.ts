import cytoscape from 'cytoscape';
import { ConfigService } from './ConfigService';

export function newGraph(
    containerId?: string,
    options?: cytoscape.CytoscapeOptions
): cytoscape.Core {
    const ConfigManager = ConfigService.getInstance();

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

    return newGraph;
}

export function destroyGraph(core: cytoscape.Core): void {
    const container = core.container();

    if (container) {
        container.innerHTML = '';
    }

    core.destroy();
    console.log('destroyGraph > destroyed graph');
}
