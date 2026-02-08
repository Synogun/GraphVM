import { RangeInput, SelectInput } from '@/components/common/inputs';
import {
    DefaultGridLayoutOptions,
    DefaultLayoutOptions,
} from '@/config/layoutDefaults';
import { useLayoutProperties } from '@/contexts/LayoutContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { arrangeGraph } from '@/services/LayoutService';
import { isLayoutType, ValidGraphLayouts } from '@/types/layoutTypeGuards';
import { type ChangeEvent, useEffect, useMemo } from 'react';

export function LayoutSection({ visible = true }: LayoutSectionProps) {
    const graphRef = useGetGraph('main-graph');
    const {
        type: layoutType,
        setType: setLayoutType,
        circle: circleLayout,
        grid: gridLayout,
        setCurrent: setCurrentLayout,
    } = useLayoutProperties();

    useEffect(() => {
        if (!graphRef.current) return;

        let options: cytoscape.LayoutOptions = {
            name: layoutType,

            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-out',
        };

        // Delayed
        // if (layoutType === 'circle') {
        //     options = {
        //         ...options,
        //         name: 'circle',
        //         radius: circleLayout.radius,
        //     };
        // }

        if (layoutType === 'grid') {
            options = {
                ...options,
                name: 'grid',
                // rows: gridLayout.rows, // Delayed
                cols: gridLayout.cols,
            };
        }

        setCurrentLayout(options);
        arrangeGraph(graphRef.current, options);
    }, [
        graphRef,
        layoutType,
        circleLayout.radius,
        gridLayout.rows,
        gridLayout.cols,
        setCurrentLayout,
    ]);

    const handleChangeLayoutType = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const type = isLayoutType(value) ? value : 'circle';

        setLayoutType(type);
    };

    // Delayed
    // const handleChangeCircleRadius = (e: ChangeEvent<HTMLInputElement>) => {
    //     setNumberProperty(e, circleLayout.setRadius, circleLayout.radius, 1, 250);
    // };

    // In analysis for better use cases
    // const handleChangeGridRows = (e: ChangeEvent<HTMLInputElement>) => {
    //     setNumberProperty(e, gridLayout.setRows, gridLayout.rows, 1, 10);
    // };

    const handleChangeGridCols = (e: ChangeEvent<HTMLInputElement>) => {
        setNumberProperty(e, gridLayout.setCols, gridLayout.cols, 1, 10);
    };

    const handleRandomLayout = () => {
        if (!graphRef.current) return;
        arrangeGraph(graphRef.current, { name: 'random' });
    };

    const selectTypeOptions = useMemo(() => {
        return ValidGraphLayouts.map((option) => ({
            value: option,
            label: option.charAt(0).toUpperCase() + option.slice(1),
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    return (
        <>
            <div className={visible ? '' : 'hidden'}>
                <div className="divider mb-1">
                    <h1 className="text-lg font-bold text-center">Layout</h1>
                </div>

                <SelectInput
                    label="Layout Type"
                    onChange={handleChangeLayoutType}
                    options={selectTypeOptions}
                    selectTitle="Pick a layout type"
                    value={layoutType}
                    defaultValue={DefaultLayoutOptions.name}
                    tooltip={{
                        content: 'Select the layout algorithm for arranging nodes.',
                    }}
                />

                {/* {layoutType === 'circle' && (
                    // Better visualized when multi-layout is implemented
                    // TODO: implement multi-layout
                    <>
                        <RangeInput
                            label="Radius"
                            max={250}
                            min={1}
                            onChange={handleChangeCircleRadius}
                            step={1}
                            value={circleLayout.radius}
                            defaultValue={DefaultCircleLayoutOptions.radius}
                        />
                    </>
                )} */}

                {layoutType === 'grid' && (
                    <>
                        {/* In analysis for better use cases 
                            TODO: Find use cases for grid rows adjustment or deprecation */}
                        {/* <RangeInput
                            label="Rows"
                            max={10}
                            min={1}
                            onChange={handleChangeGridRows}
                            step={1}
                            value={gridLayout.rows}
                            defaultValue={DefaultGridLayoutOptions.rows}
                        /> */}

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
                    <>
                        <button
                            className="btn btn-outline hover:btn-accent focus:btn-accent w-full mt-2 mb-1"
                            onClick={handleRandomLayout}
                        >
                            Randomize node positions
                        </button>
                    </>
                )}
            </div>
        </>
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

    if (isNaN(value)) {
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
