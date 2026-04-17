import { restoreGraph } from '@/services/persistence';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import {
    useGraphRegistry,
    useGraphWorkspace,
    useSnapshotStore,
    useToasts,
} from '@Contexts';
import { Logger } from '@Logger';
import { useEffect, useLayoutEffect, useRef } from 'react';

const logger = Logger.createContextLogger('useGraphHydration');

export function useGraphHydration(graphId: string, tabId: string | undefined) {
    const store = useSnapshotStore();
    const registry = useGraphRegistry();
    const { tabs } = useGraphWorkspace();
    const { addToast } = useToasts();

    const tabsRef = useRef(tabs);
    useLayoutEffect(() => {
        tabsRef.current = tabs;
    });

    const hydratedRef = useRef(false);

    useEffect(() => {
        if (!tabId) {
            return;
        }

        hydratedRef.current = false;

        const scopedId = makeScopedGraphRegistryId(graphId, tabId);

        return registry.subscribe(scopedId, (core) => {
            if (!core) {
                hydratedRef.current = false;
                return;
            }

            if (hydratedRef.current) {
                return;
            }

            hydratedRef.current = true;

            const tabName =
                tabsRef.current.find((t) => t.id === tabId)?.name ?? tabId;
            const snapshot = store.getSnapshot(tabId);
            const restored = restoreGraph(core, snapshot);

            if (restored) {
                logger.debug(`Hydrated tab "${tabName}".`, { tabId });
            } else {
                addToast({
                    type: 'error',
                    message: `Failed to restore graph for tab "${tabName}".`,
                });
                logger.error('Failed to restore tab graph snapshot', {
                    tabId,
                    scopedId,
                });
            }
        });
    }, [graphId, tabId, registry, store, addToast]);
}
