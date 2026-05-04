import type { GraphLimits } from '@/types/ui/settings';

export type BindContextMenuOptions = {
    syncAll: (core: cytoscape.Core) => void;
    graphLimits?: { readonly current: GraphLimits | undefined };
    onError?: (message: string) => void;
    shouldAbort?: () => boolean;
};

export type ContextMenuActionDependencies = {
    syncAll: (core: cytoscape.Core) => void;
    graphLimits?: GraphLimits;
    onError?: (message: string) => void;
};

export type ContextMenuActionDefinition = {
    id: string;
    content: string;
    tooltipText: string;
    selector: string;
    coreAsWell?: boolean;
    show?: boolean;
    disabled?: boolean;
    hasTrailingDivider?: boolean;
    onClick: (
        evt: cytoscape.EventObject,
        deps: ContextMenuActionDependencies
    ) => void;
};
