import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { loadPersistedState, savePersistedState } from '@/services/persistence';
import type { SettingsData } from '@/types/ui/settings';
import { isSettingsData } from '@/types/ui/settings/typeGuards';
import { create } from 'zustand';

export const SETTINGS_STORAGE_KEY = 'graphvm.settings.v1';

type SettingsStore = SettingsData & {
    setToast: (toast: SettingsData['ui']['toast']) => void;
    setDisableElementsInfoPanel: (value: boolean) => void;
    setArrangeOn: (arrangeOn: SettingsData['graph']['arrangeOn']) => void;
    setLimits: (limits: SettingsData['graph']['limits']) => void;
    setDefaultPaddingOnActions: (value: number) => void;
    setShortcuts: (shortcuts: SettingsData['shortcuts']) => void;
};

const initial = loadPersistedState({
    storageKey: SETTINGS_STORAGE_KEY,
    fallbackState: DefaultSettingsData,
    isValidState: isSettingsData,
});

export const useSettingsStore = create<SettingsStore>()((set) => ({
    ui: initial.ui,
    graph: initial.graph,
    shortcuts: initial.shortcuts,
    setToast: (toast) => {
        set((s) => ({ ui: { ...s.ui, toast } }));
    },
    setDisableElementsInfoPanel: (value) => {
        set((s) => ({ ui: { ...s.ui, disableElementsInfoPanel: value } }));
    },
    setArrangeOn: (arrangeOn) => {
        set((s) => ({ graph: { ...s.graph, arrangeOn } }));
    },
    setLimits: (limits) => {
        set((s) => ({ graph: { ...s.graph, limits } }));
    },
    setDefaultPaddingOnActions: (value) => {
        set((s) => ({ graph: { ...s.graph, defaultPaddingOnActions: value } }));
    },
    setShortcuts: (shortcuts) => {
        set({ shortcuts });
    },
}));

useSettingsStore.subscribe((state) => {
    savePersistedState({
        storageKey: SETTINGS_STORAGE_KEY,
        state: {
            ui: state.ui,
            graph: state.graph,
            shortcuts: state.shortcuts,
        },
    });
});
