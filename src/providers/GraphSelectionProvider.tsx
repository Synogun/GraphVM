import { GraphSelectionContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';

export function GraphSelectionProvider({ children }: GraphSelectionProviderProps) {
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

    const value = useMemo(
        () => ({
            nodes: {
                selected: selectedNodes,
                setSelected: setSelectedNodes,
            },
            edges: {
                selected: selectedEdges,
                setSelected: setSelectedEdges,
            },
        }),
        [selectedNodes, selectedEdges]
    );

    return (
        <GraphSelectionContext.Provider value={value}>
            {children}
        </GraphSelectionContext.Provider>
    );
}

type GraphSelectionProviderProps = {
    children: ReactNode;
};
