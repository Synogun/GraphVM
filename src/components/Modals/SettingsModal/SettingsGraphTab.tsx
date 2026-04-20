import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { useSettings } from '@/contexts';
import type { SettingsData } from '@/types/ui/settings';
import { NumberInput, ToggleInput } from '@Inputs';
import type { ChangeEvent } from 'react';

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
                        tooltip={{
                            content:
                                'Toggle to enable or disable automatic arrangement when adding a node.',
                        }}
                    />

                    <ToggleInput
                        label="Add Edge"
                        checked={arrangeOn.addEdge}
                        onChange={handleArrangeOnChange('addEdge')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.addEdge}
                        stateLabels={arrangeToggleLabel}
                        tooltip={{
                            content:
                                'Toggle to enable or disable automatic arrangement when adding an edge.',
                        }}
                    />

                    <ToggleInput
                        label="Import"
                        checked={arrangeOn.import}
                        onChange={handleArrangeOnChange('import')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.import}
                        stateLabels={arrangeToggleLabel}
                        tooltip={{
                            content:
                                'Toggle to enable or disable automatic arrangement when importing a graph.',
                        }}
                    />

                    <ToggleInput
                        label="Edit Node"
                        checked={arrangeOn.editNode}
                        onChange={handleArrangeOnChange('editNode')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.editNode}
                        stateLabels={arrangeToggleLabel}
                        tooltip={{
                            content:
                                'Toggle to enable or disable automatic arrangement when editing a node.',
                        }}
                    />

                    <ToggleInput
                        label="Edit Edge"
                        checked={arrangeOn.editEdge}
                        onChange={handleArrangeOnChange('editEdge')}
                        defaultValue={DefaultSettingsData.graph.arrangeOn.editEdge}
                        stateLabels={arrangeToggleLabel}
                        tooltip={{
                            content:
                                'Toggle to enable or disable automatic arrangement when editing an edge.',
                        }}
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
