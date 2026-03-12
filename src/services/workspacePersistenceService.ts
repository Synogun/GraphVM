import { resetGraph, setGraphDirected } from '@/services/graphService';
import {
    normalizeCytoscapeOptionsForExport,
    normalizeCytoscapeOptionsForImport,
} from '@/services/importExportService';
import {
    loadPersistedState,
    savePersistedState,
} from '@/services/persistenceService';
import { isCytoscapeOptions } from '@/types/graphTypeGuards';
import { isPositiveInteger, isRecord, isString } from '@/types/typeGuards';
import type {
    PersistedWorkspaceSchemaVersion,
    PersistedWorkspaceState,
    PersistedWorkspaceTab,
} from '@/types/workspace';
import type cytoscape from 'cytoscape';

export const WORKSPACE_STORAGE_KEY = 'graphvm.workspace.v1';
const WORKSPACE_SCHEMA_VERSION: PersistedWorkspaceSchemaVersion = 1;

const EMPTY_WORKSPACE_STATE: PersistedWorkspaceState = {
    version: WORKSPACE_SCHEMA_VERSION,
    activeTabId: '',
    tabs: [],
};

function isPersistedWorkspaceTab(value: unknown): value is PersistedWorkspaceTab {
    if (!isRecord(value)) {
        return false;
    }

    return (
        isString(value.id) &&
        isString(value.name) &&
        (isPositiveInteger(value.order) || value.order === 0) &&
        (value.graph === null || isCytoscapeOptions(value.graph))
    );
}

function isPersistedWorkspaceState(
    value: unknown
): value is PersistedWorkspaceState {
    if (!isRecord(value) || value.version !== WORKSPACE_SCHEMA_VERSION) {
        return false;
    }

    if (!isString(value.activeTabId) || !Array.isArray(value.tabs)) {
        return false;
    }

    if (value.tabs.length === 0 || !value.tabs.every(isPersistedWorkspaceTab)) {
        return false;
    }

    const tabIds = value.tabs.map((tab) => tab.id);
    const uniqueTabIds = new Set(tabIds);

    return (
        uniqueTabIds.size === tabIds.length &&
        value.tabs.some((tab) => tab.id === value.activeTabId)
    );
}

function normalizeWorkspaceState(
    state: PersistedWorkspaceState
): PersistedWorkspaceState {
    const tabs = [...state.tabs]
        .sort((left, right) => left.order - right.order)
        .map((tab, index) => ({
            ...tab,
            order: index,
        }));

    const activeTabId = tabs.some((tab) => tab.id === state.activeTabId)
        ? state.activeTabId
        : (tabs[0]?.id ?? '');

    return {
        version: WORKSPACE_SCHEMA_VERSION,
        activeTabId,
        tabs,
    };
}

export function loadWorkspaceState(): PersistedWorkspaceState | null {
    const state = loadPersistedState({
        storageKey: WORKSPACE_STORAGE_KEY,
        fallbackState: EMPTY_WORKSPACE_STATE,
        isValidState: isPersistedWorkspaceState,
        versionCheck: {
            expectedVersion: WORKSPACE_SCHEMA_VERSION,
            getVersion: (currentState) => currentState.version,
        },
    });

    if (state.tabs.length === 0 || !state.activeTabId) {
        return null;
    }

    return normalizeWorkspaceState(state);
}

export function saveWorkspaceState(state: PersistedWorkspaceState): boolean {
    return savePersistedState({
        storageKey: WORKSPACE_STORAGE_KEY,
        state: normalizeWorkspaceState(state),
    });
}

export function serializeGraph(
    core: cytoscape.Core
): cytoscape.CytoscapeOptions | null {
    const snapshot = normalizeCytoscapeOptionsForExport(core.json());

    if (!snapshot || !isCytoscapeOptions(snapshot)) {
        return null;
    }

    return snapshot;
}

export function restoreGraph(
    core: cytoscape.Core,
    snapshot: cytoscape.CytoscapeOptions | null
): boolean {
    if (snapshot === null) {
        resetGraph(core);
        return true;
    }

    if (!isCytoscapeOptions(snapshot)) {
        return false;
    }

    const normalizedSnapshot = normalizeCytoscapeOptionsForImport(snapshot);

    if (!normalizedSnapshot) {
        return false;
    }

    resetGraph(core);

    // @ts-expect-error - CytoscapeOptions is not fully compatible with the expected type for json(), but it contains the required graph snapshot data.
    core.json(normalizedSnapshot);
    setGraphDirected(core, Boolean(normalizedSnapshot.data?.directed));

    return true;
}
