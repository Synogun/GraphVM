import {
    hasPersistedState,
    loadWorkspaceState,
    restoreGraph,
    saveWorkspaceState,
    serializeGraph,
    WORKSPACE_STORAGE_KEY,
} from '@/services/persistence';
import type {
    PersistedWorkspaceState,
    PersistedWorkspaceTab,
} from '@/types/workspace';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import { useGraphRegistry, useGraphWorkspace, useToasts } from '@Contexts';
import { Logger } from '@Logger';
import { useEffect, useRef } from 'react';
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
    const { addToast } = useToasts();
    const runtimeStateRef = useRef<WorkspacePersistenceRuntimeState>({
        didLoad: false,
        toasts: {
            didNotifyLoadError: false,
            // didNotifyManualSaveError: false,
            didNotifyAutoSaveError: false,
        },
        persistence: {
            lastHandledSaveRequestVersion: 0,
            lastAutosavedSignature: '',
            pendingHydrationTabIds: new Set(),
            restoredTabIds: new Set(),
            persistedSnapshots: new Map(),
            lastSavedSnapshots: new Map(),
        },
    });

    useEffect(() => {
        logger.debug('Initializing workspace persistence...');

        const runtime = runtimeStateRef.current;

        if (runtime.didLoad) {
            logger.debug(
                'Workspace persistence already initialized, skipping load.',
                {
                    didLoad: runtime.didLoad,
                }
            );
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

            logger.debug(
                'No persisted workspace state found, starting new workspace.'
            );
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

        logger.debug('Loaded persisted workspace state', {
            tabCount: persistedState.tabs.length,
            persistedSnapshots: Array.from(
                runtime.persistence.persistedSnapshots.entries()
            ),
        });
        initializeWorkspace(persistedState);
    }, [initializeWorkspace, addToast]);

    useEffect(() => {
        logger.debug(
            'Workspace tabs or activeTabId changed, checking for pending hydrations...',
            {
                tabs,
                activeTabId,
                pendingHydrationTabIds: Array.from(
                    runtimeStateRef.current.persistence.pendingHydrationTabIds
                ),
            }
        );

        const runtime = runtimeStateRef.current;

        if (!isInitialized) {
            logger.debug('Workspace not initialized, skipping pending hydrations.');
            return;
        }

        const currentTabIds = new Set(tabs.map((tab) => tab.id));

        for (const pendingTabId of runtime.persistence.pendingHydrationTabIds) {
            if (!currentTabIds.has(pendingTabId)) {
                logger.debug(
                    `Pending hydration tab "${pendingTabId}" no longer exists, skipping hydration and cleaning up persisted data.`
                );
                runtime.persistence.pendingHydrationTabIds.delete(pendingTabId);
                runtime.persistence.persistedSnapshots.delete(pendingTabId);
                runtime.persistence.restoredTabIds.delete(pendingTabId);
            }
        }

        tabs.forEach((tab) => {
            logger.debug('Checking pending hydration for tab:', tab.id);
            const tabId = tab.id;

            if (runtime.persistence.restoredTabIds.has(tabId)) {
                logger.debug(
                    `Tab "${tab.name}" already restored, skipping hydration.`
                );
                return;
            }

            if (tabId !== activeTabId) {
                logger.debug(
                    `Tab "${tab.name}" is not active yet, deferring hydration.`,
                    { activeTabId }
                );
                return;
            }

            const scopedGraphId = makeScopedGraphRegistryId(graphId, tabId);
            const core = registry.get(scopedGraphId);

            if (!core) {
                logger.debug(
                    `Graph instance for tab "${tab.name}" not found, skipping hydration.`
                );
                return;
            }

            const hasPersistedSnapshot =
                runtime.persistence.persistedSnapshots.has(tabId);

            if (!hasPersistedSnapshot) {
                logger.debug(
                    `No persisted snapshot found for tab "${tab.name}", skipping hydration.`
                );
                runtime.persistence.restoredTabIds.add(tabId);
                return;
            }

            const snapshot =
                runtime.persistence.persistedSnapshots.get(tabId) ?? null;
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

            if (tabId === activeTabId) {
                syncAll(core);
            }

            clearTabPendingSave(tabId);

            runtime.persistence.restoredTabIds.add(tabId);
            runtime.persistence.pendingHydrationTabIds.delete(tabId);
            runtime.persistence.persistedSnapshots.delete(tabId);
            logger.debug(`Completed hydration for tab "${tab.name}".`, {
                tabId,
                scopedGraphId,
                restored,
            });
        });
    }, [
        tabs,
        activeTabId,
        graphId,
        isInitialized,
        registry,
        syncAll,
        addToast,
        clearTabPendingSave,
    ]);

    useEffect(() => {
        logger.debug(
            'Workspace tabs or activeTabId changed, checking for autosave...',
            {
                tabs,
                activeTabId,
                saveRequestVersion,
                lastSavedSnapshots: Array.from(
                    runtimeStateRef.current.persistence.lastSavedSnapshots.entries()
                ),
            }
        );

        const runtime = runtimeStateRef.current;

        if (!isInitialized) {
            logger.debug('Workspace not initialized, skipping autosave.', {
                isInitialized,
                pendingHydrationTabIds: Array.from(
                    runtime.persistence.pendingHydrationTabIds
                ),
            });
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
            logger.debug(
                'Workspace state unchanged since last autosave, skipping persistence.',
                {
                    tabCount: tabs.length,
                }
            );
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
        restoredTabIds: Set<string>;
        persistedSnapshots: Map<string, PersistedWorkspaceTab['graph']>;
        lastSavedSnapshots: Map<string, PersistedWorkspaceTab['graph']>;
    };
};
