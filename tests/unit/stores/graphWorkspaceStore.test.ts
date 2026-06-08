import { DEFAULT_TAB_ID } from '@/services/persistence/workspaceStateService';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { beforeEach, describe, expect, it } from 'vitest';

const defaultTab = { id: DEFAULT_TAB_ID, name: 'Graph 1' };

describe('graphWorkspaceStore', () => {
    beforeEach(() => {
        useGraphWorkspaceStore.setState({
            tabs: [defaultTab],
            activeTabId: DEFAULT_TAB_ID,
            nextTabNumber: 2,
        });
    });

    it('initializes with one default tab', () => {
        const state = useGraphWorkspaceStore.getState();
        expect(state.tabs).toHaveLength(1);
        expect(state.tabs[0].id).toBe(DEFAULT_TAB_ID);
        expect(state.activeTabId).toBe(DEFAULT_TAB_ID);
    });

    it('createTab adds a new tab', () => {
        useGraphWorkspaceStore.getState().createTab();
        expect(useGraphWorkspaceStore.getState().tabs).toHaveLength(2);
    });

    it('createTab returns the new tab id', () => {
        const id = useGraphWorkspaceStore.getState().createTab();
        expect(id).toBe('graph-tab-2');
    });

    it('createTab sets new tab as active', () => {
        useGraphWorkspaceStore.getState().createTab();
        expect(useGraphWorkspaceStore.getState().activeTabId).toBe('graph-tab-2');
    });

    it('createTab uses provided name', () => {
        useGraphWorkspaceStore.getState().createTab('Custom');
        const tab = useGraphWorkspaceStore
            .getState()
            .tabs.find((t) => t.id === 'graph-tab-2');
        expect(tab?.name).toBe('Custom');
    });

    it('createTab uses default name when no name given', () => {
        useGraphWorkspaceStore.getState().createTab();
        const tab = useGraphWorkspaceStore
            .getState()
            .tabs.find((t) => t.id === 'graph-tab-2');
        expect(tab?.name).toBe('Graph 2');
    });

    it('closeTab removes the tab', () => {
        useGraphWorkspaceStore.getState().createTab();
        useGraphWorkspaceStore.getState().closeTab('graph-tab-2');
        expect(useGraphWorkspaceStore.getState().tabs).toHaveLength(1);
        expect(
            useGraphWorkspaceStore
                .getState()
                .tabs.find((t) => t.id === 'graph-tab-2')
        ).toBeUndefined();
    });

    it('closeTab on last tab creates a replacement', () => {
        useGraphWorkspaceStore.getState().closeTab(DEFAULT_TAB_ID);
        expect(useGraphWorkspaceStore.getState().tabs).toHaveLength(1);
        expect(useGraphWorkspaceStore.getState().tabs[0].id).not.toBe(
            DEFAULT_TAB_ID
        );
    });

    it('closeTab on active tab switches to adjacent tab', () => {
        useGraphWorkspaceStore.getState().createTab();
        useGraphWorkspaceStore.getState().setActiveTab('graph-tab-2');
        useGraphWorkspaceStore.getState().closeTab('graph-tab-2');
        expect(useGraphWorkspaceStore.getState().activeTabId).toBe(DEFAULT_TAB_ID);
    });

    it('closeTab on non-active tab keeps active tab unchanged', () => {
        useGraphWorkspaceStore.getState().createTab();
        useGraphWorkspaceStore.getState().closeTab('graph-tab-2');
        expect(useGraphWorkspaceStore.getState().activeTabId).toBe(DEFAULT_TAB_ID);
    });

    it('renameTab changes tab name', () => {
        useGraphWorkspaceStore.getState().renameTab(DEFAULT_TAB_ID, 'New Name');
        const tab = useGraphWorkspaceStore
            .getState()
            .tabs.find((t) => t.id === DEFAULT_TAB_ID);
        expect(tab?.name).toBe('New Name');
    });

    it('setActiveTab changes active tab', () => {
        useGraphWorkspaceStore.getState().createTab();
        useGraphWorkspaceStore.getState().setActiveTab('graph-tab-2');
        expect(useGraphWorkspaceStore.getState().activeTabId).toBe('graph-tab-2');
    });

    it('setActiveTab on non-existent tab does nothing', () => {
        useGraphWorkspaceStore.getState().setActiveTab('graph-tab-99');
        expect(useGraphWorkspaceStore.getState().activeTabId).toBe(DEFAULT_TAB_ID);
    });

    it('reorderTabs moves tab to new position', () => {
        useGraphWorkspaceStore.getState().createTab();
        useGraphWorkspaceStore.getState().createTab();
        useGraphWorkspaceStore.getState().reorderTabs(0, 2);
        expect(useGraphWorkspaceStore.getState().tabs[2].id).toBe(DEFAULT_TAB_ID);
    });

    it('reorderTabs with same index does nothing', () => {
        const before = useGraphWorkspaceStore.getState().tabs.map((t) => t.id);
        useGraphWorkspaceStore.getState().reorderTabs(0, 0);
        expect(useGraphWorkspaceStore.getState().tabs.map((t) => t.id)).toEqual(
            before
        );
    });
});
