import {
    makeInitialWorkspaceState,
    workspaceReducer,
    type WorkspaceState,
} from '@/services/persistence/workspaceStateService';
import { useAnimationStore } from '@/stores/animationStore';
import { create } from 'zustand';

type GraphWorkspaceStore = WorkspaceState & {
    createTab: (name?: string) => string;
    closeTab: (tabId: string) => void;
    renameTab: (tabId: string, name: string) => void;
    setActiveTab: (tabId: string) => void;
    reorderTabs: (fromIndex: number, toIndex: number) => void;
};

export const useGraphWorkspaceStore = create<GraphWorkspaceStore>()((set, get) => ({
    ...makeInitialWorkspaceState(),

    createTab: (name) => {
        const { nextTabNumber } = get();
        const tabId = `graph-tab-${String(nextTabNumber)}`;
        set((s) => workspaceReducer(s, { type: 'create-tab', tabId, name }));
        return tabId;
    },

    closeTab: (tabId) => {
        set((s) => workspaceReducer(s, { type: 'close-tab', tabId }));
        useAnimationStore.getState().cleanupTab(tabId);
    },

    renameTab: (tabId, name) => {
        set((s) => workspaceReducer(s, { type: 'rename-tab', tabId, name }));
    },

    setActiveTab: (tabId) => {
        set((s) => workspaceReducer(s, { type: 'set-active-tab', tabId }));
    },

    reorderTabs: (fromIndex, toIndex) => {
        set((s) =>
            workspaceReducer(s, { type: 'reorder-tabs', fromIndex, toIndex })
        );
    },
}));
