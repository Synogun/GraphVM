export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center-center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type SettingsData = {
    ui: {
        toast: {
            duration: number;
            position: ToastPosition;
        };
    };
    graph: {
        arrangeOn: {
            addNode: boolean;
            addEdge: boolean;
            editNode: boolean;
            editEdge: boolean;
            import: boolean;
        };
        limits: {
            maxNodes: number;
            maxEdges: number;
        };
    };
};

export type SettingsContextProperties = {
    ui: {
        toast: SettingsData['ui']['toast'];
        setToast: (toast: SettingsData['ui']['toast']) => void;
    };
    graph: {
        arrangeOn: SettingsData['graph']['arrangeOn'];
        setArrangeOn: (arrangeOn: SettingsData['graph']['arrangeOn']) => void;
        limits: SettingsData['graph']['limits'];
        setLimits: (limits: SettingsData['graph']['limits']) => void;
    };
};
