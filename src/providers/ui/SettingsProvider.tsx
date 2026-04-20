import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { loadPersistedState, savePersistedState } from '@/services/persistence';
import { isSettingsData } from '@/types/ui/settings/typeGuards';
import { SettingsContext } from '@Contexts';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

const SETTINGS_STORAGE_KEY = 'graphvm.settings.v1';

function loadInitialSettings() {
    return loadPersistedState({
        storageKey: SETTINGS_STORAGE_KEY,
        fallbackState: DefaultSettingsData,
        isValidState: isSettingsData,
    });
}

export function SettingsProvider({ children }: Readonly<SettingsProviderProps>) {
    const initialSettings = loadInitialSettings();

    const [uiToast, setUiToast] = useState(initialSettings.ui.toast);
    const [disableElementsInfoPanel, setDisableElementsInfoPanel] = useState(
        initialSettings.ui.disableElementsInfoPanel
    );

    const [graphArrangeOn, setGraphArrangeOn] = useState(
        initialSettings.graph.arrangeOn
    );
    const [graphLimits, setGraphLimits] = useState(initialSettings.graph.limits);
    const [defaultPaddingOnActions, setDefaultPaddingOnActions] = useState(
        initialSettings.graph.defaultPaddingOnActions
    );
    const [shortcuts, setShortcuts] = useState(initialSettings.shortcuts);

    useEffect(() => {
        const payload = {
            ui: { toast: uiToast, disableElementsInfoPanel },
            graph: {
                arrangeOn: graphArrangeOn,
                limits: graphLimits,
                defaultPaddingOnActions,
            },
            shortcuts,
        };

        savePersistedState({
            storageKey: SETTINGS_STORAGE_KEY,
            state: payload,
        });
    }, [
        uiToast,
        disableElementsInfoPanel,
        graphArrangeOn,
        graphLimits,
        defaultPaddingOnActions,
        shortcuts,
    ]);

    const value = useMemo(
        () => ({
            ui: {
                toast: uiToast,
                setToast: setUiToast,
                disableElementsInfoPanel,
                setDisableElementsInfoPanel,
            },
            graph: {
                arrangeOn: graphArrangeOn,
                setArrangeOn: setGraphArrangeOn,
                limits: graphLimits,
                setLimits: setGraphLimits,
                defaultPaddingOnActions,
                setDefaultPaddingOnActions,
            },
            shortcuts,
            setShortcuts,
        }),
        [
            uiToast,
            disableElementsInfoPanel,
            graphArrangeOn,
            graphLimits,
            defaultPaddingOnActions,
            shortcuts,
        ]
    );

    return (
        <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
    );
}

type SettingsProviderProps = {
    children: ReactNode;
};
