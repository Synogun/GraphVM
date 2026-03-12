import { hasPersistedState } from '@/services/persistenceService';
import {
    loadWorkspaceState,
    restoreGraph,
    saveWorkspaceState,
    serializeGraph,
    WORKSPACE_STORAGE_KEY,
} from '@/services/workspacePersistenceService';
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

function makeWorkspaceSignature(
    tabs: PersistedWorkspaceTab[],
    activeTabId: string
): string {
    return JSON.stringify({
        activeTabId,
        tabs: tabs.map((tab) => ({
            id: tab.id,
            name: tab.name,
            order: tab.order,
        })),
    });
}

function removeMissingTabSnapshots(
    tabs: { id: string }[],
    snapshots: Map<string, PersistedWorkspaceTab['graph']>
) {
    const currentTabIds = new Set(tabs.map((tab) => tab.id));

    for (const tabId of Array.from(snapshots.keys())) {
        if (!currentTabIds.has(tabId)) {
            snapshots.delete(tabId);
        }
    }
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
            didNotifyManualSaveError: false,
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
        const runtime = runtimeStateRef.current;

        if (runtime.didLoad || isInitialized) {
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
            persistedState.tabs,
            persistedState.activeTabId
        );

        initializeWorkspace(persistedState);
    }, [isInitialized, initializeWorkspace, addToast]);

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
                runtime.persistence.restoredTabIds.delete(pendingTabId);
            }
        }

        tabs.forEach((tab) => {
            const tabId = tab.id;

            if (runtime.persistence.restoredTabIds.has(tabId)) {
                return;
            }

            const scopedGraphId = makeScopedGraphRegistryId(graphId, tabId);
            const core = registry.get(scopedGraphId);

            if (!core) {
                return;
            }

            const hasPersistedSnapshot =
                runtime.persistence.persistedSnapshots.has(tabId);

            if (!hasPersistedSnapshot) {
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
        const runtime = runtimeStateRef.current;

        if (!isInitialized || runtime.persistence.pendingHydrationTabIds.size > 0) {
            return;
        }

        removeMissingTabSnapshots(tabs, runtime.persistence.lastSavedSnapshots);

        const shellTabs = buildPersistedTabsFromSnapshots(
            tabs,
            runtime.persistence.lastSavedSnapshots
        );

        const shellSignature = makeWorkspaceSignature(shellTabs, activeTabId);

        if (shellSignature === runtime.persistence.lastAutosavedSignature) {
            return;
        }

        const autosaveState: PersistedWorkspaceState = {
            version: 1,
            activeTabId,
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
                activeTabId,
                tabCount: tabs.length,
            });
            return;
        }

        runtime.toasts.didNotifyAutoSaveError = false;
        runtime.persistence.lastAutosavedSignature = shellSignature;
    }, [tabs, activeTabId, isInitialized, addToast]);

    useEffect(() => {
        const runtime = runtimeStateRef.current;

        if (!isInitialized || runtime.persistence.pendingHydrationTabIds.size > 0) {
            return;
        }

        if (
            saveRequestVersion === runtime.persistence.lastHandledSaveRequestVersion
        ) {
            return;
        }

        runtime.persistence.lastHandledSaveRequestVersion = saveRequestVersion;

        const graphSnapshots = new Map<string, PersistedWorkspaceTab['graph']>(
            tabs.map((tab) => {
                const scopedGraphId = makeScopedGraphRegistryId(graphId, tab.id);
                const core = registry.get(scopedGraphId);

                return [tab.id, core ? serializeGraph(core) : null];
            })
        );

        const persistedTabs = buildPersistedTabsFromSnapshots(tabs, graphSnapshots);

        const stateToPersist: PersistedWorkspaceState = {
            version: 1,
            activeTabId,
            tabs: persistedTabs,
        };

        const saved = saveWorkspaceState(stateToPersist);

        if (!saved) {
            if (!runtime.toasts.didNotifyManualSaveError) {
                runtime.toasts.didNotifyManualSaveError = true;
                addToast({
                    type: 'error',
                    message:
                        'Failed to save workspace session. Your latest changes may not persist after reload.',
                });
            }

            logger.error('Failed to persist workspace state', {
                activeTabId,
                tabCount: tabs.length,
            });
            return;
        }

        runtime.toasts.didNotifyManualSaveError = false;
        runtime.toasts.didNotifyAutoSaveError = false;

        runtime.persistence.lastSavedSnapshots = graphSnapshots;
        runtime.persistence.lastAutosavedSignature = makeWorkspaceSignature(
            persistedTabs,
            activeTabId
        );

        clearAllPendingSave();

        addToast({ type: 'success', message: 'Workspace saved.' });
    }, [
        tabs,
        activeTabId,
        graphId,
        isInitialized,
        saveRequestVersion,
        registry,
        addToast,
        clearAllPendingSave,
    ]);
}

type WorkspacePersistenceRuntimeState = {
    didLoad: boolean;
    toasts: {
        didNotifyLoadError: boolean;
        didNotifyManualSaveError: boolean;
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
