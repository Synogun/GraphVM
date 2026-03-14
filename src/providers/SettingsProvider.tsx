import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { loadPersistedState, savePersistedState } from '@/services/persistence';
import { isSettingsData } from '@/types/settingsTypeGuards';
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

    const [graphArrangeOn, setGraphArrangeOn] = useState(
        initialSettings.graph.arrangeOn
    );
    const [graphLimits, setGraphLimits] = useState(initialSettings.graph.limits);
    const [shortcuts, setShortcuts] = useState(initialSettings.shortcuts);

    useEffect(() => {
        const payload = {
            ui: { toast: uiToast },
            graph: { arrangeOn: graphArrangeOn, limits: graphLimits },
            shortcuts,
        };

        savePersistedState({
            storageKey: SETTINGS_STORAGE_KEY,
            state: payload,
        });
    }, [uiToast, graphArrangeOn, graphLimits, shortcuts]);

    const value = useMemo(
        () => ({
            ui: {
                toast: uiToast,
                setToast: setUiToast,
            },
            graph: {
                arrangeOn: graphArrangeOn,
                setArrangeOn: setGraphArrangeOn,
                limits: graphLimits,
                setLimits: setGraphLimits,
            },
            shortcuts,
            setShortcuts,
        }),
        [uiToast, graphArrangeOn, graphLimits, shortcuts]
    );

    return (
        <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
    );
}

type SettingsProviderProps = {
    children: ReactNode;
};
