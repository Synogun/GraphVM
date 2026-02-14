import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

export function importCytoscapeExtensions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    cytoscape.use(fcose);
}
