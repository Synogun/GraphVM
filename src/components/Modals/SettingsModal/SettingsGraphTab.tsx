import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { useSettings } from '@/contexts';
import type { SettingsData } from '@/types/ui/settings';
import { NumberInput, ToggleInput } from '@Inputs';
import { useMemo, type ChangeEvent } from 'react';

export function SettingsGraphTab() {
    const {
        graph: {
            arrangeOn,
            setArrangeOn,
            limits,
            setLimits,
            defaultPaddingOnActions,
            setDefaultPaddingOnActions,
        },
    } = useSettings();

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
    const arrangeOnToggleData = useMemo(
        () => [
            {
                label: 'Add Node',
                key: 'addNode',
                checked: arrangeOn.addNode,
                defaultValue: DefaultSettingsData.graph.arrangeOn.addNode,
                tooltip:
                    'Toggle to enable or disable automatic arrangement when adding a node.',
            },
            {
                label: 'Add Edge',
                key: 'addEdge',
                checked: arrangeOn.addEdge,
                defaultValue: DefaultSettingsData.graph.arrangeOn.addEdge,
                tooltip:
                    'Toggle to enable or disable automatic arrangement when adding an edge.',
            },
            {
                label: 'Edit Node',
                key: 'editNode',
                checked: arrangeOn.editNode,
                defaultValue: DefaultSettingsData.graph.arrangeOn.editNode,
                tooltip:
                    'Toggle to enable or disable automatic arrangement when editing a node.',
            },
            {
                label: 'Edit Edge',
                key: 'editEdge',
                checked: arrangeOn.editEdge,
                defaultValue: DefaultSettingsData.graph.arrangeOn.editEdge,
                tooltip:
                    'Toggle to enable or disable automatic arrangement when editing an edge.',
            },
            {
                label: 'Import',
                key: 'import',
                checked: arrangeOn.import,
                defaultValue: DefaultSettingsData.graph.arrangeOn.import,
                tooltip:
                    'Toggle to enable or disable automatic arrangement when importing a graph.',
            },
            {
                label: 'Layout Change',
                key: 'layoutChange',
                checked: arrangeOn.layoutChange,
                defaultValue: DefaultSettingsData.graph.arrangeOn.layoutChange,
                tooltip:
                    'Toggle to enable or disable automatic arrangement when changing the layout.',
            },
            {
                label: 'Tab Change',
                key: 'tabChange',
                checked: arrangeOn.tabChange,
                defaultValue: DefaultSettingsData.graph.arrangeOn.tabChange,
                tooltip:
                    'Toggle to enable or disable automatic arrangement when changing tabs.',
            },
        ],
        [arrangeOn]
    );

    return (
        <section className="grid gap-6 py-4 lg:grid-cols-2">
            <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                    Arrange On
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {arrangeOnToggleData.map(({ key, ...toggleData }) => (
                        <ToggleInput
                            key={key}
                            label={toggleData.label}
                            checked={toggleData.checked}
                            onChange={handleArrangeOnChange(
                                key as keyof SettingsData['graph']['arrangeOn']
                            )}
                            defaultValue={toggleData.defaultValue}
                            stateLabels={arrangeToggleLabel}
                            tooltip={{ content: toggleData.tooltip }}
                        />
                    ))}
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
                        tooltip={{
                            content:
                                'The maximum number of nodes allowed in the graph. Setting this limit helps maintain performance and usability, especially for larger graphs. ',
                        }}
                    />

                    <NumberInput
                        label="Maximum edges"
                        value={limits.maxEdges}
                        min={1}
                        step={100}
                        onChange={handleLimitChange('maxEdges')}
                        defaultValue={DefaultSettingsData.graph.limits.maxEdges}
                        tooltip={{
                            content:
                                'The maximum number of edges allowed in the graph. Note that the actual maximum may also be constrained by the node limit, as each node can only have a certain number of edges.',
                        }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                    Actions
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                    <NumberInput
                        label="Default padding on actions"
                        value={defaultPaddingOnActions}
                        min={0}
                        step={5}
                        onChange={(e) => {
                            const parsed = Number.parseInt(e.target.value, 10);
                            setDefaultPaddingOnActions(
                                Number.isFinite(parsed) ? Math.max(0, parsed) : 0
                            );
                        }}
                        defaultValue={
                            DefaultSettingsData.graph.defaultPaddingOnActions
                        }
                        tooltip={{
                            content:
                                'The padding (in pixels) applied to the graph when arranging or centering.',
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
