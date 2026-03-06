import { useGetGraph } from '@/hooks/useGraphRegistry';
import { setGraphDirected } from '@/services/graphService';
import { useGraphProperties } from '@Contexts';
import { useEffect } from 'react';
import { ToggleInput } from '../common/inputs/ToggleInput';
import { ElementCounter } from './ElementCounter';

export function GraphSection() {
    const graphRef = useGetGraph('main-graph');
    const {
        directed,
        setDirected,
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

    const handleToggleDirected = (value: boolean) => {
        if (!graphRef.current) return;

        setGraphDirected(graphRef.current, value);
        setDirected(value);
    };

    return (
        <>
            <div className="divider mt-2">
                <h1 className="text-lg font-bold text-center">Graph</h1>
            </div>

            <div className="grid grid-flow-col gap-4 text-center auto-cols-fr">
                <ElementCounter label="Nodes" value={nodeCount} />
                <ElementCounter label="Edges" value={edgeCount} />
            </div>

            <div className="mt-3">
                <ToggleInput
                    label="Directed"
                    checked={directed}
                    defaultValue={false}
                    onChange={(e) => {
                        handleToggleDirected(e.target.checked);
                    }}
                    tooltip={{
                        content:
                            'When enabled, new and existing edges show direction arrows.',
                    }}
                />
            </div>
        </>
    );
}
