import { SelectInput } from '@/components/common';
import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import { DefaultTraversalParams } from '@/constants/algorithmDefaults';
import { useGetGraph } from '@/hooks';
import { runBFSAnimation } from '@/services/algorithms/bfsAnimationService';
import { runDFSAnimation } from '@/services/algorithms/dfsAnimationService';
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
    dijkstra: {
        params: {
            algorithm: 'dijkstra',
        },
        description:
            "Dijkstra's Algorithm finds the shortest path between nodes in a graph, " +
            'which may represent, for example, road networks. It uses a priority queue ' +
            'to explore the graph based on cumulative distance from the source node.',
    },
    'a-star': {
        params: {
            algorithm: 'a-star',
        },
        description:
            "A* Search Algorithm is an extension of Dijkstra's Algorithm that uses " +
            'heuristics to estimate the cost to reach the goal, ' +
            'allowing it to find the shortest path more efficiently in many cases.',
    },
    'greedy-best-first': {
        params: {
            algorithm: 'greedy-best-first',
        },
        description:
            'Greedy Best-First Search is a search algorithm that expands the node that ' +
            'appears to be closest to the goal, based on a heuristic function. ' +
            'It does not guarantee the shortest path.',
    },
    'bidirectional-search': {
        params: {
            algorithm: 'bidirectional-search',
        },
        description:
            'Bidirectional Search runs two simultaneous searches—one forward from ' +
            'the source and one backward from the target—hoping that the two searches ' +
            'meet in the middle, which can significantly reduce search time.',
    },
    'iterative-deepening-dfs': {
        params: {
            algorithm: 'iterative-deepening-dfs',
        },
        description:
            'Iterative Deepening Depth-First Search (IDDFS) combines the space efficiency ' +
            'of DFS with the optimality of BFS by performing DFS with increasing depth limits ' +
            'until the target is found.',
    },
    'random-walk': {
        params: {
            algorithm: 'random-walk',
        },
        description:
            'Random Walk is a traversal method where the next node is chosen randomly ' +
            'from the neighbors of the current node. It is often used in scenarios like ' +
            'network sampling or when exploring unknown graphs.',
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

export const TraversalTab = forwardRef<TraversalTabRef, TraversalTabProps>(({ isOpen }, ref) => {
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
            if (prev.algorithm !== 'bfs' && prev.algorithm !== 'dfs') return prev;
            const nodes = activeGraph.nodes();
            const nodeIds = nodes.map((n) => n.id());
            const validStartId = nodeIds.includes(prev.startNodeId)
                ? prev.startNodeId
                : (nodes[0]?.id() ?? '');
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

        if ((params.algorithm === 'bfs' || params.algorithm === 'dfs') && !params.startNodeId) {
            addToast({ type: 'error', message: 'Please select a start node before running.' });
            return;
        }

        try {
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
                    throw new Error(
                        `Algorithm not implemented: ${params.algorithm}`
                    );
            }
        } catch (error) {
            const parsedError = parseError(error);
            addToast({
                type: 'error',
                message: parsedError.message,
            });
            return;
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
        } else if (newAlgorithm === 'dfs') {
            setParams((prev) => ({
                ...prev,
                ...ALGORITHM_MAP.dfs.params,
                directed: Boolean(activeGraph?.data('directed')),
                startNodeId: activeGraph?.nodes()[0]?.id() ?? '',
                graphNodes: activeGraph ? activeGraph.nodes() : null,
            }));
        } else {
            setParams(ALGORITHM_MAP[newAlgorithm].params);
        }
    };

    const graphAlgorithmSelectOptions = useMemo(() => {
        return ValidTraversalAlgorithms.map((algorithm) => ({
            label:
                algorithm === 'bfs' || algorithm === 'dfs'
                    ? parseKebabCase(algorithm)
                    : `${parseKebabCase(algorithm)} (W.I.P.)`,
            value: algorithm,
            disabled: algorithm !== 'bfs' && algorithm !== 'dfs',
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
});
