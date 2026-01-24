import { useGraphProperties } from '@/contexts/GraphContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { useEffect } from 'react';
import ElementCounter from './ElementCounter';

export function GraphSection() {
    const graphRef = useGetGraph('main-graph');
    const {
        nodes: { count: nodeCount, setCount: setNodeCount },
        edges: { count: edgeCount, setCount: setEdgeCount },
    } = useGraphProperties();

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        const currentNodeCount = graphRef.current.nodes().length;
        if (nodeCount !== currentNodeCount) {
            setNodeCount(currentNodeCount);
        }

        const currentEdgeCount = graphRef.current.edges().length;
        if (edgeCount !== currentEdgeCount) {
            setEdgeCount(currentEdgeCount);
        }
    }, [graphRef, nodeCount, edgeCount, setNodeCount, setEdgeCount]);

    return (
        <>
            <div className="divider mt-2">
                <h1 className="text-lg font-bold text-center">Graph</h1>
            </div>

            <div className="grid grid-flow-col gap-4 text-center auto-cols-fr">
                <ElementCounter label="Nodes" value={nodeCount} />
                <ElementCounter label="Edges" value={edgeCount} />
            </div>
        </>
    );
}
