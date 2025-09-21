import { ColorInput, NumberInput, SelectInput } from '@/components/common/inputs';
import { useEdgesProperties } from '@/contexts/EdgesContext';
import { useGraphProperties } from '@/contexts/GraphContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { updateEdges } from '@/services/EdgesServices';
import { isEdgeCurve } from '@/types/edgesTypeGuards';
import { findPropertyValueMode } from '@/utils';
import { type ChangeEvent, useEffect, useMemo } from 'react';

export function EdgesSection({ visible = true }: EdgesSectionProps) {
    const graph = useGetGraph('main-graph');
    const {
        labelStyle, setLabelStyle,
        weight, setWeight,
        color, setColor,
        lineStyle, setLineStyle,
        curveStyle, setCurveStyle
    } = useEdgesProperties();

    const { edges: { selected: selectedEdges } } = useGraphProperties();

    useEffect(() => {
        if (!graph) { return; }
        if (!selectedEdges) { return; }

        if (selectedEdges.length === 0) {
            setLabelStyle('hidden');
            setColor('#cccccc');
            setLineStyle('solid');
            setCurveStyle('bezier');
            setWeight(1);
            return;
        }

        // Find the mode (most common value) for each property among selected edges
        const modeLabel = findPropertyValueMode(selectedEdges, 'label') ?? 'hidden';
        const modeColor = findPropertyValueMode(selectedEdges, 'color') ?? '#cccccc';
        const modeLineStyle = findPropertyValueMode(selectedEdges, 'style') ?? 'solid';
        const modeCurve = findPropertyValueMode(selectedEdges, 'curve');
        const modeWeight = findPropertyValueMode(selectedEdges, 'weight') ?? 1;
            
        setLabelStyle(modeLabel);
        setColor(modeColor);
        setLineStyle(modeLineStyle);
        setCurveStyle(isEdgeCurve(modeCurve) ? modeCurve : 'bezier');
        setWeight(Number(modeWeight));
    }, [graph, selectedEdges, setLabelStyle, setColor, setLineStyle, setCurveStyle, setWeight]);

    const handleChangeLabel = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graph) { return; }
        if (!selectedEdges) { return; }

        const { value } = e.target;

        updateEdges(selectedEdges, 'label', value);
        setLabelStyle(value);
    };

    const handleChangeWeight = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graph) { return; }
        if (!selectedEdges) { return; }

        const { value } = e.target;

        updateEdges(selectedEdges, 'weight', Number(value));
        setWeight(Number(value));
    };

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graph) { return; }
        if (!selectedEdges) { return; }

        updateEdges(selectedEdges, 'color', e.target.value);
        setColor(e.target.value);
    };

    const handleChangeLineStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graph) { return; }
        if (!selectedEdges) { return; }

        const { value } = e.target;

        updateEdges(selectedEdges, 'style', value);
        setLineStyle(value);
    };

    const handleChangeCurveStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graph) { return; }
        if (!selectedEdges) { return; }

        const { value } = e.target;

        updateEdges(selectedEdges, 'curve', value);
        setCurveStyle(isEdgeCurve(value) ? value : 'bezier');
    };

    const selectLabelOptions = useMemo(() => {
        return labelStyleOptions.map(
            style => ({
                label: style.charAt(0).toUpperCase() + style.slice(1),
                value: style
            })
        );
    }, []);

    const selectLineStyleOptions = useMemo(() => {
        return lineStyleOptions.map(
            style => ({
                label: style.charAt(0).toUpperCase() + style.slice(1),
                value: style
            })
        );
    }, []);

    const selectCurveStyleOptions = useMemo(() => {
        return curveStyleOptions.map(
            style => ({
                label: style.charAt(0).toUpperCase() + style.slice(1),
                value: style
            })
        );
    }, []);

    return (
        <div className={ visible ? '' : 'hidden' }>
            <div className='divider mb-1'>
                <h1 className='text-lg font-bold text-center'>Edges</h1>
            </div>

            <SelectInput
                label='Label Style'
                onChange={ handleChangeLabel }
                options={ selectLabelOptions }
                selectTitle='Pick a label style'
                value={ labelStyle }
            />

            <NumberInput
                label='Weight'
                onChange={ handleChangeWeight }
                value={ weight }
            />

            <ColorInput
                label='Color'
                onChange={ handleChangeColor }
                value={ color }
            />

            <SelectInput
                label='Line Style'
                onChange={ handleChangeLineStyle }
                options={ selectLineStyleOptions }
                selectTitle='Pick a line style'
                value={ lineStyle }
            />

            <SelectInput
                label='Curve Style'
                onChange={ handleChangeCurveStyle }
                options={ selectCurveStyleOptions }
                selectTitle='Pick a curve style'
                value={ curveStyle }
            />
        </div>
    );
}

const labelStyleOptions = [
    'hidden',
    'weight',
    'index',
];

const lineStyleOptions = [
    'solid',
    'dashed',
    'dotted',
];

const curveStyleOptions = [
    'haystack',
    'straight',
    'straight-triangle',
    'bezier',
    'unbundled-bezier',
    'segments',
    'round-segments',
    'taxi',
    'round-taxi',
];

type EdgesSectionProps = {
    visible?: boolean;
};
