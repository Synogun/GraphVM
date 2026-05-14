import { DefaultNodesData } from '@/constants/graphDefaults';
import type { NodeContextProperties } from '@/types/elements/nodes';
import { create } from 'zustand';

type NodesStore = NodeContextProperties & {
    setColor: (color: string) => void;
    setShape: (shape: cytoscape.Css.NodeShape) => void;
};

export const useNodesStore = create<NodesStore>()((set) => ({
    color: DefaultNodesData.color,
    shape: DefaultNodesData.shape,
    setColor: (color) => {
        set({ color });
    },
    setShape: (shape) => {
        set({ shape });
    },
}));
