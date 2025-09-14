import { useGraphProperties } from '@contexts/GraphContext';
import type cytoscape from 'cytoscape';
import React, { useEffect, useState } from 'react';
import { isArrayOfStrings } from 'types/typeGuards';
import { useRegisterGraph } from '../hooks/useGraphRegistry';
import { GraphClass } from '../services/graphClass';

export function GraphCanvas({ containerId }: GraphCanvasProps) {
    const canvasId = containerId || 'main-graph';
    const [graph, setGraph] = useState<GraphClass | null>(null);
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
        const graphInstance = new GraphClass({
            containerId: canvasId,
        });

        graphInstance.getCore().data('nodeSelectionOrder', []);
        graphInstance.getCore().data('edgeSelectionOrder', []);
        setIsGraphInitialized(prev => ({ ...prev, data: true }));

        setGraph(graphInstance);

        return () => {
            graphInstance.destroyGraph();
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

        const core = graph.getCore();

        setSelectedNodes(graph.getSelectedNodes());
        setSelectedEdges(graph.getSelectedEdges());
        
        core.on('select', 'node, edge', (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;

            const currentSelectedNodes: unknown = core.data('nodeSelectionOrder');
            const currentSelectedEdges: unknown = core.data('edgeSelectionOrder');
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

            core.data('nodeSelectionOrder', [...currentSelectedNodes, ...targetNodes]);
            core.data('edgeSelectionOrder', [...currentSelectedEdges, ...targetEdges]);

            setSelectedNodes(graph.getSelectedNodes());
            setSelectedEdges(graph.getSelectedEdges());

            // console.log(core.data('nodeSelectionOrder'));
            // console.log(core.data('edgeSelectionOrder'));
        });

        core.on('unselect', 'node, edge', (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;

            const currentSelectedNodes: unknown = core.data('nodeSelectionOrder');
            const currentSelectedEdges: unknown = core.data('edgeSelectionOrder');

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

            core.data('nodeSelectionOrder', filteredSelectionNodes);
            core.data('edgeSelectionOrder', filteredSelectionEdges);

            setSelectedNodes(graph.getSelectedNodes());
            setSelectedEdges(graph.getSelectedEdges());
            
            // console.log(core.data('nodeSelectionOrder'));
            // console.log(core.data('edgeSelectionOrder'));
        });

        graph.setCore(core);
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
