import { DefaultEdgesData } from '@/constants/graphDefaults';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { updateEdges } from '@/services/edgesService';
import {
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLabelStyle,
    isEdgeLineStyle,
    ValidEdgeArrowShapes,
    ValidEdgeCurves,
    ValidEdgeLabelStyle,
    ValidEdgeLineStyles,
} from '@/types/edgesTypeGuards';
import { findPropertyValueMode, parseKebabCase } from '@/utils/elements';
import { getDefaultEdgesData, setDefaultEdgesData } from '@/utils/styleHelpers';
import { useEdgesProperties, useGraphProperties } from '@Contexts';
import { ColorInput, NumberInput, SelectInput } from '@Inputs';
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
        arrowShape,
        setArrowShape,
    } = useEdgesProperties();

    const {
        directed,
        edges: { selected: selectedEdges },
    } = useGraphProperties();

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        const {
            label: defaultEdgesLabel,
            color: defaultEdgesColor,
            style: defaultEdgesStyle,
            curve: defaultEdgesCurve,
            weight: defaultEdgesWeight,
            arrowShape: defaultEdgesArrowShape,
        } = getDefaultEdgesData(graphRef.current);

        if (selectedEdges.length === 0) {
            setLabelStyle(defaultEdgesLabel);
            setColor(defaultEdgesColor);
            setLineStyle(defaultEdgesStyle);
            setCurveStyle(defaultEdgesCurve);
            setWeight(defaultEdgesWeight);
            return;
        }

        const edgeCollection = graphRef.current
            .edges()
            .filter((e) => selectedEdges.includes(e.id()));

        const modeLabel =
            findPropertyValueMode(edgeCollection, 'label') ?? defaultEdgesLabel;
        const modeColor =
            findPropertyValueMode(edgeCollection, 'color') ?? defaultEdgesColor;
        const modeLineStyle =
            findPropertyValueMode(edgeCollection, 'style') ?? defaultEdgesStyle;
        const modeCurve =
            findPropertyValueMode(edgeCollection, 'curve') ?? defaultEdgesCurve;
        const modeWeight =
            findPropertyValueMode(edgeCollection, 'weight') ?? defaultEdgesWeight;
        const modeArrowShape =
            findPropertyValueMode(edgeCollection, 'arrowShape') ??
            defaultEdgesArrowShape;

        setLabelStyle(isEdgeLabelStyle(modeLabel) ? modeLabel : defaultEdgesLabel);
        setColor(modeColor);
        setLineStyle(
            isEdgeLineStyle(modeLineStyle) ? modeLineStyle : defaultEdgesStyle
        );
        setCurveStyle(isEdgeCurve(modeCurve) ? modeCurve : defaultEdgesCurve);
        setWeight(Number(modeWeight) || defaultEdgesWeight);
        setArrowShape(
            isEdgeArrowShape(modeArrowShape)
                ? modeArrowShape
                : defaultEdgesArrowShape
        );
    }, [
        graphRef,
        selectedEdges,
        setLabelStyle,
        setColor,
        setLineStyle,
        setCurveStyle,
        setWeight,
        setArrowShape,
    ]);

    const handleChangeLabel = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const currentDefaults = getDefaultEdgesData(graphRef.current);

        const parsedValue =
            value && isEdgeLabelStyle(value) ? value : currentDefaults.label;

        if (selectedEdges.length === 0) {
            setDefaultEdgesData(graphRef.current, { label: parsedValue });
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
        const currentDefaults = getDefaultEdgesData(graphRef.current);

        const parsedValue =
            value && !isNaN(Number(value)) ? Number(value) : currentDefaults.weight;

        if (selectedEdges.length === 0) {
            setDefaultEdgesData(graphRef.current, { weight: parsedValue });
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
            setDefaultEdgesData(graphRef.current, { color: e.target.value });
        } else {
            updateEdges(graphRef.current, selectedEdges, 'color', e.target.value);
        }

        setColor(e.target.value);
    };

    const handleChangeLineStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const currentDefaults = getDefaultEdgesData(graphRef.current);

        const parsedValue =
            value && isEdgeLineStyle(value) ? value : currentDefaults.style;

        if (selectedEdges.length === 0) {
            setDefaultEdgesData(graphRef.current, { style: parsedValue });
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
        const currentDefaults = getDefaultEdgesData(graphRef.current);

        const parsedValue =
            value && isEdgeCurve(value) ? value : currentDefaults.curve;

        if (selectedEdges.length === 0) {
            setDefaultEdgesData(graphRef.current, { curve: parsedValue });
        } else {
            updateEdges(graphRef.current, selectedEdges, 'curve', parsedValue);
        }

        setCurveStyle(parsedValue);
    };

    const handleChangeArrowShape = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const currentDefaults = getDefaultEdgesData(graphRef.current);

        const parsedValue =
            value && isEdgeArrowShape(value) ? value : currentDefaults.arrowShape;

        if (selectedEdges.length === 0) {
            setDefaultEdgesData(graphRef.current, { arrowShape: parsedValue });
        } else {
            updateEdges(graphRef.current, selectedEdges, 'arrowShape', parsedValue);
        }

        setArrowShape(parsedValue);
    };

    const selectLabelOptions = useMemo(() => {
        return [
            { label: '"Pick a label style"', value: '', title: true },
            ...ValidEdgeLabelStyle.map((style) => ({
                label: parseKebabCase(style),
                value: style,
            })),
        ];
    }, []);

    const selectLineStyleOptions = useMemo(() => {
        return [
            { label: '"Pick a line style"', value: '', title: true },
            ...ValidEdgeLineStyles.map((style) => ({
                label: parseKebabCase(style),
                value: style,
            })),
        ];
    }, []);

    const selectCurveStyleOptions = useMemo(() => {
        return [
            { label: '"Pick a curve style"', value: '', title: true },
            ...ValidEdgeCurves.map((style) => ({
                label: parseKebabCase(style),
                value: style,
            })),
        ];
    }, []);

    const selectArrowShapeOptions = useMemo(() => {
        return [
            { label: '"Pick an arrow shape"', value: '', title: true },
            ...ValidEdgeArrowShapes.map((shape) => ({
                label: parseKebabCase(shape),
                value: shape,
            })),
        ];
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
                defaultValue={DefaultEdgesData.weight}
                tooltip={{ content: 'Determine the weight of the edges.' }}
            />

            <SelectInput
                label="Label Style"
                onChange={handleChangeLabel}
                options={selectLabelOptions}
                value={labelStyle}
                defaultValue={DefaultEdgesData.label}
                tooltip={{
                    content: 'Determine the text that appears on the edges.',
                }}
            />

            <ColorInput
                label="Color"
                onChange={handleChangeColor}
                value={color}
                defaultValue={DefaultEdgesData.color}
                tooltip={{ content: 'Determine the color of the edges.' }}
            />

            <SelectInput
                label="Line Style"
                onChange={handleChangeLineStyle}
                options={selectLineStyleOptions}
                value={lineStyle}
                defaultValue={DefaultEdgesData.style}
                tooltip={{
                    content: 'Determine the pattern used to draw the edges.',
                }}
            />

            <SelectInput
                label="Curve Style"
                onChange={handleChangeCurveStyle}
                options={selectCurveStyleOptions}
                value={curveStyle}
                defaultValue={DefaultEdgesData.curve}
                tooltip={{
                    content: 'Determine the curvature style of the edges. ',
                }}
            />

            {directed && (
                <SelectInput
                    label="Arrow Shape"
                    onChange={handleChangeArrowShape}
                    options={selectArrowShapeOptions}
                    value={arrowShape}
                    defaultValue={DefaultEdgesData.arrowShape}
                    tooltip={{
                        content: 'Choose the arrow head for directed edges.',
                    }}
                />
            )}
        </div>
    );
}

type EdgesSectionProps = {
    visible?: boolean;
};
