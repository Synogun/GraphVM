import { Logger } from '@Logger';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

const logger = Logger.createContextLogger('Extensions');

let startupExtensionsLoaded = false;

export function importCytoscapeExtensions() {
    if (startupExtensionsLoaded) {
        return;
    }

    cytoscape.use(fcose);
    logger.debug('Registered startup Cytoscape extension: fcose');
    startupExtensionsLoaded = true;
}
