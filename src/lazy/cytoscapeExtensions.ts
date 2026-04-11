import { Logger } from '@Logger';
import cytoscape from 'cytoscape';

const logger = Logger.createContextLogger('LazyCytoscapeExtensions');

type LazyCytoscapeExtensionKey = 'contextMenus';

const lazyExtensionLoaders: Record<
    LazyCytoscapeExtensionKey,
    () => Promise<{ default: Parameters<typeof cytoscape.use>[0] }>
> = {
    contextMenus: () => import('cytoscape-context-menus'),
};

const lazyExtensionPromises = new Map<LazyCytoscapeExtensionKey, Promise<void>>();

export function ensureContextMenusExtension(): Promise<void> {
    return ensureLazyCytoscapeExtension('contextMenus');
}

export async function ensureLazyCytoscapeExtension(
    key: LazyCytoscapeExtensionKey
): Promise<void> {
    const existingPromise = lazyExtensionPromises.get(key);

    if (existingPromise !== undefined) {
        return existingPromise;
    }

    const loader = lazyExtensionLoaders[key];
    const loadPromise = loader()
        .then((module) => {
            cytoscape.use(module.default);
            logger.debug(`Registered lazy Cytoscape extension: ${key}`);
        })
        .catch((error: unknown) => {
            lazyExtensionPromises.delete(key);
            logger.error(`Failed to register Cytoscape extension: ${key}`, error);
            throw error;
        });

    lazyExtensionPromises.set(key, loadPromise);
    return loadPromise;
}
