import type React from 'react';
import { type TraversalParams } from '@/types/algorithms';
import { SelectInput } from '@Inputs';

type ParamsInputProps = Readonly<{
    params: TraversalParams;
    setParams: React.Dispatch<React.SetStateAction<TraversalParams>>;
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
                        content: 'Select the starting node for the BFS traversal.',
                    }}
                    options={nodes.map((node) => {
                        return {
                            label: `${String(node.data('label'))}  (${node.id()})`,
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
                        const newOnlySelected = e.target.value === 'selected';
                        const newNodes = newOnlySelected
                            ? (params.graphNodes?.filter((node) =>
                                  node.selected()
                              ) ?? [])
                            : (params.graphNodes ?? []);
                        setParams({
                            ...params,
                            onlySelected: newOnlySelected,
                            startNodeId: newNodes[0]?.id() ?? '',
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

export function DFSParamsInput({
    params,
    setParams,
}: Readonly<{
    params: Extract<TraversalParams, { algorithm: 'dfs' }>;
    setParams: React.Dispatch<React.SetStateAction<TraversalParams>>;
}>) {
    const nodes = params.onlySelected
        ? (params.graphNodes?.filter((node) => node.selected()) ?? [])
        : (params.graphNodes ?? []);

    const nodeOptions = [...nodes].map((node) => ({
        label: `${String(node.data('label') ?? '')}  (${node.id()})`,
        value: node.id(),
    }));

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <div>
                <SelectInput
                    label="Start Node"
                    value={params.startNodeId}
                    disabled={nodes.length === 0}
                    tooltip={{
                        content: 'Select the starting node for the DFS traversal.',
                    }}
                    options={nodeOptions}
                    onChange={(e) => {
                        setParams((prev) => ({ ...prev, startNodeId: e.target.value }));
                    }}
                />
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
                        const newOnlySelected = e.target.value === 'selected';
                        const newNodes = newOnlySelected
                            ? (params.graphNodes?.filter((node) => node.selected()) ?? [])
                            : (params.graphNodes ?? []);
                        setParams((prev) => ({
                            ...prev,
                            onlySelected: newOnlySelected,
                            startNodeId: newNodes[0]?.id() ?? '',
                        }));
                    }}
                />
            </div>
        </div>
    );
}
