import { ParsedErrorToasts } from '@/constants';
import {
    DefaultGridLayoutOptions,
    DefaultLayoutOptions,
} from '@/constants/layoutDefaults';
import { useGetGraph } from '@/hooks';
import { arrangeGraph, updateLayoutOptions } from '@/services/graph';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { useLayoutStore } from '@/stores/layoutStore';
import type { LayoutType } from '@/types';
import {
    isLayoutOptions,
    isLayoutType,
    ValidGraphLayouts,
} from '@/types/ui/layout/typeGuards';
import { parseKebabCase } from '@/utils/elements';
import { useSettings, useToasts } from '@Contexts';
import { RangeInput, SelectInput } from '@Inputs';
import { type ChangeEvent, useEffect, useMemo, useRef } from 'react';

export function LayoutSection({ visible = true }: Readonly<LayoutSectionProps>) {
    const graphRef = useGetGraph('main-graph');
    const layoutType = useLayoutStore((s) => s.type);
    const setLayoutType = useLayoutStore((s) => s.setType);
    const gridLayoutCols = useLayoutStore((s) => s.cols);
    const setGridLayoutCols = useLayoutStore((s) => s.setCols);
    const currentLayout = useLayoutStore((s) => s.current);
    const setCurrentLayout = useLayoutStore((s) => s.setCurrent);
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const { addToast } = useToasts();

    const {
        graph: { arrangeOn },
    } = useSettings();

    const arrangeOnRef = useRef(arrangeOn);

    useEffect(() => {
        arrangeOnRef.current = arrangeOn;
    }, [arrangeOn]);

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        const rawOptions: unknown = graphRef.current.data('layoutOptions');
        const options = isLayoutOptions(rawOptions)
            ? rawOptions
            : { ...DefaultLayoutOptions };

        if (options.name === 'grid') {
            const gridOptions = { ...DefaultGridLayoutOptions, ...options };
            setGridLayoutCols(gridOptions.cols || DefaultGridLayoutOptions.cols);
        }

        setLayoutType(
            isLayoutType(options.name)
                ? options.name
                : (DefaultLayoutOptions.name as LayoutType)
        );
        setCurrentLayout(options);
    }, [graphRef, activeTabId, setCurrentLayout, setLayoutType, setGridLayoutCols]);

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        if (arrangeOnRef.current.tabChange) {
            arrangeGraph(graphRef.current, currentLayout);
        }
    }, [currentLayout, graphRef]);

    const handleChangeLayoutType = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        const { value } = e.target;
        const type = isLayoutType(value)
            ? value
            : (DefaultLayoutOptions.name as LayoutType);

        setLayoutType(type);
        setCurrentLayout((prev) => ({ ...prev, name: type }));
        updateLayoutOptions(
            graphRef.current,
            { name: type },
            arrangeOnRef.current.layoutChange
        );
    };

    const handleChangeGridCols = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graphRef.current) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        setNumberProperty(e, setGridLayoutCols, gridLayoutCols, 1, 10);
        setCurrentLayout((prev) => ({ ...prev, cols: Number(e.target.value) }));
        updateLayoutOptions(
            graphRef.current,
            { name: 'grid', cols: Number(e.target.value) },
            arrangeOnRef.current.layoutChange
        );
    };

    const handleRandomLayout = () => {
        if (!graphRef.current) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        setCurrentLayout((prev) => ({ ...prev, name: 'random' }));
        updateLayoutOptions(
            graphRef.current,
            { name: 'random' },
            arrangeOnRef.current.layoutChange
        );
    };

    const selectTypeOptions = useMemo(() => {
        const sorted = [
            ...ValidGraphLayouts.map((option) => ({
                value: option,
                label: parseKebabCase(option),
            })),
        ].sort((a, b) => a.label.localeCompare(b.label));

        return [{ label: 'Pick a layout type', value: '', title: true }, ...sorted];
    }, []);

    return (
        <div className={visible ? '' : 'hidden'}>
            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Layout</h1>
            </div>

            <SelectInput
                label="Layout Type"
                onChange={handleChangeLayoutType}
                options={selectTypeOptions}
                value={layoutType}
                defaultValue={DefaultLayoutOptions.name}
                tooltip={{
                    content: 'Select the layout algorithm for arranging nodes.',
                }}
            />

            {layoutType === 'grid' && (
                <RangeInput
                    label="Columns"
                    max={10}
                    min={1}
                    onChange={handleChangeGridCols}
                    step={1}
                    value={gridLayoutCols}
                    defaultValue={DefaultGridLayoutOptions.cols}
                    tooltip={{
                        content:
                            'Determine the number of columns in the grid layout.',
                    }}
                />
            )}

            {layoutType === 'random' && (
                <button
                    className="btn btn-outline hover:btn-accent focus:btn-accent w-full mt-2 mb-1"
                    onClick={handleRandomLayout}
                >
                    Randomize node positions
                </button>
            )}
        </div>
    );
}

const setNumberProperty = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void,
    current: number,
    min: number,
    max: number
) => {
    let value = Number(e.target.value);

    if (Number.isNaN(value)) {
        return;
    }

    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }

    if (value !== current) {
        setter(value);
    }
};

type LayoutSectionProps = {
    visible?: boolean;
};
