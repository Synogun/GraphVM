import { DefaultNodesData } from '@/constants/graphDefaults';
import { useGetGraph, usePropertyEditor } from '@/hooks';
import { updateNodes } from '@/services/graph';
import { isNodeShape, ValidNodeShapes } from '@/types/elements/nodes/typeGuards';
import { findPropertyValueMode, parseKebabCase } from '@/utils/elements';
import { getDefaultNodesData, setDefaultNodesData } from '@/utils/styleHelpers';
import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { useModals } from '@Contexts';
import { ButtonInput, ColorInput, SelectInput } from '@Inputs';
import { type ChangeEvent, useLayoutEffect, useMemo, useState } from 'react';

export function NodesSection({ visible = true }: Readonly<NodeSectionProps>) {
    const graphRef = useGetGraph('main-graph');
    const [color, setColor] = useState<string>(DefaultNodesData.color);
    const [shape, setShape] = useState<cytoscape.Css.NodeShape>(
        DefaultNodesData.shape
    );
    const { setIsNodeLabelModalOpen } = useModals();
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const selectedNodes = useGraphSelectionStore((s) => s.selectedNodes);

    const propertyEditor = usePropertyEditor({
        graphRef,
        selectedIds: selectedNodes,
        getDefaults: getDefaultNodesData,
        setDefaults: setDefaultNodesData,
        getElements: (core) => core.nodes(),
        updateElements: (core, ids, property, value) => {
            if (value !== undefined) updateNodes(core, ids, property, value);
        },
    });

    useLayoutEffect(() => {
        const core = graphRef.current;
        if (!core) return;

        const currentDefaults = getDefaultNodesData(core);

        if (selectedNodes.length === 0) {
            setColor(currentDefaults.color);
            setShape(currentDefaults.shape);
            return;
        }

        const collection = core
            .nodes()
            .filter((n) => selectedNodes.includes(n.id()));
        const modeColor =
            findPropertyValueMode(collection, 'color', true) ?? currentDefaults.color;
        const modeShapeRaw =
            findPropertyValueMode(collection, 'shape', true) ?? currentDefaults.shape;
        const modeShape = isNodeShape(modeShapeRaw)
            ? modeShapeRaw
            : currentDefaults.shape;

        setColor(modeColor);
        setShape(modeShape);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- graphRef is a stable ref; reading .current inside the effect is intentional
    }, [selectedNodes, activeTabId]);

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        const didApply = propertyEditor.applyValue('color', e.target.value);
        if (!didApply) {
            return;
        }

        setColor(e.target.value);
    };

    const handleChangeShape = (e: ChangeEvent<HTMLSelectElement>) => {
        const currentDefaults = propertyEditor.resolveDefaults();
        if (!currentDefaults) {
            return;
        }

        const { value } = e.target;

        const parsedValue: cytoscape.Css.NodeShape = isNodeShape(value)
            ? value
            : currentDefaults.shape;

        const didApply = propertyEditor.applyValue('shape', parsedValue);
        if (!didApply) {
            return;
        }

        setShape(parsedValue);
    };

    const selectShapeOptions = useMemo(() => {
        // TODO: Addres shape types wich works only with specific edge styles
        return [
            { label: 'Pick a node shape', value: '', title: true },
            ...ValidNodeShapes.map((shape) => ({
                label: parseKebabCase(shape),
                value: shape,
            })),
        ];
    }, []);

    return (
        <div className={visible ? '' : 'hidden'}>
            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Nodes</h1>
            </div>

            <ButtonInput
                label="Label"
                onClick={() => {
                    setIsNodeLabelModalOpen(true);
                }}
                disabled={selectedNodes.length === 0}
                tooltip={{ content: 'Edit labels of selected nodes.' }}
            >
                Edit Labels
            </ButtonInput>

            <ColorInput
                label="Color"
                onChange={handleChangeColor}
                value={color}
                defaultValue={DefaultNodesData.color}
                tooltip={{ content: 'Determine the color of the nodes.' }}
            />

            <SelectInput
                label="Shape"
                onChange={handleChangeShape}
                options={selectShapeOptions}
                value={shape}
                defaultValue={DefaultNodesData.shape}
                tooltip={{ content: 'Determine the shape of the nodes.' }}
            />
        </div>
    );
}

type NodeSectionProps = {
    visible?: boolean;
};
