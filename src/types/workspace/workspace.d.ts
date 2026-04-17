export type GraphWorkspaceTab = {
    id: string;
    name: string;
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
    tabs: PersistedWorkspaceTab[];
};

export type GraphWorkspaceContextProperties = {
    tabs: GraphWorkspaceTab[];
    activeTabId: string;
    activeTab: GraphWorkspaceTab | null;
    createTab: (name?: string) => string;
    closeTab: (tabId: string) => void;
    renameTab: (tabId: string, name: string) => void;
    setActiveTab: (tabId: string) => void;
    reorderTabs: (fromIndex: number, toIndex: number) => void;
};
