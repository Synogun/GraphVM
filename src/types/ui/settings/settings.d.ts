export type DaisyUITheme =
    | 'light'
    | 'dark'
    | 'cupcake'
    | 'bumblebee'
    | 'emerald'
    | 'corporate'
    | 'retro'
    | 'garden'
    | 'lofi'
    | 'pastel'
    | 'fantasy'
    | 'wireframe'
    | 'business'
    | 'lemonade'
    | 'winter'
    | 'sunset'
    | 'caramellatte'
    | 'silk'
    | 'synthwave'
    | 'cyberpunk'
    | 'valentine'
    | 'halloween'
    | 'forest'
    | 'aqua'
    | 'black'
    | 'luxury'
    | 'dracula'
    | 'cmyk'
    | 'autumn'
    | 'acid'
    | 'night'
    | 'coffee'
    | 'dim'
    | 'nord'
    | 'abyss';

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
    | 'addEdges'
    | 'arrangeGraph'
    | 'centerGraph'
    | 'toggleEdgeMode';

export type ShortcutMap = Record<ShortcutAction, string>;

export type SettingsData = {
    ui: {
        toast: {
            duration: number;
            position: ToastPosition;
        };
        disableElementsInfoPanel: boolean;
        theme: DaisyUITheme;
    };
    graph: {
        arrangeOn: {
            addNode: boolean;
            addEdge: boolean;
            editNode: boolean;
            editEdge: boolean;
            import: boolean;
            layoutChange: boolean;
            tabChange: boolean;
        };
        limits: {
            maxNodes: number;
            maxEdges: number;
        };
        defaultPaddingOnActions: number;
    };
    shortcuts: ShortcutMap;
};

export type GraphLimits = SettingsData['graph']['limits'];

export type SettingsContextProperties = {
    ui: {
        toast: SettingsData['ui']['toast'];
        setToast: (toast: SettingsData['ui']['toast']) => void;
        disableElementsInfoPanel: SettingsData['ui']['disableElementsInfoPanel'];
        setDisableElementsInfoPanel: (value: boolean) => void;
        theme: SettingsData['ui']['theme'];
        setTheme: (theme: SettingsData['ui']['theme']) => void;
    };
    graph: {
        arrangeOn: SettingsData['graph']['arrangeOn'];
        setArrangeOn: (arrangeOn: SettingsData['graph']['arrangeOn']) => void;
        limits: SettingsData['graph']['limits'];
        setLimits: (limits: SettingsData['graph']['limits']) => void;
        defaultPaddingOnActions: SettingsData['graph']['defaultPaddingOnActions'];
        setDefaultPaddingOnActions: (
            value: SettingsData['graph']['defaultPaddingOnActions']
        ) => void;
    };
    shortcuts: SettingsData['shortcuts'];
    setShortcuts: (shortcuts: SettingsData['shortcuts']) => void;
};
