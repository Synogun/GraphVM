import { extractElementsInfo } from '@/services/graph';
import {
    hasPersistedState,
    loadWorkspaceState,
    restoreGraph,
    saveWorkspaceState,
    serializeGraph,
    WORKSPACE_STORAGE_KEY,
} from '@/services/persistence';
import type {
    GraphInstance,
    PersistedWorkspaceState,
    PersistedWorkspaceTab,
} from '@/types';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import {
    useGraphRegistry,
    useGraphSelection,
    useGraphWorkspace,
    useToasts,
} from '@Contexts';
import { Logger } from '@Logger';
import { useCallback, useEffect, useRef } from 'react';
import { useGraphMutation } from './useGraphMutation';

const logger = Logger.createContextLogger('useWorkspacePersistence');

function makeWorkspaceSignature(tabs: PersistedWorkspaceTab[]): string {
    return JSON.stringify({
        tabs: tabs.map((tab) => ({
            id: tab.id,
            name: tab.name,
            order: tab.order,
            graph: tab.graph ? { elements: tab.graph.elements } : null,
        })),
    });
}

function buildPersistedTabsFromSnapshots(
    tabs: { id: string; name: string }[],
    snapshots: Map<string, PersistedWorkspaceTab['graph']>
): PersistedWorkspaceTab[] {
    return tabs.map((tab, index) => ({
        id: tab.id,
        name: tab.name,
        order: index,
        graph: snapshots.get(tab.id) ?? null,
    }));
}

export function useWorkspacePersistence(graphId = 'main-graph') {
    const {
        tabs,
        activeTabId,
        isInitialized,
        saveRequestVersion,
        initializeWorkspace,
        clearTabPendingSave,
        clearAllPendingSave,
    } = useGraphWorkspace();
    const registry = useGraphRegistry();
    const { syncAll } = useGraphMutation(graphId);
    const {
        selectionInfo: { setInfo },
    } = useGraphSelection();
    const { addToast } = useToasts();
    const runtimeStateRef = useRef<WorkspacePersistenceRuntimeState>({
        didLoad: false,
        toasts: {
            didNotifyLoadError: false,
            didNotifyAutoSaveError: false,
        },
        persistence: {
            lastHandledSaveRequestVersion: 0,
            lastAutosavedSignature: '',
            pendingHydrationTabIds: new Set(),
            hydratedTabInstances: new Map(),
            persistedSnapshots: new Map(),
            lastSavedSnapshots: new Map(),
        },
    });

    const hydrateTabIfReady = useCallback(
        (
            tabId: string,
            core = registry.get(makeScopedGraphRegistryId(graphId, tabId))
        ) => {
            const runtime = runtimeStateRef.current;
            const hydratedInstance =
                runtime.persistence.hydratedTabInstances.get(tabId);

            if (!isInitialized || hydratedInstance === core) {
                return false;
            }

            if (tabId !== activeTabId || !core) {
                return false;
            }

            const tab = tabs.find((candidateTab) => candidateTab.id === tabId);

            if (!tab) {
                runtime.persistence.pendingHydrationTabIds.delete(tabId);
                runtime.persistence.persistedSnapshots.delete(tabId);
                runtime.persistence.hydratedTabInstances.delete(tabId);
                return false;
            }

            const scopedGraphId = makeScopedGraphRegistryId(graphId, tabId);
            const hasPersistedSnapshot =
                runtime.persistence.persistedSnapshots.has(tabId);
            const hasLastSavedSnapshot =
                runtime.persistence.lastSavedSnapshots.has(tabId);

            if (!hasPersistedSnapshot && !hasLastSavedSnapshot) {
                runtime.persistence.hydratedTabInstances.set(tabId, core);
                runtime.persistence.pendingHydrationTabIds.delete(tabId);
                return true;
            }

            const snapshot = hasPersistedSnapshot
                ? (runtime.persistence.persistedSnapshots.get(tabId) ?? null)
                : (runtime.persistence.lastSavedSnapshots.get(tabId) ?? null);
            const restored = restoreGraph(core, snapshot);

            if (!restored) {
                addToast({
                    type: 'error',
                    message: `Failed to restore graph for tab "${tab.name}".`,
                });
                logger.error('Failed to restore tab graph snapshot', {
                    tabId,
                    scopedGraphId,
                });
            }

            syncAll(core);
            const graphInfo = extractElementsInfo(core.$(':selected'));
            setInfo(graphInfo);

            clearTabPendingSave(tabId);

            runtime.persistence.hydratedTabInstances.set(tabId, core);
            runtime.persistence.pendingHydrationTabIds.delete(tabId);
            runtime.persistence.persistedSnapshots.delete(tabId);
            logger.debug(`Completed hydration for tab "${tab.name}".`, {
                tabId,
                scopedGraphId,
                restored,
            });

            return true;
        },
        [
            activeTabId,
            addToast,
            clearTabPendingSave,
            graphId,
            isInitialized,
            registry,
            setInfo,
            syncAll,
            tabs,
        ]
    );

    useEffect(() => {
        const runtime = runtimeStateRef.current;

        if (runtime.didLoad) {
            return;
        }

        runtime.didLoad = true;

        const persistedState = loadWorkspaceState();

        if (persistedState === null) {
            if (
                hasPersistedState(WORKSPACE_STORAGE_KEY) &&
                !runtime.toasts.didNotifyLoadError
            ) {
                runtime.toasts.didNotifyLoadError = true;
                addToast({
                    type: 'error',
                    message:
                        'Failed to restore previous workspace session. Starting a new workspace.',
                });
                logger.warn(
                    'Persisted workspace payload rejected; starting new workspace'
                );
            }

            initializeWorkspace(null);
            return;
        }

        runtime.persistence.persistedSnapshots = new Map(
            persistedState.tabs.map((tab) => [tab.id, tab.graph])
        );
        runtime.persistence.lastSavedSnapshots = new Map(
            persistedState.tabs.map((tab) => [tab.id, tab.graph])
        );
        runtime.persistence.pendingHydrationTabIds = new Set(
            persistedState.tabs.map((tab) => tab.id)
        );
        runtime.persistence.lastAutosavedSignature = makeWorkspaceSignature(
            persistedState.tabs
        );
        initializeWorkspace(persistedState);
    }, [initializeWorkspace, addToast]);

    useEffect(() => {
        if (!isInitialized || !activeTabId) {
            return;
        }

        const scopedGraphId = makeScopedGraphRegistryId(graphId, activeTabId);

        return registry.subscribe(scopedGraphId, (instance) => {
            if (!instance) {
                runtimeStateRef.current.persistence.hydratedTabInstances.delete(
                    activeTabId
                );
                return;
            }

            hydrateTabIfReady(activeTabId, instance);
        });
    }, [activeTabId, graphId, hydrateTabIfReady, isInitialized, registry]);

    useEffect(() => {
        const runtime = runtimeStateRef.current;

        if (!isInitialized) {
            return;
        }

        const currentTabIds = new Set(tabs.map((tab) => tab.id));

        for (const pendingTabId of runtime.persistence.pendingHydrationTabIds) {
            if (!currentTabIds.has(pendingTabId)) {
                runtime.persistence.pendingHydrationTabIds.delete(pendingTabId);
                runtime.persistence.persistedSnapshots.delete(pendingTabId);
                runtime.persistence.hydratedTabInstances.delete(pendingTabId);
            }
        }

        tabs.forEach((tab) => {
            hydrateTabIfReady(tab.id);
        });
    }, [tabs, activeTabId, graphId, isInitialized, registry, hydrateTabIfReady]);

    useEffect(() => {
        const runtime = runtimeStateRef.current;

        if (!isInitialized) {
            return;
        }

        let graphSnapshots = runtime.persistence.lastSavedSnapshots;
        if (saveRequestVersion > runtime.persistence.lastHandledSaveRequestVersion) {
            runtime.persistence.lastHandledSaveRequestVersion = saveRequestVersion;
            graphSnapshots = new Map<string, PersistedWorkspaceTab['graph']>(
                tabs.map((tab) => {
                    const scopedGraphId = makeScopedGraphRegistryId(graphId, tab.id);
                    const core = registry.get(scopedGraphId);

                    if (runtime.persistence.pendingHydrationTabIds.has(tab.id)) {
                        return [
                            tab.id,
                            runtime.persistence.lastSavedSnapshots.get(tab.id) ??
                                runtime.persistence.persistedSnapshots.get(tab.id) ??
                                null,
                        ];
                    }

                    return [tab.id, core ? serializeGraph(core) : null];
                })
            );
        }

        const shellTabs = buildPersistedTabsFromSnapshots(tabs, graphSnapshots);
        const shellSignature = makeWorkspaceSignature(shellTabs);

        if (shellSignature === runtime.persistence.lastAutosavedSignature) {
            return;
        }

        const autosaveState: PersistedWorkspaceState = {
            version: 1,
            tabs: shellTabs,
        };

        const autosaved = saveWorkspaceState(autosaveState);

        if (!autosaved) {
            if (!runtime.toasts.didNotifyAutoSaveError) {
                runtime.toasts.didNotifyAutoSaveError = true;
                addToast({
                    type: 'error',
                    message:
                        'Failed to save workspace tab changes. Tab metadata may not persist after reload.',
                });
            }

            logger.error('Failed to autosave workspace tab shell', {
                tabCount: tabs.length,
            });
            return;
        }

        runtime.toasts.didNotifyAutoSaveError = false;
        runtime.persistence.lastAutosavedSignature = shellSignature;
        runtime.persistence.lastSavedSnapshots = graphSnapshots;
        clearAllPendingSave();
    }, [
        tabs,
        activeTabId,
        isInitialized,
        addToast,
        graphId,
        registry,
        saveRequestVersion,
        clearAllPendingSave,
    ]);
}

type WorkspacePersistenceRuntimeState = {
    didLoad: boolean;
    toasts: {
        didNotifyLoadError: boolean;
        didNotifyAutoSaveError: boolean;
    };
    persistence: {
        lastHandledSaveRequestVersion: number;
        lastAutosavedSignature: string;
        pendingHydrationTabIds: Set<string>;
        hydratedTabInstances: Map<string, GraphInstance>;
        persistedSnapshots: Map<string, PersistedWorkspaceTab['graph']>;
        lastSavedSnapshots: Map<string, PersistedWorkspaceTab['graph']>;
    };
};
