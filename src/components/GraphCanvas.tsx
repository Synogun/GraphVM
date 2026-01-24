import { useGraphProperties } from '@/contexts/GraphContext';
import { destroyGraph, newGraph } from '@/services/GraphService';
import type cytoscape from 'cytoscape';
import { useEffect, useRef } from 'react';
import { useRegisterGraph } from '../hooks/useGraphRegistry';
import { isArrayOfStrings } from '../types/typeGuards';
import type { GraphInstance } from '@/types/graph';

export function GraphCanvas({ containerId }: GraphCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<GraphInstance>(null);

    const {
        nodes: { setSelected: setSelectedNodes },
        edges: { setSelected: setSelectedEdges },
    } = useGraphProperties();

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const newCore = newGraph(containerId, {
            data: {
                nodeSelectionOrder: [],
                edgeSelectionOrder: [],
            },
        });

        const handleElementSelection = (e: cytoscape.EventObject) => {
            const target = e.target as cytoscape.Collection;
            const core = e.cy;

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
            const targetNodes = target.filter('node').map((n) => n.id());
            const targetEdges = target.filter('edge').map((n) => n.id());

            let nodeSelectionOrder = [...currentSelectedNodes, ...targetNodes];
            let edgeSelectionOrder = [...currentSelectedEdges, ...targetEdges];

            if (e.type === 'unselect') {
                nodeSelectionOrder = nodeSelectionOrder.filter((id) => !targetNodes.includes(id));
                edgeSelectionOrder = edgeSelectionOrder.filter((id) => !targetEdges.includes(id));
            }

            core.data('nodeSelectionOrder', nodeSelectionOrder);
            core.data('edgeSelectionOrder', edgeSelectionOrder);

            setSelectedNodes(core.nodes(':selected'));
            setSelectedEdges(core.edges(':selected'));
        };

        newCore.on('select', 'node, edge', handleElementSelection);
        newCore.on('unselect', 'node, edge', handleElementSelection);

        graphRef.current = newCore;

        return () => {
            destroyGraph(newCore);
            graphRef.current = null;
        };
    }, [containerId, setSelectedNodes, setSelectedEdges]);

    useRegisterGraph(containerId, graphRef);

    return <div className="h-full w-full bg-base-100" ref={containerRef} id={containerId} />;
}

type GraphCanvasProps = {
    containerId: string;
};
