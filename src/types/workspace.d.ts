export type GraphWorkspaceTab = {
    id: string;
    name: string;
    pendingSave: boolean;
};

export type PersistedWorkspaceSchemaVersion = 1;

export type PersistedWorkspaceTab = {
    id: string;
    name: string;
    order: number;
    graph: cytoscape.CytoscapeOptions | null;
};

export type PersistedWorkspaceState = {
    version: PersistedWorkspaceSchemaVersion;
    activeTabId: string;
    tabs: PersistedWorkspaceTab[];
};

export type GraphWorkspaceContextProperties = {
    tabs: GraphWorkspaceTab[];
    activeTabId: string;
    activeTab: GraphWorkspaceTab | null;
    hasPendingSave: boolean;
    isInitialized: boolean;
    saveRequestVersion: number;
    initializeWorkspace: (state: PersistedWorkspaceState | null) => boolean;
    requestSaveWorkspace: () => void;
    markTabPendingSave: (tabId: string) => void;
    clearTabPendingSave: (tabId: string) => void;
    clearAllPendingSave: () => void;
    createTab: (name?: string) => string;
    closeTab: (tabId: string) => void;
    renameTab: (tabId: string, name: string) => void;
    setActiveTab: (tabId: string) => void;
    reorderTabs: (fromIndex: number, toIndex: number) => void;
};
