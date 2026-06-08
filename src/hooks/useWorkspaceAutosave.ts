import {
    buildWorkspaceSignature,
    saveWorkspaceState,
    serializeGraph,
} from '@/services/persistence';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import type { PersistedWorkspaceTab } from '@/types';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import { useGraphRegistry, useSnapshotStore, useToasts } from '@Contexts';
import { Logger } from '@Logger';
import { useEffect, useLayoutEffect, useRef } from 'react';

const logger = Logger.createContextLogger('useWorkspaceAutosave');

export function useWorkspaceAutosave(graphId = 'main-graph') {
    const tabs = useGraphWorkspaceStore((s) => s.tabs);
    const registry = useGraphRegistry();
    const { addToast } = useToasts();
    const store = useSnapshotStore();

    const tabsRef = useRef(tabs);
    const lastSignatureRef = useRef('');

    useLayoutEffect(() => {
        tabsRef.current = tabs;
    });

    useEffect(() => {
        const save = () => {
            const currentTabs = tabsRef.current;
            const persistedTabs: PersistedWorkspaceTab[] = currentTabs.map(
                (tab, index) => {
                    const core = registry.get(
                        makeScopedGraphRegistryId(graphId, tab.id)
                    );

                    const graph = core
                        ? (serializeGraph(core) ?? store.getSnapshot(tab.id))
                        : store.getSnapshot(tab.id);

                    return { id: tab.id, name: tab.name, order: index, graph };
                }
            );

            const signature = buildWorkspaceSignature(persistedTabs);

            if (signature === lastSignatureRef.current) {
                return;
            }

            const saved = saveWorkspaceState({ version: 1, tabs: persistedTabs });

            if (!saved) {
                logger.error('Failed to autosave workspace', {
                    tabCount: currentTabs.length,
                });
                addToast({
                    type: 'error',
                    message:
                        'Failed to autosave workspace. Changes may not persist after reload.',
                });
                return;
            }

            lastSignatureRef.current = signature;
            persistedTabs.forEach((tab) => {
                store.setSnapshot(tab.id, tab.graph);
            });
            logger.debug('Workspace autosaved.', { tabCount: currentTabs.length });
        };

        const intervalId = setInterval(save, 5_000);
        window.addEventListener('beforeunload', save);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('beforeunload', save);
        };
    }, [graphId, registry, addToast, store]);
}
