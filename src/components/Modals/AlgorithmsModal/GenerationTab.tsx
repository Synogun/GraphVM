import { ParsedErrorToast, parseError } from '@/config/parsedError';
import {
    DefaultBipartiteGenerationParams,
    DefaultCircleGenerationParams,
    DefaultCompleteBipartiteGenerationParams,
    DefaultCompleteGenerationParams,
    DefaultGenerationParams,
    DefaultGridGenerationParams,
    DefaultSimpleGenerationParams,
    DefaultStarGenerationParams,
    DefaultWheelGenerationParams,
} from '@/constants/algorithmDefaults';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import {
    generateBipartiteGraph,
    generateCircleGraph,
    generateCompleteBipartiteGraph,
    generateCompleteGraph,
    generateGridGraph,
    generateSimpleGraph,
    generateStarGraph,
    generateWheelGraph,
} from '@/services/algorithms/generationAlgorithmsService';
import {
    isGenerationFamily,
    ValidGenerationFamilies,
} from '@/types/algorithmTypeGuards';
import type { GenerationFamily, GenerationParams } from '@/types/algorithms';
import { useLayoutProperties, useToasts } from '@Contexts';
import { SelectInput } from '@Inputs';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import {
    BipartiteParamsInput,
    CircleParamsInput,
    CompleteParamsInput,
    GridParamsInput,
    SimpleParamsInput,
    StarParamsInput,
    WheelParamsInput,
} from './AlgorithmsParamsSection';

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
    const [params, setParams] = useState<GenerationParams>({
        ...DefaultGenerationParams,
    });

    const graph = useGetGraph('main-graph');
    const {
        current: currentLayout,
        setCurrent: setLayout,
        grid,
        setType,
    } = useLayoutProperties();

    const { addToast } = useToasts();

    const handleRun = () => {
        if (!graph.current) {
            addToast(ParsedErrorToast.GraphNotFound);
            return;
        }

        let layout = currentLayout;
        try {
            switch (params.family) {
                case 'complete':
                    generateCompleteGraph(graph.current, params, layout);
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
                    generateGridGraph(graph.current, params, layout);
                    break;
                case 'circle':
                    if (params.applyCircleLayout) {
                        layout = { ...layout, name: 'circle' };
                        setType('circle');
                        setLayout({ ...layout });
                    }
                    generateCircleGraph(graph.current, params, layout);
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
                    generateStarGraph(graph.current, params, layout);
                    break;
                case 'wheel':
                    if (params.applyConcentricLayout) {
                        layout = { ...layout, name: 'concentric' };
                        setType('concentric');
                        setLayout({ ...layout });
                    }
                    generateWheelGraph(graph.current, params, layout);
                    break;
                // case 'cayley':
                //     generateCayleyGraph(graph.current, params, layout);
                //     break;
                case 'bipartite':
                    generateBipartiteGraph(graph.current, params, layout);
                    break;
                case 'complete-bipartite':
                    generateCompleteBipartiteGraph(graph.current, params, layout);
                    break;
                case 'simple':
                    if (params.applyFcoseLayout) {
                        layout = { ...layout, name: 'circle' };
                        setType('circle');
                        setLayout({ ...layout });
                    }
                    generateSimpleGraph(graph.current, params, layout);
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
            case 'bipartite':
                return (
                    <BipartiteParamsInput params={params} setParams={setParams} />
                );
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
            label: family.charAt(0).toUpperCase() + family.slice(1),
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
