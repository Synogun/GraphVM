import { makeInitialWorkspaceState, workspaceReducer } from '@/services/persistence';
import type { GraphWorkspaceContextProperties } from '@/types/workspace';
import { GraphWorkspaceContext } from '@Contexts';
import { useCallback, useMemo, useReducer, type ReactNode } from 'react';

export function GraphWorkspaceProvider({
    children,
}: Readonly<GraphWorkspaceProviderProps>) {
    const [workspace, dispatch] = useReducer(workspaceReducer, undefined, () =>
        makeInitialWorkspaceState()
    );

    const createTab = useCallback(
        (name?: string) => {
            const tabId = `graph-tab-${String(workspace.nextTabNumber)}`;
            dispatch({ type: 'create-tab', tabId, name });
            return tabId;
        },
        [workspace.nextTabNumber]
    );

    const closeTab = useCallback((tabId: string) => {
        dispatch({ type: 'close-tab', tabId });
    }, []);

    const renameTab = useCallback((tabId: string, name: string) => {
        dispatch({ type: 'rename-tab', tabId, name });
    }, []);

    const setActiveTab = useCallback((tabId: string) => {
        dispatch({ type: 'set-active-tab', tabId });
    }, []);

    const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
        dispatch({ type: 'reorder-tabs', fromIndex, toIndex });
    }, []);

    const activeTab = useMemo(
        () => workspace.tabs.find((tab) => tab.id === workspace.activeTabId) ?? null,
        [workspace.activeTabId, workspace.tabs]
    );

    const value = useMemo<GraphWorkspaceContextProperties>(
        () => ({
            tabs: workspace.tabs,
            activeTabId: workspace.activeTabId,
            activeTab,
            createTab,
            closeTab,
            renameTab,
            setActiveTab,
            reorderTabs,
        }),
        [
            workspace.tabs,
            workspace.activeTabId,
            activeTab,
            createTab,
            closeTab,
            renameTab,
            setActiveTab,
            reorderTabs,
        ]
    );

    return (
        <GraphWorkspaceContext.Provider value={value}>
            {children}
        </GraphWorkspaceContext.Provider>
    );
}

type GraphWorkspaceProviderProps = {
    children: ReactNode;
};
