import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { useSettingsStore } from '@/stores/settingsStore';
import { beforeEach, describe, expect, it } from 'vitest';

const defaultUi = DefaultSettingsData.ui;
const defaultGraph = DefaultSettingsData.graph;
const defaultShortcuts = DefaultSettingsData.shortcuts;

describe('settingsStore', () => {
    beforeEach(() => {
        useSettingsStore.setState({
            ui: defaultUi,
            graph: defaultGraph,
            shortcuts: defaultShortcuts,
        });
    });

    it('initializes with default settings', () => {
        const state = useSettingsStore.getState();
        expect(state.ui).toEqual(defaultUi);
        expect(state.graph).toEqual(defaultGraph);
        expect(state.shortcuts).toEqual(defaultShortcuts);
    });

    it('setToast updates ui.toast', () => {
        const newToast = { duration: 5000, position: 'top-right' as const };
        useSettingsStore.getState().setToast(newToast);
        expect(useSettingsStore.getState().ui.toast).toEqual(newToast);
    });

    it('setToast does not affect other ui fields', () => {
        useSettingsStore
            .getState()
            .setToast({ duration: 5000, position: 'top-right' });
        expect(useSettingsStore.getState().ui.disableElementsInfoPanel).toBe(
            defaultUi.disableElementsInfoPanel
        );
    });

    it('setDisableElementsInfoPanel updates ui.disableElementsInfoPanel', () => {
        useSettingsStore.getState().setDisableElementsInfoPanel(true);
        expect(useSettingsStore.getState().ui.disableElementsInfoPanel).toBe(true);
    });

    it('setArrangeOn updates graph.arrangeOn', () => {
        const newArrangeOn = { ...defaultGraph.arrangeOn, addNode: false };
        useSettingsStore.getState().setArrangeOn(newArrangeOn);
        expect(useSettingsStore.getState().graph.arrangeOn).toEqual(newArrangeOn);
    });

    it('setLimits updates graph.limits', () => {
        useSettingsStore.getState().setLimits({ maxNodes: 100, maxEdges: 200 });
        expect(useSettingsStore.getState().graph.limits).toEqual({
            maxNodes: 100,
            maxEdges: 200,
        });
    });

    it('setDefaultPaddingOnActions updates graph.defaultPaddingOnActions', () => {
        useSettingsStore.getState().setDefaultPaddingOnActions(60);
        expect(useSettingsStore.getState().graph.defaultPaddingOnActions).toBe(60);
    });

    it('setShortcuts updates shortcuts', () => {
        const newShortcuts = { ...defaultShortcuts, addNode: 'Q' };
        useSettingsStore.getState().setShortcuts(newShortcuts);
        expect(useSettingsStore.getState().shortcuts).toEqual(newShortcuts);
    });
});
