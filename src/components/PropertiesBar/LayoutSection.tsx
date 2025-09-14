import { RangeInput, SelectInput } from '@components/common/inputs';
import { isLayoutType, useLayoutProperties } from '@contexts/LayoutContext';
import { useGetGraph } from '@hooks/useGraphRegistry';
import React, { ChangeEvent, useEffect, useMemo } from 'react';

export function LayoutSection({ visible = true }: LayoutSectionProps) {
    const graph = useGetGraph('main-graph');
    const {
        type: layoutType,
        setType: setLayoutType,
        circle: circleLayout,
        grid: gridLayout,
        setCurrent: setCurrentLayout,
    } = useLayoutProperties();

    useEffect(() => {
        if (!graph) return;

        let options: cytoscape.LayoutOptions = {
            name: layoutType,

            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-out',
        };
        
        if (layoutType === 'circle') {
            options = {
                ...options,
                name: 'circle',
                radius: circleLayout.radius
            };
        }

        if (layoutType === 'grid') {
            options = {
                ...options,
                name: 'grid',
                rows: gridLayout.rows,
                cols: gridLayout.cols
            };
        }

        setCurrentLayout(options);
        graph.arrangeGraph(options);
    }, [
        graph,
        layoutType,
        circleLayout.radius,
        gridLayout.rows,
        gridLayout.cols,
        setCurrentLayout
    ]);

    const handleChangeLayoutType = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const type = isLayoutType(value) ? value : 'circle';

        setLayoutType(type);
    };

    const handleChangeCircleRadius = (e: ChangeEvent<HTMLInputElement>) => {
        setNumberProperty(e, circleLayout.setRadius, circleLayout.radius, 1, 250);
    };

    const handleChangeGridRows = (e: ChangeEvent<HTMLInputElement>) => {
        setNumberProperty(e, gridLayout.setRows, gridLayout.rows, 1, 10);
    };

    const handleChangeGridCols = (e: ChangeEvent<HTMLInputElement>) => {
        setNumberProperty(e, gridLayout.setCols, gridLayout.cols, 1, 10);
    };

    const handleRandomLayout = () => {
        if (!graph) return;
        graph.arrangeGraph({ name: 'random' });
    };

    const selectTypeOptions = useMemo(() => {
        return layoutOptions
            .map(option => ({
                value: option,
                label: option.charAt(0).toUpperCase() + option.slice(1)
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    return (<>
        <div className={ visible ? '' : 'hidden' }>
            <div className='divider mb-1'>
                <h1 className='text-lg font-bold text-center'>Layout</h1>
            </div>

            <SelectInput
                label='Layout Type'
                onChange={ handleChangeLayoutType }
                options={ selectTypeOptions }
                selectTitle='Pick a layout type'
                value={ layoutType }
            />

            {layoutType === 'circle' && <>
                <RangeInput
                    label='Radius'
                    max={ 250 }
                    min={ 1 }
                    onChange={ handleChangeCircleRadius }
                    step={ 1 }
                    value={ circleLayout.radius }
                />
            </>}

            {layoutType === 'grid' && <>
                <RangeInput
                    label='Rows'
                    max={ 10 }
                    min={ 1 }
                    onChange={ handleChangeGridRows }
                    step={ 1 }
                    value={ gridLayout.rows }
                />

                <RangeInput
                    label='Columns'
                    max={ 10 }
                    min={ 1 }
                    onChange={ handleChangeGridCols }
                    step={ 1 }
                    value={ gridLayout.cols }
                />
            </>}

            {layoutType === 'random' && <>
                <button
                    className='btn btn-outline hover:btn-accent focus:btn-accent w-full mt-2 mb-1'
                    onClick={ handleRandomLayout }
                >
                    Randomize node positions
                </button>
            </>}
        </div>
    </>);
}

const setNumberProperty = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void,
    current: number,
    min: number,
    max: number
) => {
    let value = Number(e.target.value);

    if (isNaN(value)) { return; }

    if (value < min) { value = min; }
    if (value > max) { value = max; }

    if (value !== current) {
        setter(value);
    }
};

const layoutOptions = [
    'circle',
    'random',
    'grid',
    'concentric',
    'breadthfirst',
    'cose',
];

type LayoutSectionProps = {
    visible?: boolean;
};
