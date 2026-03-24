import {
    DefaultBipartiteGenerationParams,
    DefaultCircleGenerationParams,
    DefaultCompleteGenerationParams,
    DefaultGridGenerationParams,
    DefaultHlpGenerationParams,
    DefaultSimpleGenerationParams,
    DefaultStarGenerationParams,
    DefaultWheelGenerationParams,
    MaximumHlpGenerationParams,
    MaximumHlpGenerationParamsForL3,
    MinimumBipartiteGenerationParams,
    MinimumCircleGenerationParams,
    MinimumCompleteGenerationParams,
    MinimumGridGenerationParams,
    MinimumHlpGenerationParams,
    MinimumSimpleGenerationParams,
    MinimumStarGenerationParams,
    MinimumWheelGenerationParams,
} from '@/constants/algorithmDefaults';
import { type GenerationParams } from '@/types/algorithms';
import { NumberInput, ToggleInput } from '@Inputs';
import { type ChangeEvent } from 'react';

type ParamsInputProps = Readonly<{
    params: GenerationParams;
    setParams: (params: GenerationParams) => void;
}>;

const applyLayoutStateLabels = { on: 'Apply Layout', off: 'Keep Current' };

// Helper: Extract integer from input event
const getInt = (e: ChangeEvent<HTMLInputElement>) =>
    Number.parseInt(e.target.value) || 1;

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
                    content: 'Determines the total number of nodes in the graph.',
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
                tooltip={{
                    content:
                        'Sets the number of rows (horizontal) in the grid structure.',
                }}
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
                    content:
                        'Sets the number of columns (vertical) in the grid structure.',
                }}
                onChange={(e) => {
                    setParams({ ...params, cols: getInt(e) });
                }}
            />
            <ToggleInput
                label="Apply Grid Layout"
                checked={params.applyGridLayout}
                defaultValue={DefaultGridGenerationParams.applyGridLayout}
                stateLabels={applyLayoutStateLabels}
                tooltip={{
                    content:
                        'If enabled, automatically arranges the nodes in a structured ' +
                        'grid pattern matching the specified rows and columns.',
                }}
                onChange={(e) => {
                    setParams({ ...params, applyGridLayout: e.target.checked });
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
                    content:
                        'Sets the total number of nodes to generate in the circle graph.',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
            <ToggleInput
                label="Apply Circle Layout"
                checked={params.applyCircleLayout}
                stateLabels={applyLayoutStateLabels}
                tooltip={{
                    content:
                        'If enabled, automatically arranges all nodes in a perfect circle for better visualization.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        applyCircleLayout: e.target.checked,
                    });
                }}
                defaultValue={DefaultCircleGenerationParams.applyCircleLayout}
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
                        'Sets the number of outer nodes surrounding the center. ' +
                        'The total node count will be this value plus one (the center node).',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
            <ToggleInput
                label="Apply Concentric Layout"
                checked={params.applyConcentricLayout}
                stateLabels={applyLayoutStateLabels}
                tooltip={{
                    content:
                        'If enabled, places the center node in the middle and ' +
                        'arranges all other nodes in a circle around it.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        applyConcentricLayout: e.target.checked,
                    });
                }}
                defaultValue={DefaultStarGenerationParams.applyConcentricLayout}
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
                        'Sets the number of outer rim nodes. ' +
                        'The total node count will be this value plus one (the hub node).',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
            <ToggleInput
                label="Apply Concentric Layout"
                checked={params.applyConcentricLayout}
                stateLabels={applyLayoutStateLabels}
                tooltip={{
                    content:
                        'If enabled, places the hub node in the center and ' +
                        'arranges the rim nodes in a circle around it.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        applyConcentricLayout: e.target.checked,
                    });
                }}
                defaultValue={DefaultWheelGenerationParams.applyConcentricLayout}
            />
        </div>
    );
}

export function HlpParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'hlp') {
        return null;
    }

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="L (Coordinate Dimension)"
                value={params.L}
                min={MinimumHlpGenerationParams.L}
                max={MaximumHlpGenerationParams.L}
                step={1}
                defaultValue={DefaultHlpGenerationParams.L}
                tooltip={{
                    content:
                        `Sets the number of dimensions in the node coordinates for the HLP graph. ` +
                        `Must be at least ${MinimumHlpGenerationParams.L.toString()} and ` +
                        `at most ${MaximumHlpGenerationParams.L.toString()} for valid generation.`,
                }}
                onChange={(e) => {
                    const newP =
                        getInt(e) === 3
                            ? Math.min(params.P, MaximumHlpGenerationParamsForL3.P)
                            : Math.min(params.P, MaximumHlpGenerationParams.P);
                    setParams({ ...params, L: getInt(e), P: newP });
                }}
            />
            <NumberInput
                label="P (Coordinate Modulo)"
                value={params.P}
                min={MinimumHlpGenerationParams.P}
                max={
                    params.L === 3
                        ? MaximumHlpGenerationParamsForL3.P
                        : MaximumHlpGenerationParams.P
                }
                step={1}
                defaultValue={DefaultHlpGenerationParams.P}
                tooltip={{
                    content:
                        'Sets the coordinate modulo for the HLP graph generation. ' +
                        `Must be at least ${MinimumHlpGenerationParams.P.toString()} ` +
                        `and at most ${MaximumHlpGenerationParamsForL3.P.toString()} (if L=3) ` +
                        `or ${MaximumHlpGenerationParams.P.toString()} (if L>3) for valid generation.`,
                }}
                onChange={(e) => {
                    setParams({ ...params, P: getInt(e) });
                }}
            />
            <ToggleInput
                label="Apply Grid Layout"
                checked={params.applyGridLayout}
                stateLabels={applyLayoutStateLabels}
                tooltip={{
                    content:
                        'If enabled, automatically arranges the nodes in a grid pattern ' +
                        'based on their coordinates in the HLP structure.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        applyGridLayout: e.target.checked,
                    });
                }}
                defaultValue={DefaultHlpGenerationParams.applyGridLayout}
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
                        'Sets the number of nodes in the first independent set (Set A). ' +
                        'Nodes in this set only connect to nodes in Set B.',
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
                        'Sets the number of nodes in the second independent set (Set B). ' +
                        'Nodes in this set only connect to nodes in Set A.',
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

export function SimpleParamsInput({ params, setParams }: ParamsInputProps) {
    if (params.family !== 'simple') {
        return null;
    }

    const maxEdgeCount = Math.floor((params.nodeCount * (params.nodeCount - 1)) / 2);

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <NumberInput
                label="Node Count"
                value={params.nodeCount}
                min={MinimumSimpleGenerationParams.nodeCount}
                max={100}
                step={1}
                defaultValue={DefaultSimpleGenerationParams.nodeCount}
                tooltip={{
                    content: 'Sets the number of nodes in the simple graph.',
                }}
                onChange={(e) => {
                    setParams({ ...params, nodeCount: getInt(e) });
                }}
            />
            <NumberInput
                label="Edge Count"
                value={params.edgeCount}
                min={MinimumSimpleGenerationParams.edgeCount}
                max={maxEdgeCount}
                step={1}
                defaultValue={DefaultSimpleGenerationParams.edgeCount}
                tooltip={{
                    content:
                        'Sets the number of edges in the simple graph. ' +
                        'The algorithm will randomly connect pairs of ' +
                        'nodes until this number of edges is reached, ' +
                        'ensuring no self-loops or multiple edges between ' +
                        'the same pair of nodes. Maximum possible edges is n*(n-1)/2.',
                }}
                onChange={(e) => {
                    setParams({ ...params, edgeCount: getInt(e) });
                }}
            />
            <ToggleInput
                label="Apply Fcose Layout"
                checked={params.applyFcoseLayout}
                stateLabels={applyLayoutStateLabels}
                tooltip={{
                    content:
                        'If enabled, tries to arrange the nodes using the Fcose layout algorithm to visualize the simple structure.',
                }}
                onChange={(e) => {
                    setParams({
                        ...params,
                        applyFcoseLayout: e.target.checked,
                    });
                }}
                defaultValue={DefaultSimpleGenerationParams.applyFcoseLayout}
            />
        </div>
    );
}
