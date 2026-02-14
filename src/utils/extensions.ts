import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

export function importCytoscapeExtensions() {
    cytoscape.use(fcose);
}
