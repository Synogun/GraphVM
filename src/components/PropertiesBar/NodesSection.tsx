import { DefaultNodesData } from '@/config/graphDefaults';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { updateNodes } from '@/services/nodesService';
import { isNodeShape, ValidNodeShapes } from '@/types/nodesTypeGuards';
import { findPropertyValueMode, parseKebabCase } from '@/utils/elements';
import { getDefaultNodesData, setDefaultNodesData } from '@/utils/styleHelpers';
import { useGraphProperties, useNodeProperties } from '@Contexts';
import { ColorInput, SelectInput } from '@Inputs';
import { type ChangeEvent, useEffect, useMemo } from 'react';

export function NodesSection({ visible = true }: NodeSectionProps) {
    const graphRef = useGetGraph('main-graph');
    const { color, setColor, shape, setShape } = useNodeProperties();

    const {
        nodes: { selected: selectedNodes },
    } = useGraphProperties();

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        const { color: defaultNodeColor, shape: defaultNodeShape } =
            getDefaultNodesData(graphRef.current);

        if (selectedNodes.length === 0) {
            setColor(defaultNodeColor);
            setShape(defaultNodeShape);
            return;
        }

        const nodeCollection = graphRef.current
            .nodes()
            .filter((n) => selectedNodes.includes(n.id()));

        const modeColor =
            findPropertyValueMode(nodeCollection, 'color') ?? defaultNodeColor;
        const modeShape =
            findPropertyValueMode(nodeCollection, 'shape') ?? defaultNodeShape;

        setColor(modeColor);
        setShape(isNodeShape(modeShape) ? modeShape : defaultNodeShape);
    }, [graphRef, selectedNodes, setColor, setShape]);

    // const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (!graphRef.current) { return; }

    //     const selectedNodes = selectedNodes;
    //     const { value: rawValue } = e.target;
    //     const indexedValue = rawValue.split(';').map(v => v.trim()).join;

    //     graph.updateNodes(selectedNodes, 'label', indexedValue);
    // };

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graphRef.current) {
            return;
        }

        if (selectedNodes.length === 0) {
            setDefaultNodesData(graphRef.current, { color: e.target.value });
        } else {
            updateNodes(graphRef.current, selectedNodes, 'color', e.target.value);
        }

        setColor(e.target.value);
    };

    const handleChangeShape = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;
        const currentDefaults = getDefaultNodesData(graphRef.current);

        const parsedValue: cytoscape.Css.NodeShape = isNodeShape(value)
            ? value
            : currentDefaults.shape;

        if (selectedNodes.length === 0) {
            setDefaultNodesData(graphRef.current, { shape: parsedValue });
        } else {
            updateNodes(graphRef.current, selectedNodes, 'shape', parsedValue);
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

            {/* <SelectInput
                label='Label'
                onChange={ handleChangeLabel }
                // value={ nodeProperties.label }
            /> */}

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
