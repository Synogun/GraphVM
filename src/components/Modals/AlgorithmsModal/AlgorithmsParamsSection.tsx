import { NumberInput } from '@/components/common/inputs';
import {
    DefaultBipartiteGenerationParams,
    DefaultCageGenerationParams,
    DefaultCircleGenerationParams,
    DefaultCompleteGenerationParams,
    DefaultGridGenerationParams,
    DefaultStarGenerationParams,
    DefaultWheelGenerationParams,
    MinimumBipartiteGenerationParams,
    MinimumCageGenerationParams,
    MinimumCircleGenerationParams,
    MinimumCompleteGenerationParams,
    MinimumGridGenerationParams,
    MinimumStarGenerationParams,
    MinimumWheelGenerationParams,
} from '@/config/algorithmDefaults';
import type { GenerationParams } from '@/types/algorithms';
import type { ChangeEvent } from 'react';

type ParamsInputProps = {
    params: GenerationParams;
    setParams: (params: GenerationParams) => void;
};

// Helper: Extract integer from input event
const getInt = (e: ChangeEvent<HTMLInputElement>) => parseInt(e.target.value) || 1;

export function CompleteParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'complete') {
        return null;
    }

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Node Count"
                value={params.nodeCount}
                min={MinimumCompleteGenerationParams.nodeCount}
                max={100}
                step={1}
                defaultValue={DefaultCompleteGenerationParams.nodeCount}
                tooltip={{
                    content: 'Determines the number of nodes in the complete graph.',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
        </div>
    );
}

export function GridParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'grid') {
        return null;
    }

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Rows"
                value={params.rows}
                min={MinimumGridGenerationParams.rows}
                max={50}
                step={1}
                defaultValue={DefaultGridGenerationParams.rows}
                tooltip={{ content: 'Determines the number of rows in the grid.' }}
                onChange={(e) => {
                    setParams({ ...params, rows: getInt(e) });
                }}
            />
            <NumberInput
                label="Columns"
                value={params.cols}
                min={MinimumGridGenerationParams.cols}
                max={50}
                step={1}
                defaultValue={DefaultGridGenerationParams.cols}
                tooltip={{
                    content: 'Determines the number of columns in the grid.',
                }}
                onChange={(e) => {
                    setParams({ ...params, cols: getInt(e) });
                }}
            />
        </div>
    );
}

export function CircleParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'circle') {
        return null;
    }

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Node Count"
                value={params.nodeCount}
                min={MinimumCircleGenerationParams.nodeCount}
                max={100}
                step={1}
                defaultValue={DefaultCircleGenerationParams.nodeCount}
                tooltip={{
                    content: 'Determines the number of nodes in the circle graph.',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
        </div>
    );
}

export function StarParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'star') {
        return null;
    }

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Node Count"
                value={params.nodeCount}
                min={MinimumStarGenerationParams.nodeCount}
                max={100}
                step={1}
                defaultValue={DefaultStarGenerationParams.nodeCount}
                tooltip={{
                    content:
                        'Determines the number of nodes in the star graph. This does not include the center node.',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
        </div>
    );
}

export function WheelParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'wheel') {
        return null;
    }
    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Node Count"
                value={params.nodeCount}
                min={MinimumWheelGenerationParams.nodeCount}
                max={100}
                step={1}
                defaultValue={DefaultWheelGenerationParams.nodeCount}
                tooltip={{
                    content:
                        'Determines the number of nodes in the wheel graph. This does not include the center node.',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
        </div>
    );
}

export function BipartiteParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'bipartite' && params.family !== 'complete-bipartite') {
        return null;
    }

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Set A Size"
                value={params.setASize}
                min={MinimumBipartiteGenerationParams.setASize}
                max={100}
                step={1}
                defaultValue={DefaultBipartiteGenerationParams.setASize}
                tooltip={{
                    content:
                        'Determines the number of nodes in set A of the bipartite graph.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        setASize: getInt(e),
                    });
                }}
            />
            <NumberInput
                label="Set B Size"
                value={params.setBSize}
                min={MinimumBipartiteGenerationParams.setBSize}
                max={100}
                step={1}
                defaultValue={DefaultBipartiteGenerationParams.setBSize}
                tooltip={{
                    content:
                        'Determines the number of nodes in set B of the bipartite graph.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        setBSize: getInt(e),
                    });
                }}
            />
        </div>
    );
}

export function CageParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'cage') {
        return null;
    }

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Degree"
                value={params.degree}
                min={MinimumCageGenerationParams.degree}
                max={10}
                step={1}
                defaultValue={DefaultCageGenerationParams.degree}
                tooltip={{
                    content:
                        'Determines the degree of each vertex in the cage graph.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        degree: getInt(e),
                    });
                }}
            />
            <NumberInput
                label="Girth"
                value={params.girth}
                min={MinimumCageGenerationParams.girth}
                max={20}
                step={1}
                defaultValue={DefaultCageGenerationParams.girth}
                tooltip={{
                    content:
                        'Determines the length of the shortest cycle in the cage graph.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        girth: getInt(e),
                    });
                }}
            />
        </div>
    );
}
