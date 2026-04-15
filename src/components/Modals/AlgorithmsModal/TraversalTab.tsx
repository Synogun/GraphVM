import { SelectInput } from '@/components/common';
import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import { DefaultTraversalParams } from '@/constants/algorithmDefaults';
import { useGetGraph, useGraphMutation } from '@/hooks';
import { runBFSAlgorithm } from '@/services';
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
import { BFSParamsInput } from './TraversalAlgorithmsParams';

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

export type TraversalTabRef = {
    handleRun: () => void;
};

export const TraversalTab = forwardRef<TraversalTabRef>((_, ref) => {
    const [params, setParams] = useState({
        ...DefaultTraversalParams,
    });

    const graph = useGetGraph('main-graph');
    const { syncAll } = useGraphMutation('main-graph');

    const { addToast } = useToasts();

    useEffect(() => {
        const activeGraph = graph.current;

        if (params.algorithm === 'bfs') {
            setParams((prevParams) => ({
                ...prevParams,
                ...ALGORITHM_MAP.bfs.params,
                directed: Boolean(activeGraph?.data('directed')),
                startNodeId: activeGraph?.nodes()[0]?.id() ?? '',
                graphNodes: activeGraph ? activeGraph.nodes() : null,
            }));
        }
    }, [graph, params.algorithm]);

    const handleRun = () => {
        const activeGraph = graph.current;

        if (!activeGraph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        try {
            switch (params.algorithm) {
                case 'bfs':
                    runBFSAlgorithm({
                        graph: activeGraph,
                        startNodeId: params.startNodeId,
                        directed: Boolean(activeGraph.data('directed')),
                        onlySelected: params.onlySelected,
                    });
                    break;

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

        syncAll(activeGraph);
        setParams({ ...DefaultTraversalParams });
    };

    useImperativeHandle(ref, () => ({ handleRun }));

    const paramsSection = () => {
        switch (params.algorithm) {
            case 'bfs':
                return (
                    <BFSParamsInput
                        params={{
                            ...params,
                            graphNodes: graph.current ? graph.current.nodes() : null,
                            startNodeId: graph.current?.nodes()[0]?.id() ?? '',
                            directed: Boolean(graph.current?.data('directed')),
                        }}
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
    };

    const updateAlgorithm = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newAlgorithm = event.target.value;

        if (!isTraversalAlgorithm(newAlgorithm)) {
            addToast({
                type: 'error',
                message: `Invalid algorithm selected: ${newAlgorithm}`,
            });
            return;
        }

        setParams(ALGORITHM_MAP[newAlgorithm].params);
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

            {paramsSection()}
        </div>
    );
});
