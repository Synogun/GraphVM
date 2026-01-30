import {
    ColorInput,
    NumberInput,
    SelectInput,
} from '@/components/common/inputs';
import { useEdgesProperties } from '@/contexts/EdgesContext';
import { useGraphProperties } from '@/contexts/GraphContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { DefaultStyleService } from '@/services/DefaultStyleService';
import { updateEdges } from '@/services/EdgesService';
import {
    isEdgeCurve,
    isEdgeLabelStyle,
    isEdgeLineStyle,
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

        const defaultEdgesData =
            DefaultStyleService.getInstance().getEdgesData();

        if (selectedEdges.length === 0) {
            setLabelStyle(defaultEdgesData.label);
            setColor(defaultEdgesData.color);
            setLineStyle(defaultEdgesData.style);
            setCurveStyle(defaultEdgesData.curve);
            setWeight(defaultEdgesData.weight);
            return;
        }

        const edgeCollection = graphRef.current
            .edges()
            .filter((e) => selectedEdges.includes(e.id()));

        const modeLabel =
            findPropertyValueMode(edgeCollection, 'label') ??
            defaultEdgesData.label;
        const modeColor =
            findPropertyValueMode(edgeCollection, 'color') ??
            defaultEdgesData.color;
        const modeLineStyle =
            findPropertyValueMode(edgeCollection, 'style') ??
            defaultEdgesData.style;
        const modeCurve =
            findPropertyValueMode(edgeCollection, 'curve') ??
            defaultEdgesData.curve;
        const modeWeight =
            findPropertyValueMode(edgeCollection, 'weight') ??
            defaultEdgesData.weight;

        setLabelStyle(
            isEdgeLabelStyle(modeLabel) ? modeLabel : defaultEdgesData.label
        );
        setColor(modeColor);
        setLineStyle(
            isEdgeLineStyle(modeLineStyle)
                ? modeLineStyle
                : defaultEdgesData.style
        );
        setCurveStyle(
            isEdgeCurve(modeCurve) ? modeCurve : defaultEdgesData.curve
        );
        setWeight(Number(modeWeight) || defaultEdgesData.weight);
    }, [
        graphRef,
        selectedEdges,
        setLabelStyle,
        setColor,
        setLineStyle,
        setCurveStyle,
        setWeight,
    ]);

    const handleChangeLabel = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const defaultStyleService = DefaultStyleService.getInstance();

        const parsedValue =
            value && isEdgeLabelStyle(value)
                ? value
                : defaultStyleService.getEdgesData().label;

        if (selectedEdges.length === 0) {
            defaultStyleService.setEdgesData({ label: parsedValue });
        } else {
            updateEdges(graphRef.current, selectedEdges, 'label', parsedValue);
        }

        setLabelStyle(parsedValue);
    };

    const handleChangeWeight = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const defaultStyleService = DefaultStyleService.getInstance();

        const parsedValue =
            value && !isNaN(Number(value))
                ? Number(value)
                : defaultStyleService.getEdgesData().weight;

        if (selectedEdges.length === 0) {
            defaultStyleService.setEdgesData({ weight: parsedValue });
        } else {
            updateEdges(graphRef.current, selectedEdges, 'weight', parsedValue);
        }

        setWeight(parsedValue);
    };

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graphRef.current) {
            return;
        }

        if (selectedEdges.length === 0) {
            const defaultStyleService = DefaultStyleService.getInstance();
            defaultStyleService.setEdgesData({ color: e.target.value });
        } else {
            updateEdges(
                graphRef.current,
                selectedEdges,
                'color',
                e.target.value
            );
        }

        setColor(e.target.value);
    };

    const handleChangeLineStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const defaultStyleService = DefaultStyleService.getInstance();

        const parsedValue =
            value && isEdgeLineStyle(value)
                ? value
                : defaultStyleService.getEdgesData().style;

        if (selectedEdges.length === 0) {
            defaultStyleService.setEdgesData({ style: parsedValue });
        } else {
            updateEdges(graphRef.current, selectedEdges, 'style', parsedValue);
        }

        setLineStyle(parsedValue);
    };

    const handleChangeCurveStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const defaultStyleService = DefaultStyleService.getInstance();

        const parsedValue =
            value && isEdgeCurve(value)
                ? value
                : defaultStyleService.getEdgesData().curve;

        if (selectedEdges.length === 0) {
            defaultStyleService.setEdgesData({ curve: parsedValue });
        } else {
            updateEdges(graphRef.current, selectedEdges, 'curve', parsedValue);
        }

        setCurveStyle(parsedValue);
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

            <NumberInput
                label="Weight"
                onChange={handleChangeWeight}
                value={weight}
            />

            <SelectInput
                label="Label Style"
                onChange={handleChangeLabel}
                options={selectLabelOptions}
                selectTitle="Pick a label style"
                value={labelStyle}
            />

            <ColorInput
                label="Color"
                onChange={handleChangeColor}
                value={color}
            />

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
