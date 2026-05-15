import type { GenerationFamily } from '@/types/algorithms/generationAlgorithms';
import { create } from 'zustand';

type GraphMetaStore = {
    directed: boolean;
    families: GenerationFamily[];
    nodeCount: number;
    edgeCount: number;
    edgeMode: 'path' | 'complete';
    setDirected: (directed: boolean) => void;
    setFamilies: (families: GenerationFamily[]) => void;
    setNodeCount: (count: number) => void;
    setEdgeCount: (count: number) => void;
    setEdgeMode: (edgeMode: 'path' | 'complete') => void;
};

export const useGraphMetaStore = create<GraphMetaStore>()((set) => ({
    directed: false,
    families: [],
    nodeCount: 0,
    edgeCount: 0,
    edgeMode: 'path',
    setDirected: (directed) => {
        set((state) => ({
            directed,
            edgeMode: directed && state.edgeMode === 'complete' ? 'path' : state.edgeMode,
        }));
    },
    setFamilies: (families) => {
        set({ families });
    },
    setNodeCount: (nodeCount) => {
        set({ nodeCount });
    },
    setEdgeCount: (edgeCount) => {
        set({ edgeCount });
    },
    setEdgeMode: (edgeMode) => {
        set({ edgeMode });
    },
}));
