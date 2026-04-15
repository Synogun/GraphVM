import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import {
    DefaultBipartiteGenerationParams,
    DefaultCircleGenerationParams,
    DefaultCompleteBipartiteGenerationParams,
    DefaultCompleteGenerationParams,
    DefaultGenerationParams,
    DefaultGridGenerationParams,
    DefaultHlpGenerationParams,
    DefaultSimpleGenerationParams,
    DefaultStarGenerationParams,
    DefaultWheelGenerationParams,
} from '@/constants/algorithmDefaults';
import { useGetGraph, useGraphMutation } from '@/hooks';
import {
    calcMaxEdgesForSimpleGraph,
    generateBipartiteGraph,
    generateCircleGraph,
    generateCompleteBipartiteGraph,
    generateCompleteGraph,
    generateGridGraph,
    generateHlpGraph,
    generateSimpleGraph,
    generateStarGraph,
    generateWheelGraph,
} from '@/services/algorithms';
import {
    type GenerationFamily,
    type GenerationParams,
    isGenerationFamily,
    ValidGenerationFamilies,
} from '@/types/algorithms';
import { parseKebabCase } from '@/utils/elements';
import { useLayoutProperties, useSettings, useToasts } from '@Contexts';
import { SelectInput } from '@Inputs';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import {
    BipartiteParamsInput,
    CircleParamsInput,
    CompleteParamsInput,
    GridParamsInput,
    HlpParamsInput,
    SimpleParamsInput,
    StarParamsInput,
    WheelParamsInput,
} from './GenerationAlgorithmsParams';

const FAMILY_MAP: Record<
    GenerationFamily,
    {
        params: GenerationParams;
        description: string;
    }
> = {
    complete: {
        params: {
            family: 'complete',
            nodeCount: DefaultCompleteGenerationParams.nodeCount,
        },
        description: 'Every node is connected to every other distinct node.',
    },
    grid: {
        params: {
            family: 'grid',
            rows: DefaultGridGenerationParams.rows,
            cols: DefaultGridGenerationParams.cols,
            applyGridLayout: true,
        },
        description: 'Nodes are arranged in a simple grid lattice structure.',
    },
    circle: {
        params: {
            family: 'circle',
            nodeCount: DefaultCircleGenerationParams.nodeCount,
            applyCircleLayout: true,
        },
        description: 'Nodes are connected in a simple closed loop.',
    },
    star: {
        params: {
            family: 'star',
            nodeCount: DefaultStarGenerationParams.nodeCount,
            applyConcentricLayout: true,
        },
        description: 'One central node connected to N outer leaves.',
    },
    wheel: {
        params: {
            family: 'wheel',
            nodeCount: DefaultWheelGenerationParams.nodeCount,
            applyConcentricLayout: true,
        },
        description:
            'A cycle graph with an additional central hub connected to all other nodes.',
    },
    hlp: {
        params: {
            family: 'hlp',
            L: DefaultHlpGenerationParams.L,
            P: DefaultHlpGenerationParams.P,
            applyGridLayout: true,
        },
        description:
            'A special subfamily of Cayley graphs, ' +
            'where nodes represent vectors of length L, ' +
            'and edges are defined based on a specific generating set. ',
    },
    bipartite: {
        params: {
            family: 'bipartite',
            setASize: DefaultBipartiteGenerationParams.setASize,
            setBSize: DefaultBipartiteGenerationParams.setBSize,
        },
        description:
            'Two disjoint sets of vertices where edges only connect vertices from different sets. ' +
            'The edges between the two sets will be randomly generated.',
    },
    'complete-bipartite': {
        params: {
            family: 'complete-bipartite',
            setASize: DefaultCompleteBipartiteGenerationParams.setASize,
            setBSize: DefaultCompleteBipartiteGenerationParams.setBSize,
        },
        description:
            'Two disjoint sets where every vertex in one set is connected to every vertex in the other.',
    },
    simple: {
        params: {
            family: 'simple',
            nodeCount: DefaultSimpleGenerationParams.nodeCount,
            edgeCount: DefaultSimpleGenerationParams.edgeCount,
            applyFcoseLayout: true,
        },
        description:
            'A graph with a specified number of nodes and edges, where edges are randomly generated between distinct pairs of nodes. ' +
            'The generated graph will be simple, meaning it will not contain self-loops or multiple edges between the same pair of nodes.',
    },
};

export type GenerationTabRef = {
    handleRun: () => void;
};

export const GenerationTab = forwardRef<GenerationTabRef>((_, ref) => {
    const [params, setParams] = useState({
        ...DefaultGenerationParams,
    });

    const graph = useGetGraph('main-graph');
    const {
        current: currentLayout,
        setCurrent: setLayout,
        grid,
        setType,
    } = useLayoutProperties();
    const { syncAll } = useGraphMutation('main-graph');
    const {
        graph: { limits },
    } = useSettings();

    const { addToast } = useToasts();

    const maxSimpleEdges =
        params.family === 'simple'
            ? calcMaxEdgesForSimpleGraph(params.nodeCount)
            : 0;

    const handleRun = () => {
        const activeGraph = graph.current;

        if (!activeGraph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        let layout = currentLayout;
        try {
            switch (params.family) {
                case 'complete':
                    generateCompleteGraph(activeGraph, params, layout, limits);
                    break;
                case 'grid':
                    if (params.applyGridLayout) {
                        layout = {
                            ...layout,
                            name: 'grid',
                            rows: params.rows,
                            cols: params.cols,
                        };
                        setType('grid');
                        setLayout({ ...layout });
                        grid.setCols(params.cols);
                        grid.setRows(params.rows);
                    }
                    generateGridGraph(activeGraph, params, layout, limits);
                    break;
                case 'circle':
                    if (params.applyCircleLayout) {
                        layout = { ...layout, name: 'circle' };
                        setType('circle');
                        setLayout({ ...layout });
                    }
                    generateCircleGraph(activeGraph, params, layout, limits);
                    break;
                case 'star':
                    if (params.applyConcentricLayout) {
                        layout = { ...layout, name: 'concentric' };
                        setType('concentric');
                        setLayout({
                            ...layout,
                            name: 'concentric',
                        });
                    }
                    generateStarGraph(activeGraph, params, layout, limits);
                    break;
                case 'wheel':
                    if (params.applyConcentricLayout) {
                        layout = { ...layout, name: 'concentric' };
                        setType('concentric');
                        setLayout({ ...layout });
                    }
                    generateWheelGraph(activeGraph, params, layout, limits);
                    break;
                case 'hlp':
                    if (params.applyGridLayout) {
                        layout = {
                            ...layout,
                            name: 'grid',
                            cols: params.P,
                        };
                        setType('grid');
                        setLayout({ ...layout });
                        grid.setCols(params.P);
                    }

                    generateHlpGraph(activeGraph, params, layout);
                    break;
                case 'bipartite':
                    generateBipartiteGraph(activeGraph, params, layout, limits);
                    break;
                case 'complete-bipartite':
                    generateCompleteBipartiteGraph(
                        activeGraph,
                        params,
                        layout,
                        limits
                    );
                    break;
                case 'simple':
                    if (params.edgeCount > maxSimpleEdges) {
                        addToast({
                            type: 'warning',
                            message:
                                `Edge count exceeds maximum for ${params.nodeCount.toString()} nodes. ` +
                                `Using ${maxSimpleEdges.toString()} edges instead.`,
                        });
                    }

                    if (params.applyFcoseLayout) {
                        layout = { ...layout, name: 'circle' };
                        setType('circle');
                        setLayout({ ...layout });
                    }
                    generateSimpleGraph(activeGraph, params, layout, limits);
                    break;

                default:
                    addToast({
                        type: 'error',
                        message: `Invalid graph family selected: ${String(params)}`,
                    });
                    return;
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

        setParams({ ...DefaultGenerationParams });
        addToast({
            type: 'success',
            message: 'The graph was generated successfully.',
        });
    };

    useImperativeHandle(ref, () => ({ handleRun }));

    const updateFamily = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFamily = event.target.value;

        if (!isGenerationFamily(newFamily)) {
            addToast({
                type: 'error',
                message: `Invalid family selected: ${newFamily}`,
            });
            return;
        }

        setParams(FAMILY_MAP[newFamily].params);
    };

    const paramsSection = () => {
        switch (params.family) {
            case 'complete':
                return <CompleteParamsInput params={params} setParams={setParams} />;
            case 'grid':
                return <GridParamsInput params={params} setParams={setParams} />;
            case 'circle':
                return <CircleParamsInput params={params} setParams={setParams} />;
            case 'star':
                return <StarParamsInput params={params} setParams={setParams} />;
            case 'wheel':
                return <WheelParamsInput params={params} setParams={setParams} />;
            case 'hlp':
                return <HlpParamsInput params={params} setParams={setParams} />;
            case 'bipartite':
            case 'complete-bipartite':
                return (
                    <BipartiteParamsInput params={params} setParams={setParams} />
                );
            case 'simple':
                return <SimpleParamsInput params={params} setParams={setParams} />;
            default:
                return (
                    <div className="text-sm italic text-gray-500">
                        Parameter inputs for this family are not implemented yet.
                    </div>
                );
        }
    };

    const graphFamilySelectOptions = useMemo(() => {
        return ValidGenerationFamilies.map((family) => ({
            label: parseKebabCase(family),
            value: family,
        }));
    }, []);

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <SelectInput
                        label="Graph Family"
                        options={graphFamilySelectOptions}
                        value={params.family}
                        onChange={updateFamily}
                    />
                    <p className="ml-1 mt-1 text-xs text-base-content/70">
                        Select the family of graph to generate.
                    </p>
                </div>
                <div className="flex flex-col">
                    <span className="mb-1 ml-1 text-xs opacity-50">
                        <strong>DESCRIPTION</strong>
                    </span>
                    <div className="flex flex-1 items-center rounded-lg bg-base-200 p-3 text-sm text-base-content/80">
                        {FAMILY_MAP[params.family].description}
                    </div>
                </div>
            </div>

            <div className="divider text-sm opacity-50 mb-0" />

            <div className="flex flex-col gap-1">
                <span className="font-bold text-lg">Parameters</span>
                <p className="text-xs text-base-content/70">
                    Select the propeties of the graph to generate. The available
                    options will depend on the chosen family.
                </p>
            </div>

            {paramsSection()}
        </div>
    );
});
