import type { ElementsInfo } from '@/types';
import { create } from 'zustand';

type GraphSelectionStore = {
    selectedNodes: string[];
    selectedEdges: string[];
    selectionInfo: ElementsInfo;
    setSelectedNodes: (nodes: string[]) => void;
    setSelectedEdges: (edges: string[]) => void;
    setSelectionInfo: (info: ElementsInfo) => void;
};

export const useGraphSelectionStore = create<GraphSelectionStore>()((set) => ({
    selectedNodes: [],
    selectedEdges: [],
    selectionInfo: { group: 'none' },
    setSelectedNodes: (nodes) => {
        set({ selectedNodes: nodes });
    },
    setSelectedEdges: (edges) => {
        set({ selectedEdges: edges });
    },
    setSelectionInfo: (info) => {
        set({ selectionInfo: info });
    },
}));
