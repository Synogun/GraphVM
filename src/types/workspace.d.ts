export type GraphWorkspaceTab = {
    id: string;
    name: string;
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
