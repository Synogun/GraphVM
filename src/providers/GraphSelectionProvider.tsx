import { type ElementsInfo } from '@/types';
import { GraphSelectionContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';

export function GraphSelectionProvider({
    children,
}: Readonly<GraphSelectionProviderProps>) {
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

    const [selectionInfo, setSelectionInfo] = useState<ElementsInfo>({
        group: 'none',
    });

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
            selectionInfo: {
                info: selectionInfo,
                setInfo: setSelectionInfo,
            },
        }),
        [selectedNodes, selectedEdges, selectionInfo]
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
