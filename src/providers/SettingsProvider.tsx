import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { isSettingsData } from '@/types/settingsTypeGuards';
import { SettingsContext } from '@Contexts';
import { useEffect, useState, type ReactNode } from 'react';

const SETTINGS_STORAGE_KEY = 'graphvm.settings.v1';

function loadInitialSettings() {
    const fallback = DefaultSettingsData;

    if (typeof window === 'undefined') {
        return fallback;
    }

    try {
        const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

        if (!raw) {
            return fallback;
        }

        const parsed: unknown = JSON.parse(raw);
        if (!isSettingsData(parsed)) {
            return fallback;
        }

        return parsed;
    } catch {
        return fallback;
    }
}

export function SettingsProvider({ children }: SettingsProviderProps) {
    const initialSettings = loadInitialSettings();

    const [uiToast, setUiToast] = useState(initialSettings.ui.toast);

    const [graphArrangeOn, setGraphArrangeOn] = useState(
        initialSettings.graph.arrangeOn
    );
    const [graphLimits, setGraphLimits] = useState(initialSettings.graph.limits);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const payload = {
            ui: { toast: uiToast },
            graph: { arrangeOn: graphArrangeOn, limits: graphLimits },
        };

        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    }, [uiToast, graphArrangeOn, graphLimits]);

    const value = {
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
    };

    return (
        <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
    );
}

type SettingsProviderProps = {
    children: ReactNode;
};
