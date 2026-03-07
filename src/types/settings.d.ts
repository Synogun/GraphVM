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

export type ShortcutAction =
    | 'deleteSelected'
    | 'deselectAll'
    | 'selectAll'
    | 'newGraph'
    | 'addNode'
    | 'addEdges';

export type ShortcutMap = Record<ShortcutAction, string>;

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
    shortcuts: ShortcutMap;
};

export type GraphLimits = SettingsData['graph']['limits'];

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
    shortcuts: SettingsData['shortcuts'];
    setShortcuts: (shortcuts: SettingsData['shortcuts']) => void;
};
