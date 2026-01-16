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

        newCore.on('select', 'node, edge', (e: cytoscape.EventObject) => {
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

            newCore.data('nodeSelectionOrder', [...currentSelectedNodes, ...targetNodes]);
            newCore.data('edgeSelectionOrder', [...currentSelectedEdges, ...targetEdges]);

            setSelectedNodes(newCore.nodes(':selected'));
            setSelectedEdges(newCore.edges(':selected'));
        });

        newCore.on('unselect', 'node, edge', (e: cytoscape.EventObject) => {
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

            const filteredSelectionNodes = currentSelectedNodes.filter(
                (id) => !targetNodes.includes(id)
            );

            const filteredSelectionEdges = currentSelectedEdges.filter(
                (id) => !targetEdges.includes(id)
            );

            newCore.data('nodeSelectionOrder', filteredSelectionNodes);
            newCore.data('edgeSelectionOrder', filteredSelectionEdges);

            setSelectedNodes(newCore.nodes(':selected'));
            setSelectedEdges(newCore.edges(':selected'));
        });

        setGraph(newCore);

        return () => {
            destroyGraph(newCore);
        };
    }, [canvasId, setSelectedNodes, setSelectedEdges]);

    useRegisterGraph(canvasId, graph);

    return <div className="h-full w-full bg-base-100" id={canvasId} />;
}

type GraphCanvasProps = {
    containerId: string;
};
