import { DefaultEdgesData } from '@/constants/graphDefaults';
import { useGetGraph, usePropertyEditor } from '@/hooks';
import { updateEdges } from '@/services/graph';
import {
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLabelStyle,
    isEdgeLineStyle,
    ValidEdgeArrowShapes,
    ValidEdgeCurves,
    ValidEdgeLabelStyle,
    ValidEdgeLineStyles,
} from '@/types/elements/edges/typeGuards';
import type { EdgeCurveStyle, EdgeLabelStyle } from '@/types/elements/edges';
import type cytoscape from 'cytoscape';
import { findPropertyValueMode, parseKebabCase } from '@/utils/elements';
import { getDefaultEdgesData, setDefaultEdgesData } from '@/utils/styleHelpers';
import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { useGraphMetaStore } from '@/stores/graphMetaStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { ColorInput, NumberInput, SelectInput } from '@Inputs';
import { type ChangeEvent, useLayoutEffect, useMemo, useState } from 'react';

export function EdgesSection({ visible = true }: Readonly<EdgesSectionProps>) {
    const graphRef = useGetGraph('main-graph');

    const [labelStyle, setLabelStyle] = useState<EdgeLabelStyle>(DefaultEdgesData.label);
    const [color, setColor] = useState<string>(DefaultEdgesData.color);
    const [lineStyle, setLineStyle] = useState<cytoscape.Css.LineStyle>(DefaultEdgesData.style);
    const [curveStyle, setCurveStyle] = useState<EdgeCurveStyle>(DefaultEdgesData.curve);
    const [weight, setWeight] = useState<number>(DefaultEdgesData.weight);
    const [arrowShape, setArrowShape] = useState<cytoscape.Css.ArrowShape>(DefaultEdgesData.arrowShape);

    const directed = useGraphMetaStore((s) => s.directed);
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const selectedEdges = useGraphSelectionStore((s) => s.selectedEdges);
    const selectionInfo = useGraphSelectionStore((s) => s.selectionInfo);

    const isGhostEdgeSelected =
        selectionInfo.group === 'edge' && selectionInfo.isGhost;

    const propertyEditor = usePropertyEditor({
        graphRef,
        selectedIds: selectedEdges,
        getDefaults: getDefaultEdgesData,
        setDefaults: setDefaultEdgesData,
        getElements: (core) => core.edges(),
        updateElements: (core, ids, property, value) => {
            updateEdges(core, ids, property, value);
        },
    });

    useLayoutEffect(() => {
        const core = graphRef.current;
        if (!core) return;

        const currentDefaults = getDefaultEdgesData(core);

        if (selectedEdges.length === 0) {
            setLabelStyle(currentDefaults.label);
            setColor(currentDefaults.color);
            setLineStyle(currentDefaults.style);
            setCurveStyle(currentDefaults.curve);
            setWeight(currentDefaults.weight);
            setArrowShape(currentDefaults.arrowShape);
            return;
        }

        const collection = core.edges().filter((e) => selectedEdges.includes(e.id()));
        const rawLabel = findPropertyValueMode(collection, 'label') ?? currentDefaults.label;
        const rawColor = findPropertyValueMode(collection, 'color') ?? currentDefaults.color;
        const rawStyle = findPropertyValueMode(collection, 'style') ?? currentDefaults.style;
        const rawCurve = findPropertyValueMode(collection, 'curve') ?? currentDefaults.curve;
        const rawWeight = findPropertyValueMode(collection, 'weight') ?? currentDefaults.weight;
        const rawArrowShape = findPropertyValueMode(collection, 'arrowShape') ?? currentDefaults.arrowShape;

        setLabelStyle(isEdgeLabelStyle(rawLabel) ? rawLabel : currentDefaults.label);
        setColor(rawColor);
        setLineStyle(isEdgeLineStyle(rawStyle) ? rawStyle : currentDefaults.style);
        setCurveStyle(isEdgeCurve(rawCurve) ? rawCurve : currentDefaults.curve);
        setWeight(Number(rawWeight) || currentDefaults.weight);
        setArrowShape(isEdgeArrowShape(rawArrowShape) ? rawArrowShape : currentDefaults.arrowShape);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- graphRef is a stable ref; reading .current inside the effect is intentional
    }, [selectedEdges, activeTabId]);

    const handleChangeLabel = (e: ChangeEvent<HTMLSelectElement>) => {
        const currentDefaults = propertyEditor.resolveDefaults();
        if (!currentDefaults) {
            return;
        }

        const { value } = e.target;

        const parsedValue =
            value && isEdgeLabelStyle(value) ? value : currentDefaults.label;

        const didApply = propertyEditor.applyValue('label', parsedValue);
        if (!didApply) {
            return;
        }

        setLabelStyle(parsedValue);
    };

    const handleChangeWeight = (e: ChangeEvent<HTMLInputElement>) => {
        const currentDefaults = propertyEditor.resolveDefaults();
        if (!currentDefaults) {
            return;
        }

        const { value } = e.target;

        const parsedValue =
            value && !Number.isNaN(Number(value)) && Number(value) > 0
                ? Number(value)
                : currentDefaults.weight;

        const didApply = propertyEditor.applyValue('weight', parsedValue);
        if (!didApply) {
            return;
        }

        setWeight(parsedValue);
    };

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        const didApply = propertyEditor.applyValue('color', e.target.value);
        if (!didApply) {
            return;
        }

        setColor(e.target.value);
    };

    const handleChangeLineStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        const currentDefaults = propertyEditor.resolveDefaults();
        if (!currentDefaults) {
            return;
        }

        const { value } = e.target;

        const parsedValue =
            value && isEdgeLineStyle(value) ? value : currentDefaults.style;

        const didApply = propertyEditor.applyValue('style', parsedValue);
        if (!didApply) {
            return;
        }

        setLineStyle(parsedValue);
    };

    const handleChangeCurveStyle = (e: ChangeEvent<HTMLSelectElement>) => {
        const currentDefaults = propertyEditor.resolveDefaults();
        if (!currentDefaults) {
            return;
        }

        const { value } = e.target;

        const parsedValue =
            value && isEdgeCurve(value) ? value : currentDefaults.curve;

        const didApply = propertyEditor.applyValue('curve', parsedValue);
        if (!didApply) {
            return;
        }

        setCurveStyle(parsedValue);
    };

    const handleChangeArrowShape = (e: ChangeEvent<HTMLSelectElement>) => {
        const currentDefaults = propertyEditor.resolveDefaults();
        if (!currentDefaults) {
            return;
        }

        const { value } = e.target;

        const parsedValue =
            value && isEdgeArrowShape(value) ? value : currentDefaults.arrowShape;

        const didApply = propertyEditor.applyValue('arrowShape', parsedValue);
        if (!didApply) {
            return;
        }

        setArrowShape(parsedValue);
    };

    const selectLabelOptions = useMemo(() => {
        return [
            { label: 'Pick a label style', value: '', title: true },
            ...ValidEdgeLabelStyle.map((style) => ({
                label: parseKebabCase(style),
                value: style,
            })),
        ];
    }, []);

    const selectLineStyleOptions = useMemo(() => {
        return [
            { label: 'Pick a line style', value: '', title: true },
            ...ValidEdgeLineStyles.map((style) => ({
                label: parseKebabCase(style),
                value: style,
            })),
        ];
    }, []);

    const selectCurveStyleOptions = useMemo(() => {
        return [
            { label: 'Pick a curve style', value: '', title: true },
            ...ValidEdgeCurves.map((style) => ({
                label: parseKebabCase(style),
                value: style,
            })),
        ];
    }, []);

    const selectArrowShapeOptions = useMemo(() => {
        return [
            { label: 'Pick an arrow shape', value: '', title: true },
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
                min={1}
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
                disabled={isGhostEdgeSelected}
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
