import { useGraphProperties } from '@/contexts/GraphContext';
import { destroyGraph, newGraph } from '@/services/GraphService';
import type cytoscape from 'cytoscape';
import { useEffect, useState } from 'react';
import { useRegisterGraph, type GraphApi } from '../hooks/useGraphRegistry';
import { isArrayOfStrings } from '../types/typeGuards';

export function GraphCanvas({ containerId }: GraphCanvasProps) {
    const canvasId = containerId || 'main-graph';
    const [graph, setGraph] = useState<GraphApi>(null);
    const [isGraphInitialized, setIsGraphInitialized] = useState({
        data: false,
        events: false,
    });

    const {
        nodes: { setSelected: setSelectedNodes },
        edges: {
            setSelected: setSelectedEdges,
            setEdgeMode,
        },

    } = useGraphProperties();

    useEffect(() => {
        const newCore = newGraph(canvasId, {
            data: {
                nodeSelectionOrder: [],
                edgeSelectionOrder: [],
            }
        });

        // newCore.getCore().data('nodeSelectionOrder', []);
        // newCore.getCore().data('edgeSelectionOrder', []);
        setIsGraphInitialized(prev => ({ ...prev, data: true }));

        setGraph(newCore);

        return () => {
            destroyGraph(newCore);
        };
    }, [canvasId]);

    useEffect(() => {
        if (
            !graph ||
            !isGraphInitialized.data ||
            isGraphInitialized.events
        ) {
            return;
        }

        setSelectedNodes(graph.nodes(':selected'));
        setSelectedEdges(graph.edges(':selected'));
        
        graph.on('select', 'node, edge', (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;

            const currentSelectedNodes: unknown = graph.data('nodeSelectionOrder');
            const currentSelectedEdges: unknown = graph.data('edgeSelectionOrder');
            if (
                !isArrayOfStrings(currentSelectedNodes) ||
                !isArrayOfStrings(currentSelectedEdges)
            ) {
                console.log('event', e);
                console.error('Invalid selection order data');
                return;
            }

            const targetNodes = target.filter('node').map(n => n.id());
            const targetEdges = target.filter('edge').map(n => n.id());

            graph.data('nodeSelectionOrder', [...currentSelectedNodes, ...targetNodes]);
            graph.data('edgeSelectionOrder', [...currentSelectedEdges, ...targetEdges]);

            setSelectedNodes(graph.nodes(':selected'));
            setSelectedEdges(graph.edges(':selected'));
        });

        graph.on('unselect', 'node, edge', (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;

            const currentSelectedNodes: unknown = graph.data('nodeSelectionOrder');
            const currentSelectedEdges: unknown = graph.data('edgeSelectionOrder');

            if (
                !isArrayOfStrings(currentSelectedNodes) ||
                !isArrayOfStrings(currentSelectedEdges)
            ) {
                console.log('event', e);
                console.error('Invalid selection order data');
                return;
            }

            const targetNodes = target.filter('node').map(n => n.id());
            const targetEdges = target.filter('edge').map(n => n.id());

            const filteredSelectionNodes = currentSelectedNodes
                .filter(id => !targetNodes.includes(id));
            
            const filteredSelectionEdges = currentSelectedEdges
                .filter(id => !targetEdges.includes(id));

            graph.data('nodeSelectionOrder', filteredSelectionNodes);
            graph.data('edgeSelectionOrder', filteredSelectionEdges);

            setSelectedNodes(graph.nodes(':selected'));
            setSelectedEdges(graph.edges(':selected'));
        });

        setIsGraphInitialized(prev => ({ ...prev, events: true }));
    }, [graph, setSelectedNodes, setSelectedEdges, isGraphInitialized, setEdgeMode]);

    useRegisterGraph(canvasId, graph);

    return (
        <div
            className='h-full w-full bg-base-100'
            id={ canvasId }
        />
    );
}

type GraphCanvasProps = {
    containerId: string;
};
