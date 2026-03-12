import type { SettingsData } from '@/types/settings';

export const DefaultSettingsData: SettingsData = {
    ui: {
        toast: {
            duration: 3000,
            position: 'bottom-center',
        },
    },
    graph: {
        arrangeOn: {
            addNode: true,
            addEdge: true,
            editNode: false,
            editEdge: false,
            import: true,
        },
        limits: {
            maxNodes: 2000,
            maxEdges: 4000,
        },
    },
    shortcuts: {
        deleteSelected: 'Delete',
        deselectAll: 'Escape',
        selectAll: 'Ctrl+A',
        saveWorkspace: 'Ctrl+S',
        newGraph: 'Ctrl+Shift+N',
        addNode: 'Ctrl+N',
        addEdges: 'Ctrl+E',
        arrangeGraph: 'Shift+A',
        centerGraph: 'Ctrl+C',
        toggleEdgeMode: 'M',
    },
};
