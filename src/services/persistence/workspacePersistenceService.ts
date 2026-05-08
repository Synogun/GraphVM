import { arrangeGraph, resetGraph, setGraphDirected } from '@/services/graph';
import {
    loadPersistedState,
    normalizeCytoscapeOptionsForExport,
    normalizeCytoscapeOptionsForImport,
    savePersistedState,
} from '@/services/persistence';
import { isLayoutOptions } from '@/types';
import { isCytoscapeOptions } from '@/types/graph/typeGuards';
import type { PersistedWorkspaceState } from '@/types/workspace';
import {
    isPersistedWorkspaceState,
    WORKSPACE_SCHEMA_VERSION,
} from '@/types/workspace/typeGuards';
import { Logger } from '@Logger';
import type cytoscape from 'cytoscape';

const logger = Logger.createContextLogger('WorkspacePersistenceService');

export const WORKSPACE_STORAGE_KEY = 'graphvm.workspace.v1';

const EMPTY_WORKSPACE_STATE: PersistedWorkspaceState = {
    version: WORKSPACE_SCHEMA_VERSION,
    tabs: [],
};

function normalizeWorkspaceState(
    state: PersistedWorkspaceState
): PersistedWorkspaceState {
    const tabs = [...state.tabs]
        .sort((left, right) => left.order - right.order)
        .map((tab, index) => ({
            ...tab,
            order: index,
        }));

    return {
        version: WORKSPACE_SCHEMA_VERSION,
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

    if (state.tabs.length === 0) {
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

export function buildWorkspaceSignature(
    tabs: {
        id: string;
        name: string;
        order: number;
        graph: cytoscape.CytoscapeOptions | null;
    }[]
): string {
    return JSON.stringify(
        tabs.map((tab) => ({
            id: tab.id,
            name: tab.name,
            order: tab.order,
            elements: tab.graph?.elements ?? null,
        }))
    );
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

    const rawGraphLayout: unknown = core.data('layoutOptions');
    const graphLayout = isLayoutOptions(rawGraphLayout) ? rawGraphLayout : undefined;

    if (graphLayout) {
        arrangeGraph(core, graphLayout);
    }

    core.resize();
    core.fit();

    setGraphDirected(core, Boolean(normalizedSnapshot.data?.directed));
    logger.info('Graph restoration complete. Current graph state:', core.json());

    return true;
}
