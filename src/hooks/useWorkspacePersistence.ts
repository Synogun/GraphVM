import { extractElementsInfo } from '@/services/graph';
import {
    buildWorkspaceSignature,
    saveWorkspaceState,
    serializeGraph,
} from '@/services/persistence';
import type { PersistedWorkspaceTab } from '@/types';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import {
    useGraphRegistry,
    useGraphSelection,
    useGraphWorkspace,
    useSnapshotStore,
    useToasts,
} from '@Contexts';
import { Logger } from '@Logger';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useGraphMutation } from './useGraphMutation';

const logger = Logger.createContextLogger('useWorkspacePersistence');

export function useWorkspacePersistence(graphId = 'main-graph') {
    const { tabs, activeTabId } = useGraphWorkspace();
    const registry = useGraphRegistry();
    const { syncAll } = useGraphMutation(graphId);
    const {
        selectionInfo: { setInfo },
    } = useGraphSelection();
    const { addToast } = useToasts();
    const store = useSnapshotStore();

    const tabsRef = useRef(tabs);
    const lastSignatureRef = useRef('');

    useLayoutEffect(() => {
        tabsRef.current = tabs;
    });

    // ── Effect 1: Active tab UI sync ─────────────────────────────────────────
    useEffect(() => {
        const scopedId = makeScopedGraphRegistryId(graphId, activeTabId);

        return registry.subscribe(scopedId, (core) => {
            if (!core) {
                return;
            }

            syncAll(core);
            setInfo(extractElementsInfo(core.$(':selected')));
        });
    }, [activeTabId, graphId, registry, syncAll, setInfo]);

    // ── Effect 2: Autosave ────────────────────────────────────────────────────
    useEffect(() => {
        const save = () => {
            const currentTabs = tabsRef.current;
            const persistedTabs: PersistedWorkspaceTab[] = currentTabs.map(
                (tab, index) => {
                    const core = registry.get(
                        makeScopedGraphRegistryId(graphId, tab.id)
                    );

                    // If canvas is mounted, serialize current state.
                    // Otherwise fall back to the last known snapshot.
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
