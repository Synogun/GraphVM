import { DefaultGenerationParams } from '@/config/algorithmDefaults';
import {
    isGenerationFamily,
    ValidGenerationFamilies,
} from '@/types/algorithmTypeGuards';
import type { GenerationFamily, GenerationParams } from '@/types/algorithms';
import { SelectInput } from '@Inputs';
import { Logger } from '@Logger';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
    BipartiteParamsInput,
    CageParamsInput,
    CircleParamsInput,
    CompleteParamsInput,
    GridParamsInput,
    StarParamsInput,
    WheelParamsInput,
} from './AlgorithmsParamsSection';

const logger = Logger.createContextLogger('GenerationTab');

const FAMILY_DESCRIPTIONS: Record<GenerationFamily, string> = {
    complete: 'Every node is connected to every other distinct node.',
    grid: 'Nodes are arranged in a regular grid lattice structure.',
    circle: 'Nodes are connected in a simple closed loop.',
    star: 'One central node connected to N outer leaves.',
    wheel: 'A cycle graph with an additional central hub connected to all other nodes.',
    bipartite:
        'Two disjoint sets of vertices where edges only connect vertices from different sets.',
    'complete-bipartite':
        'Two disjoint sets where every vertex in one set is connected to every vertex in the other.',
    cage: 'A graph in which it has a specified degree and maximum circle length.',
};

export type GenerationTabRef = {
    handleRun: () => void;
};

export const GenerationTab = forwardRef<GenerationTabRef>((_, ref) => {
    const [params, setParams] = useState<GenerationParams>({
        ...DefaultGenerationParams,
    });

    useImperativeHandle(ref, () => ({
        handleRun: () => {
            setParams({ ...DefaultGenerationParams });
            logger.info('Running generation with params', params);
            // TODO: Call actual service here
        },
    }));

    const updateFamily = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFamily = event.target.value;

        if (!isGenerationFamily(newFamily)) {
            logger.warn(`Invalid family selected: ${newFamily}`);
            return;
        }

        switch (newFamily) {
            case 'complete':
                setParams({ family: 'complete', nodeCount: 5 });
                break;
            case 'grid':
                setParams({ family: 'grid', rows: 3, cols: 3 });
                break;
            case 'circle':
                setParams({ family: 'circle', nodeCount: 5 });
                break;
            case 'star':
                setParams({ family: 'star', nodeCount: 5 });
                break;
            case 'wheel':
                setParams({ family: 'wheel', nodeCount: 5 });
                break;
            // case 'cayley':
            //     setParams({
            //         family: 'cayley',
            //         group: 'symmetric group S3',
            //         generators: ['(1 2)', '(1 2 3)'],
            //     });
            //     break;
            case 'bipartite':
                setParams({ family: 'bipartite', setASize: 3, setBSize: 3 });
                break;
            case 'complete-bipartite':
                setParams({
                    family: 'complete-bipartite',
                    setASize: 3,
                    setBSize: 3,
                });
                break;
            case 'cage':
                setParams({ family: 'cage', degree: 3, girth: 5 });
                break;
            default:
                setParams({ ...DefaultGenerationParams });
                break;
        }
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
            case 'cage':
                return <CageParamsInput params={params} setParams={setParams} />;
            default:
                return (
                    <div className="text-sm italic text-gray-500">
                        Parameter inputs for this family are not implemented yet.
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <SelectInput
                        label="Graph Family"
                        options={ValidGenerationFamilies.map((family) => ({
                            label: family.charAt(0).toUpperCase() + family.slice(1),
                            value: family,
                        }))}
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
                        {FAMILY_DESCRIPTIONS[params.family]}
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
