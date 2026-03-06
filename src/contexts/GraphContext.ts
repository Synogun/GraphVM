import type { GraphContextProperties } from '@/types/graph';
import { createContext, useMemo } from 'react';
import { useGraphMeta } from './GraphMetaContext';
import { useGraphRegistry } from './GraphRegistryContext';
import { useGraphSelection } from './GraphSelectionContext';

export const GraphContext = createContext<GraphContextProperties | undefined>(
    undefined
);

export function useGraphProperties() {
    const graphMeta = useGraphMeta();
    const graphSelection = useGraphSelection();
    const registry = useGraphRegistry();

    return useMemo(
        () => ({
            directed: graphMeta.directed,
            setDirected: graphMeta.setDirected,
            nodes: {
                count: graphMeta.nodes.count,
                setCount: graphMeta.nodes.setCount,
                selected: graphSelection.nodes.selected,
                setSelected: graphSelection.nodes.setSelected,
            },
            edges: {
                count: graphMeta.edges.count,
                setCount: graphMeta.edges.setCount,
                selected: graphSelection.edges.selected,
                setSelected: graphSelection.edges.setSelected,
                edgeMode: graphMeta.edges.edgeMode,
                setEdgeMode: graphMeta.edges.setEdgeMode,
            },
            registry,
        }),
        [graphMeta, graphSelection, registry]
    );
}
