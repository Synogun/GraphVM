import { ColorInput, NumberInput, SelectInput } from '@/components/common/inputs';
import { useEdgesProperties } from '@/contexts/EdgesContext';
import { useGraphProperties } from '@/contexts/GraphContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { updateEdges } from '@/services/EdgesService';
import {
    isEdgeCurve,
    ValidEdgeCurves,
    ValidEdgeLabelStyle,
    ValidEdgeLineStyles,
} from '@/types/edgesTypeGuards';
import { findPropertyValueMode, parseKebabCase } from '@/utils/elements';
import { type ChangeEvent, useEffect, useMemo } from 'react';

export function EdgesSection({ visible = true }: EdgesSectionProps) {
    const graphRef = useGetGraph('main-graph');
    const {
        labelStyle,
        setLabelStyle,
        weight,
        setWeight,
        color,
        setColor,
        lineStyle,
        setLineStyle,
        curveStyle,
        setCurveStyle,
    } = useEdgesProperties();

    const {
        edges: { selected: selectedEdges },
    } = useGraphProperties();

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        if (selectedEdges.length === 0) {
            setLabelStyle('hidden');
            setColor('#cccccc');
            setLineStyle('solid');
            setCurveStyle('bezier');
            setWeight(1);
            return;
        }

        const edgeCollection = graphRef.current
            .edges()
            .filter((e) => selectedEdges.includes(e.id()));

        // Find the mode (most common value) for each property among selected edges
        const modeLabel = findPropertyValueMode(edgeCollection, 'label') ?? 'hidden';
        const modeColor = findPropertyValueMode(edgeCollection, 'color') ?? '#cccccc';
        const modeLineStyle = findPropertyValueMode(edgeCollection, 'style') ?? 'solid';
        const modeCurve = findPropertyValueMode(edgeCollection, 'curve') ?? 'bezier';
        const modeWeight = findPropertyValueMode(edgeCollection, 'weight') ?? 1;

        setLabelStyle(modeLabel);
        setColor(modeColor);
        setLineStyle(modeLineStyle);
        setCurveStyle(isEdgeCurve(modeCurve) ? modeCurve : 'bezier');
        setWeight(Number(modeWeight));
    }, [graphRef, selectedEdges, setLabelStyle, setColor, setLineStyle, setCurveStyle, setWeight]);

    const handleChangeLabel = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;

        updateEdges(graphRef.current, selectedEdges, 'label', value);
        setLabelStyle(value);
    };

    const handleChangeWeight = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;

        updateEdges(graphRef.current, selectedEdges, 'weight', Number(value));
        setWeight(Number(value));
    };

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graphRef.current) {
            return;
        }

        updateEdges(graphRef.current, selectedEdges, 'color', e.target.value);
        setColor(e.target.value);
    };

    const handleChangeLineStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;

        updateEdges(graphRef.current, selectedEdges, 'style', value);
        setLineStyle(value);
    };

    const handleChangeCurveStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;

        updateEdges(graphRef.current, selectedEdges, 'curve', value);
        setCurveStyle(isEdgeCurve(value) ? value : 'bezier');
    };

    const selectLabelOptions = useMemo(() => {
        return ValidEdgeLabelStyle.map((style) => ({
            label: parseKebabCase(style),
            value: style,
        }));
    }, []);

    const selectLineStyleOptions = useMemo(() => {
        return ValidEdgeLineStyles.map((style) => ({
            label: parseKebabCase(style),
            value: style,
        }));
    }, []);

    const selectCurveStyleOptions = useMemo(() => {
        return ValidEdgeCurves.map((style) => ({
            label: parseKebabCase(style),
            value: style,
        }));
    }, []);

    return (
        <div className={visible ? '' : 'hidden'}>
            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Edges</h1>
            </div>

            <SelectInput
                label="Label Style"
                onChange={handleChangeLabel}
                options={selectLabelOptions}
                selectTitle="Pick a label style"
                value={labelStyle}
            />

            <NumberInput label="Weight" onChange={handleChangeWeight} value={weight} />

            <ColorInput label="Color" onChange={handleChangeColor} value={color} />

            <SelectInput
                label="Line Style"
                onChange={handleChangeLineStyle}
                options={selectLineStyleOptions}
                selectTitle="Pick a line style"
                value={lineStyle}
            />

            <SelectInput
                label="Curve Style"
                onChange={handleChangeCurveStyle}
                options={selectCurveStyleOptions}
                selectTitle="Pick a curve style"
                value={curveStyle}
            />
        </div>
    );
}

type EdgesSectionProps = {
    visible?: boolean;
};
