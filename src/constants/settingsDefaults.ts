import type { SettingsData } from '@/types/ui/settings';

export const DefaultSettingsData: SettingsData = {
    ui: {
        toast: {
            duration: 3000,
            position: 'bottom-center',
        },
        disableElementsInfoPanel: false,
        theme: 'dark',
    },
    graph: {
        arrangeOn: {
            addNode: true,
            addEdge: true,
            editNode: false,
            editEdge: false,
            import: true,
            layoutChange: true,
            tabChange: false,
        },
        limits: {
            maxNodes: 500,
            maxEdges: 1000,
        },
        defaultPaddingOnActions: 30,
    },
    shortcuts: {
        deleteSelected: 'Delete',
        deselectAll: 'Escape',
        selectAll: 'Ctrl+A',
        newGraph: 'Ctrl+Shift+N',
        addNode: 'N',
        addEdges: 'E',
        arrangeGraph: 'A',
        centerGraph: 'C',
        toggleEdgeMode: 'M',
    },
};
