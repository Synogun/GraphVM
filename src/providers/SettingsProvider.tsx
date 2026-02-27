import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { SettingsContext } from '@Contexts';
import { useState, type ReactNode } from 'react';

export function SettingsProvider({ children }: SettingsProviderProps) {
    const [uiToast, setUiToast] = useState(DefaultSettingsData.ui.toast);

    const [graphArrangeOn, setGraphArrangeOn] = useState(
        DefaultSettingsData.graph.arrangeOn
    );

    const value = {
        ui: {
            toast: uiToast,
            setToast: setUiToast,
        },
        graph: {
            arrangeOn: graphArrangeOn,
            setArrangeOn: setGraphArrangeOn,
        },
    };

    return (
        <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
    );
}

type SettingsProviderProps = {
    children: ReactNode;
};
