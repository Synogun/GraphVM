import { isString } from '@/types';
import { type TraversalParams } from '@/types/algorithms';
import { SelectInput } from '@Inputs';

type ParamsInputProps = Readonly<{
    params: TraversalParams;
    setParams: (params: TraversalParams) => void;
}>;

export function BFSParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.algorithm !== 'bfs') {
        return null;
    }

    const nodes = params.onlySelected
        ? (params.graphNodes?.filter((node) => node.selected()) ?? [])
        : (params.graphNodes ?? []);

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <div>
                <SelectInput
                    label="Start Node"
                    value={params.startNodeId}
                    disabled={nodes.length === 0}
                    tooltip={{
                        content:
                            'Select the starting node for the BFS traversal. ' +
                            'Only nodes present in the graph will be listed. ' +
                            "If 'Only Selected Nodes' is chosen in the Node Scope, " +
                            'only selected nodes will be available for selection.',
                    }}
                    options={nodes.map((node) => {
                        const label: unknown = node.data('label');

                        return {
                            label: isString(label) ? label.trim() : node.id(),
                            value: node.id(),
                        };
                    })}
                    onChange={(e) => {
                        setParams({ ...params, startNodeId: e.target.value });
                    }}
                />{' '}
                {params.onlySelected && nodes.length === 0 && (
                    <span className="ml-1 text-xs text-base-content/70"></span>
                )}
            </div>
            <div>
                <SelectInput
                    label="Node Scope"
                    value={params.onlySelected ? 'selected' : 'all'}
                    tooltip={{
                        content:
                            'Choose the scope of nodes to consider during traversal. ' +
                            'Selecting "All Nodes" will include every node in the graph, ' +
                            'while "Only Selected Nodes" will limit the traversal to elements ' +
                            'that are currently selected.',
                    }}
                    options={[
                        { label: 'All Nodes', value: 'all' },
                        { label: 'Only Selected Nodes', value: 'selected' },
                    ]}
                    onChange={(e) => {
                        setParams({
                            ...params,
                            onlySelected: e.target.value === 'selected',
                            startNodeId: nodes[0]?.id() ?? '',
                        });
                    }}
                />
                {params.onlySelected && nodes.length === 0 && (
                    <span className="ml-1 text-xs text-base-content/70">
                        No nodes selected
                    </span>
                )}
            </div>
        </div>
    );
}
