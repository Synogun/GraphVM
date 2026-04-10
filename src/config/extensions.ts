import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import fcose from 'cytoscape-fcose';

export function importCytoscapeExtensions() {
    cytoscape.use(fcose);
    cytoscape.use(contextMenus);
}
