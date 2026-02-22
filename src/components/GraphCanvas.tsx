import { bindAutopan } from '@/services/autopanService';
import { destroyGraph, newGraph } from '@/services/graphService';
import type { GraphInstance } from '@/types/graph';
import { useGraphProperties, useToasts } from '@Contexts';
import type cytoscape from 'cytoscape';
import { useEffect, useRef } from 'react';
import { useRegisterGraph } from '../hooks/useGraphRegistry';
import { isArrayOfStrings } from '../types/typeGuards';

export function GraphCanvas({ containerId }: GraphCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<GraphInstance>(null);

    const {
        nodes: { setSelected: setSelectedNodes },
        edges: { setSelected: setSelectedEdges },
    } = useGraphProperties();

    const { addToast } = useToasts();
    const addToastRef = useRef(addToast);

    useEffect(() => {
        addToastRef.current = addToast;
    }, [addToast]);

    useEffect(() => {
        if (!containerRef.current) {
            addToastRef.current({
                type: 'error',
                message: 'Graph container not found. Please try again.',
            });
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
                const message = 'Invalid selection order data.';
                addToastRef.current({ type: 'error', message });
                return;
            }
            const targetNodes = target.filter('node').map((n) => n.id());
            const targetEdges = target.filter('edge').map((n) => n.id());

            let nodeSelectionOrder = [...currentSelectedNodes, ...targetNodes];
            let edgeSelectionOrder = [...currentSelectedEdges, ...targetEdges];

            if (e.type === 'unselect') {
                nodeSelectionOrder = nodeSelectionOrder.filter(
                    (id) => !targetNodes.includes(id)
                );
                edgeSelectionOrder = edgeSelectionOrder.filter(
                    (id) => !targetEdges.includes(id)
                );
            }

            core.data('nodeSelectionOrder', nodeSelectionOrder);
            core.data('edgeSelectionOrder', edgeSelectionOrder);

            setSelectedNodes(core.nodes(':selected').map((n) => n.id()));
            setSelectedEdges(core.edges(':selected').map((e) => e.id()));
        };

        newCore.on('select', 'node, edge', handleElementSelection);
        newCore.on('unselect', 'node, edge', handleElementSelection);

        const cleanupAutopan = bindAutopan(newCore);

        graphRef.current = newCore;

        return () => {
            cleanupAutopan();
            destroyGraph(newCore);
            graphRef.current = null;
        };
    }, [containerId, setSelectedNodes, setSelectedEdges]);

    useRegisterGraph(containerId, graphRef);

    return (
        <div
            className="h-full w-full bg-base-100"
            ref={containerRef}
            id={containerId}
        />
    );
}

type GraphCanvasProps = {
    containerId: string;
};
