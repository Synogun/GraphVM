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

export type SettingsContextProperties = {
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
    };
};
