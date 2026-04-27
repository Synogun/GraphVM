import { ParsedErrorToasts } from '@/constants';
import {
    DefaultGridLayoutOptions,
    DefaultLayoutOptions,
} from '@/constants/layoutDefaults';
import { useGetGraph } from '@/hooks';
import { arrangeGraph } from '@/services/graph';
import { isLayoutType, ValidGraphLayouts } from '@/types/ui/layout/typeGuards';
import { parseKebabCase } from '@/utils/elements';
import { useLayoutProperties, useToasts } from '@Contexts';
import { RangeInput, SelectInput } from '@Inputs';
import { type ChangeEvent, useEffect, useMemo } from 'react';

export function LayoutSection({ visible = true }: Readonly<LayoutSectionProps>) {
    const graphRef = useGetGraph('main-graph');
    const {
        type: layoutType,
        setType: setLayoutType,
        grid: gridLayout,
        setCurrent: setCurrentLayout,
    } = useLayoutProperties();

    const { addToast } = useToasts();

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        let options: cytoscape.LayoutOptions = {
            name: layoutType,

            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-out',
        };

        if (layoutType === 'grid') {
            options = {
                ...options,
                name: 'grid',
                cols: gridLayout.cols,
            };
        }

        setCurrentLayout(options);
        arrangeGraph(graphRef.current, options);
    }, [graphRef, layoutType, gridLayout.cols, setCurrentLayout]);

    const handleChangeLayoutType = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const type = isLayoutType(value) ? value : 'circle';

        setLayoutType(type);
    };

    const handleChangeGridCols = (e: ChangeEvent<HTMLInputElement>) => {
        setNumberProperty(e, gridLayout.setCols, gridLayout.cols, 1, 10);
    };

    const handleRandomLayout = () => {
        if (!graphRef.current) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }
        arrangeGraph(graphRef.current, { name: 'random' });
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
                <>
                    <RangeInput
                        label="Columns"
                        max={10}
                        min={1}
                        onChange={handleChangeGridCols}
                        step={1}
                        value={gridLayout.cols}
                        defaultValue={DefaultGridLayoutOptions.cols}
                        tooltip={{
                            content:
                                'Determine the number of columns in the grid layout.',
                        }}
                    />
                </>
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
