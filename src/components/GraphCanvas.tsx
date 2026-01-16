import { useGraphProperties } from '@/contexts/GraphContext';
import { destroyGraph, newGraph } from '@/services/GraphService';
import type cytoscape from 'cytoscape';
import { useEffect, useState } from 'react';
import { useRegisterGraph, type GraphApi } from '../hooks/useGraphRegistry';
import { isArrayOfStrings } from '../types/typeGuards';

export function GraphCanvas({ containerId }: GraphCanvasProps) {
    const canvasId = containerId || 'main-graph';
    const [graph, setGraph] = useState<GraphApi>(null);

    const {
        nodes: { setSelected: setSelectedNodes },
        edges: { setSelected: setSelectedEdges },
    } = useGraphProperties();

    useEffect(() => {
        const newCore = newGraph(canvasId, {
            data: {
                nodeSelectionOrder: [],
                edgeSelectionOrder: [],
            },
        });

        const handleElementSelection = (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;

            const currentSelectedNodes: unknown = newCore.data('nodeSelectionOrder');
            const currentSelectedEdges: unknown = newCore.data('edgeSelectionOrder');

            if (
                !isArrayOfStrings(currentSelectedNodes) ||
                !isArrayOfStrings(currentSelectedEdges)
            ) {
                console.log('event', e);
                console.error('Invalid selection order data');
                return;
            }
            const targetNodes = target.filter('node').map((n) => n.id());
            const targetEdges = target.filter('edge').map((n) => n.id());

            let nodeSelectionOrder = [...currentSelectedNodes, ...targetNodes];
            let edgeSelectionOrder = [...currentSelectedEdges, ...targetEdges];

            if (e.type === 'unselect') {
                nodeSelectionOrder = nodeSelectionOrder.filter((id) => !targetNodes.includes(id));
                edgeSelectionOrder = edgeSelectionOrder.filter((id) => !targetEdges.includes(id));
            }

            newCore.data('nodeSelectionOrder', nodeSelectionOrder);
            newCore.data('edgeSelectionOrder', edgeSelectionOrder);

            setSelectedNodes(newCore.nodes(':selected'));
            setSelectedEdges(newCore.edges(':selected'));
        };

        newCore.on('select', 'node, edge', handleElementSelection);
        newCore.on('unselect', 'node, edge', handleElementSelection);

        setGraph(newCore);

        return () => {
            destroyGraph(newCore);
            setGraph(null);
        };
    }, [canvasId, setSelectedNodes, setSelectedEdges]);

    useRegisterGraph(canvasId, graph);

    return <div className="h-full w-full bg-base-100" id={canvasId} />;
}

type GraphCanvasProps = {
    containerId: string;
};
