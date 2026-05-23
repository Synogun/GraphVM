import { isCytoscapeOptions } from '@/types/graph/typeGuards';
import { isPositiveInteger, isRecord, isString } from '@/types/typeGuards';
import type { PersistedWorkspaceState, PersistedWorkspaceTab, SharePayload } from '.';

export const WORKSPACE_SCHEMA_VERSION = 1;

export function isPersistedWorkspaceTab(
    value: unknown
): value is PersistedWorkspaceTab {
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

export function isPersistedWorkspaceState(
    value: unknown
): value is PersistedWorkspaceState {
    if (!isRecord(value) || value.version !== WORKSPACE_SCHEMA_VERSION) {
        return false;
    }

    if (!Array.isArray(value.tabs)) {
        return false;
    }

    if (value.tabs.length === 0 || !value.tabs.every(isPersistedWorkspaceTab)) {
        return false;
    }

    const tabIds = value.tabs.map((tab) => tab.id);
    const uniqueTabIds = new Set(tabIds);

    return uniqueTabIds.size === tabIds.length;
}

export function isSharePayload(value: unknown): value is SharePayload {
    if (!isRecord(value)) {
        return false;
    }

    return (
        value.v === 1 &&
        isString(value.name) &&
        ('graph' in value && (value.graph === null || isCytoscapeOptions(value.graph)))
    );
}
