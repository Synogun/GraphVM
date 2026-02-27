import type { SettingsContextProperties } from '@/types/settings';

export const DefaultSettingsData: SettingsContextProperties = {
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
    },
};
