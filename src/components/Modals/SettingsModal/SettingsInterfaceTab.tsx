import { DefaultSettingsData } from '@/constants/settingsDefaults';
import type { SettingsData, ToastPosition } from '@/types/settings';
import { NumberInput, SelectInput } from '@Inputs';
import type { ChangeEvent } from 'react';

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

export function SettingsInterfaceTab({
    toast,
    setToast,
}: SettingsInterfaceTabProps) {
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

    return (
        <section className="grid gap-5 py-4 md:grid-cols-2">
            <NumberInput
                label="Toast duration (ms)"
                value={toast.duration}
                min={250}
                max={20000}
                step={250}
                onChange={handleToastDurationChange}
                defaultValue={DefaultSettingsData.ui.toast.duration}
            />

            <SelectInput
                label="Toast position"
                value={toast.position}
                onChange={handleToastPositionChange}
                options={TOAST_POSITION_OPTIONS}
                defaultValue={DefaultSettingsData.ui.toast.position}
            />
        </section>
    );
}

type SettingsInterfaceTabProps = {
    toast: SettingsData['ui']['toast'];
    setToast: (toast: SettingsData['ui']['toast']) => void;
};
