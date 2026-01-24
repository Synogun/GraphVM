import { ColorInput, SelectInput } from '@/components/common/inputs';
import { useGraphProperties } from '@/contexts/GraphContext';
import { useNodeProperties } from '@/contexts/NodesContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { updateNodes } from '@/services/NodesService';
import { ValidNodeShapes } from '@/types/nodesTypeGuards';
import { findPropertyValueMode, parseKebabCase } from '@/utils/elements';
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

        if (selectedNodes.length === 0) {
            setColor('#999999');
            setShape('ellipse');
            return;
        } else {
            const nodeCollection = graphRef.current
                .nodes()
                .filter((n) => selectedNodes.includes(n.id()));

            const modeColor = findPropertyValueMode(nodeCollection, 'color') ?? '#999999';
            const modeShape = findPropertyValueMode(nodeCollection, 'shape') ?? 'ellipse';

            setColor(modeColor);
            setShape(modeShape);
        }
    }, [graphRef, selectedNodes, setColor, setShape]);

    // const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (!graph) { return; }

    //     const selectedNodes = selectedNodes;
    //     const { value: rawValue } = e.target;
    //     const indexedValue = rawValue.split(';').map(v => v.trim()).join;

    //     graph.updateNodes(selectedNodes, 'label', indexedValue);
    // };

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graphRef.current) {
            return;
        }

        updateNodes(graphRef.current, selectedNodes, 'color', e.target.value);
        setColor(e.target.value);
    };

    const handleChangeShape = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graphRef.current) {
            return;
        }

        const { value } = e.target;

        updateNodes(graphRef.current, selectedNodes, 'shape', value);
        setShape(value);
    };

    const selectShapeOptions = useMemo(() => {
        // TODO: Addres shape types wich works only with specific edge styles
        return ValidNodeShapes.map((shape) => ({
            label: parseKebabCase(shape),
            value: shape,
        }));
    }, []);

    return (
        <div className={visible ? '' : 'hidden'}>
            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Nodes</h1>
            </div>

            {/* <TextInput
                label='Label'
                onChange={ handleChangeLabel }
                // value={ nodeProperties.label }
            /> */}

            <ColorInput label="Color" onChange={handleChangeColor} value={color} />

            <SelectInput
                label="Shape"
                onChange={handleChangeShape}
                options={selectShapeOptions}
                selectTitle="Pick a node shape"
                value={shape}
            />
        </div>
    );
}

type NodeSectionProps = {
    visible?: boolean;
};
