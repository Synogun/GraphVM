import { SelectInput } from '@/components/common';
import { ParsedErrorToasts } from '@/constants';
import { DefaultTraversalParams } from '@/constants/algorithmDefaults';
import { useGetGraph } from '@/hooks';
import { runBFSAnimation, runDFSAnimation } from '@/services/algorithms/traversal';
import { useAnimationStore } from '@/stores/animationStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import {
    isTraversalAlgorithm,
    ValidTraversalAlgorithms,
    type TraversalAlgorithm,
    type TraversalParams,
} from '@/types';
import { parseKebabCase } from '@/utils/elements';
import { useToasts } from '@Contexts';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import { BFSParamsInput, DFSParamsInput } from './TraversalAlgorithmsParams';

const ALGORITHM_MAP: Record<
    TraversalAlgorithm,
    {
        params: TraversalParams;
        description: string;
    }
> = {
    bfs: {
        params: {
            algorithm: 'bfs',
            startNodeId: '',
            directed: false,
            onlySelected: false,
            graphNodes: null,
        },
        description:
            'Breadth-First Search (BFS) explores the graph level by level, ' +
            'starting from a given source node and visiting all its neighbors ' +
            'before moving to the next level.',
    },
    dfs: {
        params: {
            algorithm: 'dfs',
            startNodeId: '',
            directed: false,
            onlySelected: false,
            graphNodes: null,
        },
        description:
            'Depth-First Search (DFS) explores as far as possible along each ' +
            'branch before backtracking, starting from a given source node.',
    },
};

function TraversalParamsSection({
    params,
    setParams,
    graphNodes,
}: Readonly<TraversalParamsSectionProps>) {
    switch (params.algorithm) {
        case 'bfs':
            return (
                <BFSParamsInput
                    params={{ ...params, graphNodes }}
                    setParams={setParams}
                />
            );
        case 'dfs':
            return (
                <DFSParamsInput
                    params={{ ...params, graphNodes }}
                    setParams={setParams}
                />
            );
        default:
            return (
                <div className="text-sm italic text-gray-500">
                    Parameter inputs for this algorithm are not implemented yet.
                </div>
            );
    }
}

type TraversalParamsSectionProps = {
    params: TraversalParams;
    setParams: React.Dispatch<React.SetStateAction<TraversalParams>>;
    graphNodes: Extract<TraversalParams, { algorithm: 'bfs' }>['graphNodes'];
};

export type TraversalTabRef = {
    handleRun: () => void;
};

type TraversalTabProps = {
    isOpen: boolean;
};

export const TraversalTab = forwardRef<TraversalTabRef, TraversalTabProps>(
    ({ isOpen }, ref) => {
        const graph = useGetGraph('main-graph');
        const { addToast } = useToasts();
        const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
        const { initAnimation, play } = useAnimationStore.getState();

        const [params, setParams] = useState<TraversalParams>(() => {
            const activeGraph = graph.current;
            if (DefaultTraversalParams.algorithm === 'bfs') {
                return {
                    ...DefaultTraversalParams,
                    directed: Boolean(activeGraph?.data('directed')),
                    startNodeId: activeGraph?.nodes()[0]?.id() ?? '',
                    graphNodes: activeGraph ? activeGraph.nodes() : null,
                };
            }
            return { ...DefaultTraversalParams };
        });

        useEffect(() => {
            const activeGraph = graph.current;
            if (!activeGraph) return;

            // graph.current is null during useState init (set by useGetGraph's effect); this effect runs after
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setParams((prev) => {
                if (prev.algorithm !== 'bfs') return prev;
                const nodes = activeGraph.nodes();

                return {
                    ...prev,
                    directed: Boolean(activeGraph.data('directed')),
                    startNodeId: prev.startNodeId || nodes.eq(0).id(),
                    graphNodes: nodes,
                };
            });
        }, [graph]);

        useEffect(() => {
            if (!isOpen) return;
            const activeGraph = graph.current;
            if (!activeGraph) return;

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setParams((prev) => {
                if (prev.algorithm !== 'bfs') {
                    return prev;
                }
                const nodes = activeGraph.nodes();
                const nodeIds = nodes.map((n) => n.id());
                const validStartId = nodeIds.includes(prev.startNodeId)
                    ? prev.startNodeId
                    : (nodeIds[0] ?? '');

                return {
                    ...prev,
                    directed: Boolean(activeGraph.data('directed')),
                    startNodeId: validStartId,
                    graphNodes: nodes,
                };
            });
        }, [isOpen, graph]);

        const handleRun = () => {
            const activeGraph = graph.current;

            if (!activeGraph) {
                addToast(ParsedErrorToasts.GraphNotFound);
                return;
            }

            if (!activeTabId) {
                addToast({ type: 'error', message: 'No active tab found.' });
                return;
            }

            if (params.algorithm === 'bfs' && !params.startNodeId) {
                addToast({
                    type: 'error',
                    message: 'Please select a start node before running.',
                });
                return;
            }

            switch (params.algorithm) {
                case 'bfs': {
                    const animation = runBFSAnimation({
                        graph: activeGraph,
                        startNodeId: params.startNodeId,
                        directed: Boolean(activeGraph.data('directed')),
                        onlySelected: params.onlySelected,
                    });
                    initAnimation(activeTabId, animation);
                    play(activeTabId);
                    break;
                }
                case 'dfs': {
                    const animation = runDFSAnimation({
                        graph: activeGraph,
                        startNodeId: params.startNodeId,
                        directed: Boolean(activeGraph.data('directed')),
                        onlySelected: params.onlySelected,
                    });
                    initAnimation(activeTabId, animation);
                    play(activeTabId);
                    break;
                }
                default:
                    addToast({
                        type: 'error',
                        message: 'Algorithm not implemented',
                    });
            }
            setParams({ ...DefaultTraversalParams });
        };

        useImperativeHandle(ref, () => ({ handleRun }));

        const updateAlgorithm = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newAlgorithm = event.target.value;

            if (!isTraversalAlgorithm(newAlgorithm)) {
                addToast({
                    type: 'error',
                    message: `Invalid algorithm selected: ${newAlgorithm}`,
                });
                return;
            }

            const activeGraph = graph.current;
            if (newAlgorithm === 'bfs') {
                setParams((prev) => ({
                    ...prev,
                    ...ALGORITHM_MAP.bfs.params,
                    directed: Boolean(activeGraph?.data('directed')),
                    startNodeId: activeGraph?.nodes()[0]?.id() ?? '',
                    graphNodes: activeGraph ? activeGraph.nodes() : null,
                }));
            } else {
                setParams((prev) => ({
                    ...prev,
                    ...ALGORITHM_MAP.dfs.params,
                    directed: Boolean(activeGraph?.data('directed')),
                    startNodeId: activeGraph?.nodes()[0]?.id() ?? '',
                    graphNodes: activeGraph ? activeGraph.nodes() : null,
                }));
            }
        };

        const graphAlgorithmSelectOptions = useMemo(() => {
            return ValidTraversalAlgorithms.map((algorithm) => ({
                label: parseKebabCase(algorithm),
                value: algorithm,
            }));
        }, []);

        return (
            <div className="flex flex-col gap-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <SelectInput
                            label="Traversal Algorithm"
                            options={graphAlgorithmSelectOptions}
                            value={params.algorithm}
                            onChange={updateAlgorithm}
                        />
                        <p className="ml-1 mt-1 text-xs text-base-content/70">
                            Select the traversal algorithm to run.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1 ml-1 text-xs opacity-50">
                            <strong>DESCRIPTION</strong>
                        </span>
                        <div className="flex flex-1 items-center rounded-lg bg-base-200 p-3 text-sm text-base-content/80">
                            {ALGORITHM_MAP[params.algorithm].description}
                        </div>
                    </div>
                </div>

                <div className="divider text-sm opacity-50 mb-0" />

                <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">Parameters</span>
                    <p className="text-xs text-base-content/70">
                        Select the properties of the graph to traverse. The available
                        options will depend on the chosen traversal algorithm.
                    </p>
                </div>

                <TraversalParamsSection
                    params={params}
                    setParams={setParams}
                    graphNodes={graph.current?.nodes() ?? null}
                />
            </div>
        );
    }
);
