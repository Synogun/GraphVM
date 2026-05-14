import { useSettingsStore } from '@/stores/settingsStore';

export function useSettings() {
    const ui = useSettingsStore((s) => s.ui);
    const graph = useSettingsStore((s) => s.graph);
    const shortcuts = useSettingsStore((s) => s.shortcuts);
    const setToast = useSettingsStore((s) => s.setToast);
    const setDisableElementsInfoPanel = useSettingsStore(
        (s) => s.setDisableElementsInfoPanel
    );
    const setArrangeOn = useSettingsStore((s) => s.setArrangeOn);
    const setLimits = useSettingsStore((s) => s.setLimits);
    const setDefaultPaddingOnActions = useSettingsStore(
        (s) => s.setDefaultPaddingOnActions
    );
    const setShortcuts = useSettingsStore((s) => s.setShortcuts);

    return {
        ui: {
            toast: ui.toast,
            setToast,
            disableElementsInfoPanel: ui.disableElementsInfoPanel,
            setDisableElementsInfoPanel,
        },
        graph: {
            arrangeOn: graph.arrangeOn,
            setArrangeOn,
            limits: graph.limits,
            setLimits,
            defaultPaddingOnActions: graph.defaultPaddingOnActions,
            setDefaultPaddingOnActions,
        },
        shortcuts,
        setShortcuts,
    };
}
