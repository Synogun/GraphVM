import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { useSettings } from '@/contexts/ui';
import type { ToastPosition } from '@/types/ui';
import { ValidDaisyUIThemes, isValidDaisyUITheme } from '@/types/ui/settings/typeGuards';
import { NumberInput, SelectInput, ToggleInput } from '@Inputs';
import type { ChangeEvent } from 'react';

const THEME_OPTIONS = [...ValidDaisyUIThemes]
    .sort((a, b) => a.localeCompare(b))
    .map((theme) => ({
        label: theme.charAt(0).toUpperCase() + theme.slice(1),
        value: theme,
    }));

const TOAST_POSITION_OPTIONS: { label: string; value: ToastPosition }[] = [
    { label: 'Top Left', value: 'top-left' },
    { label: 'Top Center', value: 'top-center' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Center Left', value: 'center-left' },
    { label: 'Center Center', value: 'center-center' },
    { label: 'Center Right', value: 'center-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Bottom Center', value: 'bottom-center' },
    { label: 'Bottom Right', value: 'bottom-right' },
];

export function SettingsInterfaceTab() {
    const {
        ui: {
            toast,
            setToast,
            disableElementsInfoPanel,
            setDisableElementsInfoPanel,
            theme,
            setTheme,
        },
    } = useSettings();

    const handleToastDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
        const parsed = Number.parseInt(event.target.value, 10);
        const duration = Number.isFinite(parsed)
            ? Math.max(250, parsed)
            : DefaultSettingsData.ui.toast.duration;

        setToast({
            ...toast,
            duration,
        });
    };

    const handleToastPositionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const position = event.target.value as ToastPosition;

        setToast({
            ...toast,
            position,
        });
    };

    const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (isValidDaisyUITheme(value)) setTheme(value);
    };

    const handleDisableElementsInfoPanelChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setDisableElementsInfoPanel(event.target.checked);
    };

    return (
        <section className="grid gap-6 py-4 lg:grid-cols-2">
            <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                    Appearance
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                    <SelectInput
                        label="Theme"
                        value={theme}
                        onChange={handleThemeChange}
                        options={THEME_OPTIONS}
                        defaultValue={DefaultSettingsData.ui.theme}
                        tooltip={{
                            content: 'Visual theme for the application.',
                        }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                    Notifications
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                    <NumberInput
                        label="Toast duration (ms)"
                        value={toast.duration}
                        min={250}
                        max={20000}
                        step={250}
                        onChange={handleToastDurationChange}
                        defaultValue={DefaultSettingsData.ui.toast.duration}
                        tooltip={{
                            content:
                                'Duration in milliseconds for which toasts are displayed. Minimum is 250ms.',
                        }}
                    />

                    <SelectInput
                        label="Toast position"
                        value={toast.position}
                        onChange={handleToastPositionChange}
                        options={TOAST_POSITION_OPTIONS}
                        defaultValue={DefaultSettingsData.ui.toast.position}
                        tooltip={{
                            content: 'Position on the screen where toasts will appear.',
                        }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                    Interface
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                    <ToggleInput
                        label="Disable Elements Info Panel"
                        checked={disableElementsInfoPanel}
                        onChange={handleDisableElementsInfoPanelChange}
                        defaultValue={DefaultSettingsData.ui.disableElementsInfoPanel}
                        stateLabels={{ on: 'Disabled', off: 'Enabled' }}
                        tooltip={{
                            content:
                                'When enabled, the panel that shows information about selected nodes and edges will be hidden.',
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
