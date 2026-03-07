import { DefaultSettingsData } from '@/constants/settingsDefaults';
import type { SettingsData } from '@/types/settings';
import { NumberInput, ToggleInput } from '@Inputs';
import type { ChangeEvent } from 'react';

export function SettingsGraphTab({
    arrangeOn,
    setArrangeOn,
    limits,
    setLimits,
}: SettingsGraphTabProps) {
    const handleArrangeOnChange =
        (key: keyof SettingsData['graph']['arrangeOn']) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            setArrangeOn({
                ...arrangeOn,
                [key]: event.target.checked,
            });
        };

    const handleLimitChange =
        (key: keyof SettingsData['graph']['limits']) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const parsed = Number.parseInt(event.target.value, 10);
            const nextValue = Number.isFinite(parsed) ? Math.max(1, parsed) : 1;

            setLimits({
                ...limits,
                [key]: nextValue,
            });
        };

    const arrangeToggleLabel = { on: 'Arranging', off: 'Not Arranging' };

    return (
        <section className="grid gap-6 py-4 lg:grid-cols-2">
            <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                    Arrange On
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <ToggleInput
                        label="Add Node"
                        checked={arrangeOn.addNode}
                        onChange={handleArrangeOnChange('addNode')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.addNode}
                        stateLabels={arrangeToggleLabel}
                    />

                    <ToggleInput
                        label="Add Edge"
                        checked={arrangeOn.addEdge}
                        onChange={handleArrangeOnChange('addEdge')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.addEdge}
                        stateLabels={arrangeToggleLabel}
                    />

                    <ToggleInput
                        label="Import"
                        checked={arrangeOn.import}
                        onChange={handleArrangeOnChange('import')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.import}
                        stateLabels={arrangeToggleLabel}
                    />

                    <ToggleInput
                        label="Edit Node"
                        checked={arrangeOn.editNode}
                        onChange={handleArrangeOnChange('editNode')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.editNode}
                        stateLabels={arrangeToggleLabel}
                    />

                    <ToggleInput
                        label="Edit Edge"
                        checked={arrangeOn.editEdge}
                        onChange={handleArrangeOnChange('editEdge')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.editEdge}
                        stateLabels={arrangeToggleLabel}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                    Limits
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                    <NumberInput
                        label="Maximum nodes"
                        value={limits.maxNodes}
                        min={1}
                        step={100}
                        onChange={handleLimitChange('maxNodes')}
                        defaultValue={DefaultSettingsData.graph.limits.maxNodes}
                    />

                    <NumberInput
                        label="Maximum edges"
                        value={limits.maxEdges}
                        min={1}
                        step={100}
                        onChange={handleLimitChange('maxEdges')}
                        defaultValue={DefaultSettingsData.graph.limits.maxEdges}
                    />
                </div>
            </div>
        </section>
    );
}

type SettingsGraphTabProps = {
    arrangeOn: SettingsData['graph']['arrangeOn'];
    setArrangeOn: (arrangeOn: SettingsData['graph']['arrangeOn']) => void;
    limits: SettingsData['graph']['limits'];
    setLimits: (limits: SettingsData['graph']['limits']) => void;
};
