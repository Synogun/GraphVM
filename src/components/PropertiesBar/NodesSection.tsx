import { ColorInput, SelectInput } from '@/components/common/inputs';
import { useGraphProperties } from '@/contexts/GraphContext';
import { useNodeProperties } from '@/contexts/NodesContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { updateNodes } from '@/services/NodesService';
import { findPropertyValueMode } from '@/utils';
import { type ChangeEvent, useEffect, useMemo } from 'react';

export function NodesSection({ visible = true }: NodeSectionProps) {
    const graph = useGetGraph('main-graph');
    const {
        color, setColor,
        shape, setShape,
    } = useNodeProperties();

    const { nodes: { selected: selectedNodes } } = useGraphProperties();

    useEffect(() => {
        if (!graph) { return; }
        if (!selectedNodes) { return; }

        if (selectedNodes.length === 0) {
            setColor('#999999');
            setShape('ellipse');
            return;
        } else {
            const modeColor = findPropertyValueMode(selectedNodes, 'color') ?? '#999999';
            const modeShape = findPropertyValueMode(selectedNodes, 'shape') ?? 'ellipse';

            setColor(modeColor);
            setShape(modeShape);
        }
    }, [graph, selectedNodes, setColor, setShape]);

    // const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (!graph) { return; }

    //     const selectedNodes = selectedNodes;
    //     const { value: rawValue } = e.target;
    //     const indexedValue = rawValue.split(';').map(v => v.trim()).join;

    //     graph.updateNodes(selectedNodes, 'label', indexedValue);
    // };

    const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
        if (!graph) { return; }
        if (!selectedNodes) { return; }

        updateNodes(selectedNodes, 'color', e.target.value);
        setColor(e.target.value);
    };

    const handleChangeShape = (e: ChangeEvent<HTMLSelectElement>) => {
        if (!graph) { return; }
        if (!selectedNodes) { return; }

        const { value } = e.target;

        updateNodes(selectedNodes, 'shape', value);
        setShape(value);
    };

    const selectShapeOptions = useMemo(() => {
        return shapeOptions
            .map(shape => ({
                label: shape.charAt(0).toUpperCase() + shape.slice(1),
                value: shape
            }));
    }, []);

    return (
        <div className={ visible ? '' : 'hidden' }>
            <div className='divider mb-1'>
                <h1 className='text-lg font-bold text-center'>Nodes</h1>
            </div>

            {/* <TextInput
                label='Label'
                onChange={ handleChangeLabel }
                // value={ nodeProperties.label }
            /> */}

            <ColorInput
                label='Color'
                onChange={ handleChangeColor }
                value={ color }
            />

            <SelectInput
                label='Shape'
                onChange={ handleChangeShape }
                options={ selectShapeOptions }
                selectTitle='Pick a node shape'
                value={ shape }
            />
        </div>
    );
}

const shapeOptions = [
    'ellipse',
    'triangle',
    'round-triangle',
    'rectangle',
    'round-rectangle',
    'bottom-round-rectangle',
    'cut-rectangle',
    'barrel',
    'rhomboid',
    'right-rhomboid',
    'diamond',
    'round-diamond',
    'pentagon',
    'round-pentagon',
    'hexagon',
    'round-hexagon',
    'concave-hexagon',
    'heptagon',
    'round-heptagon',
    'octagon',
    'round-octagon',
    'star',
    'round-star',
    'vee',
];

type NodeSectionProps = {
    visible?: boolean;
};
