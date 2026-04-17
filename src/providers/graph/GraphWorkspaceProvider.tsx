import { loadWorkspaceState } from '@/services/persistence';
import type {
    GraphWorkspaceContextProperties,
    GraphWorkspaceTab,
} from '@/types/workspace';
import { GraphWorkspaceContext } from '@Contexts';
import { useCallback, useMemo, useReducer, type ReactNode } from 'react';

type WorkspaceState = {
    tabs: GraphWorkspaceTab[];
    activeTabId: string;
    nextTabNumber: number;
};

type WorkspaceAction =
    | { type: 'create-tab'; name?: string }
    | { type: 'close-tab'; tabId: string }
    | { type: 'rename-tab'; tabId: string; name: string }
    | { type: 'set-active-tab'; tabId: string }
    | { type: 'reorder-tabs'; fromIndex: number; toIndex: number };

const DEFAULT_TAB_ID = 'graph-tab-1';

function makeDefaultTabName(tabId: string): string {
    const match = /^graph-tab-(\d+)$/.exec(tabId);

    if (!match) {
        return 'Graph';
    }

    return `Graph ${match[1]}`;
}

function getTabNumber(tabId: string): number {
    const match = /^graph-tab-(\d+)$/.exec(tabId);

    return match ? Number(match[1]) : 0;
}

function getNextTabNumber(tabs: GraphWorkspaceTab[]): number {
    return (
        tabs.reduce((maxTabNumber, tab) => {
            return Math.max(maxTabNumber, getTabNumber(tab.id));
        }, 0) + 1
    );
}

function makeTab(tabId: string, name?: string): GraphWorkspaceTab {
    return {
        id: tabId,
        name: name?.trim() ?? makeDefaultTabName(tabId),
    };
}

function makeInitialWorkspaceState(): WorkspaceState {
    const persisted = loadWorkspaceState();

    if (persisted && persisted.tabs.length > 0) {
        const tabs = [...persisted.tabs]
            .sort((left, right) => left.order - right.order)
            .map((tab) => makeTab(tab.id, tab.name));

        return {
            tabs,
            activeTabId: tabs[0].id,
            nextTabNumber: getNextTabNumber(tabs),
        };
    }

    const initialTab = makeTab(DEFAULT_TAB_ID);

    return {
        tabs: [initialTab],
        activeTabId: initialTab.id,
        nextTabNumber: getNextTabNumber([initialTab]),
    };
}

function moveTab(
    tabs: GraphWorkspaceTab[],
    fromIndex: number,
    toIndex: number
): GraphWorkspaceTab[] {
    const cloned = [...tabs];
    const [moved] = cloned.splice(fromIndex, 1);

    cloned.splice(toIndex, 0, moved);
    return cloned;
}

function workspaceReducer(
    state: WorkspaceState,
    action: WorkspaceAction
): WorkspaceState {
    switch (action.type) {
        case 'create-tab': {
            const tabNumber = state.nextTabNumber;
            const tabId = `graph-tab-${String(tabNumber)}`;
            const tab = makeTab(tabId, action.name);

            return {
                ...state,
                tabs: [...state.tabs, tab],
                activeTabId: tab.id,
                nextTabNumber: state.nextTabNumber + 1,
            };
        }

        case 'close-tab': {
            const nextTabs = state.tabs.filter((tab) => tab.id !== action.tabId);

            if (nextTabs.length === state.tabs.length) {
                return state;
            }

            if (nextTabs.length === 0) {
                const replacementTabId = `graph-tab-${String(state.nextTabNumber)}`;
                const replacementTab = makeTab(replacementTabId);

                return {
                    ...state,
                    tabs: [replacementTab],
                    activeTabId: replacementTab.id,
                    nextTabNumber: state.nextTabNumber + 1,
                };
            }

            if (state.activeTabId !== action.tabId) {
                return {
                    ...state,
                    tabs: nextTabs,
                };
            }

            const closedIndex = state.tabs.findIndex(
                (tab) => tab.id === action.tabId
            );
            const replacementIndex = Math.max(closedIndex - 1, 0);
            const replacementTab = nextTabs[replacementIndex] ?? nextTabs[0];

            return {
                ...state,
                tabs: nextTabs,
                activeTabId: replacementTab.id,
            };
        }

        case 'rename-tab': {
            const name = action.name.trim() || makeDefaultTabName(action.tabId);

            const nextTabs = state.tabs.map((tab) =>
                tab.id === action.tabId ? { ...tab, name } : tab
            );

            return {
                ...state,
                tabs: nextTabs,
            };
        }

        case 'set-active-tab': {
            const tabExists = state.tabs.some((tab) => tab.id === action.tabId);

            if (!tabExists || state.activeTabId === action.tabId) {
                return state;
            }

            return {
                ...state,
                activeTabId: action.tabId,
            };
        }

        case 'reorder-tabs': {
            const { fromIndex, toIndex } = action;
            const maxIndex = state.tabs.length - 1;

            if (
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex > maxIndex ||
                toIndex > maxIndex ||
                fromIndex === toIndex
            ) {
                return state;
            }

            return {
                ...state,
                tabs: moveTab(state.tabs, fromIndex, toIndex),
            };
        }

        default: {
            return state;
        }
    }
}

export function GraphWorkspaceProvider({
    children,
}: Readonly<GraphWorkspaceProviderProps>) {
    const [workspace, dispatch] = useReducer(workspaceReducer, undefined, () =>
        makeInitialWorkspaceState()
    );

    const createTab = useCallback(
        (name?: string) => {
            const tabId = `graph-tab-${String(workspace.nextTabNumber)}`;
            dispatch({ type: 'create-tab', name });
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
