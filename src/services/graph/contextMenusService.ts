import { Logger } from '@/config/logger';
import { type ParsedError, parseError } from '@/config/parsedError';
import { ensureContextMenusExtension } from '@/lazy/cytoscapeExtensions';
import type {
    BindContextMenuOptions,
    ContextMenuActionDefinition,
    ContextMenuActionDependencies,
} from '@/types';
import type cytoscape from 'cytoscape';
import type contextMenus from 'cytoscape-context-menus';
import { removeEdges } from './edgesService';
import { addGhost, removeAllGhosts, removeGhost } from './ghostService';
import { cloneNode, removeNodes } from './nodesService';

const logger = Logger.createContextLogger('ContextMenuDefinitions');

export async function bindContextMenu(
    cy: cytoscape.Core,
    options: BindContextMenuOptions
): Promise<() => void> {
    await ensureContextMenusExtension();

    if (options.shouldAbort?.()) {
        return () => {
            /* no cleanup needed since we didn't bind anything */
        };
    }

    const actions = createContextMenuActionDefinitions();

    const menuOptions: contextMenus.MenuOptions = {
        evtType: 'cxttap',
        menuItems: actions.map((action) => ({
            id: action.id,
            content: action.content,
            tooltipText: action.tooltipText,
            selector: action.selector,
            coreAsWell: action.coreAsWell ?? false,
            show: action.show ?? true,
            disabled: action.disabled ?? false,
            hasTrailingDivider: action.hasTrailingDivider ?? false,
            onClickFunction: (evt: cytoscape.EventObject) => {
                runContextMenuAction(action, evt, {
                    ...options,
                    graphLimits: options.graphLimits?.current,
                });
            },
        })),
        menuItemClasses: [
            'w-full',
            'px-2 py-1',
            'hover:bg-base-300 hover:shadow-lg',
        ],
        contextMenuClasses: [
            'bg-base-200 text-md',
            'rounded shadow-lg',
            'border border-accent hover:border-accent-focus',
        ],
    };

    const contextMenu = cy.contextMenus(menuOptions);

    return () => {
        contextMenu.destroy();
    };
}

export function mountContextMenu(
    cy: cytoscape.Core,
    options: BindContextMenuOptions & {
        onBindError?: (error: ParsedError) => void;
    }
): () => void {
    let disposed = false;
    let cleanupContextMenu = () => {
        /* no cleanup needed for now */
    };

    void bindContextMenu(cy, {
        ...options,
        shouldAbort: () => {
            if (disposed) {
                return true;
            }

            return options.shouldAbort?.() ?? false;
        },
    })
        .then((cleanup) => {
            if (disposed) {
                cleanup();
                return;
            }

            cleanupContextMenu = cleanup;
        })
        .catch((error: unknown) => {
            options.onBindError?.(parseError(error));
        });

    return () => {
        disposed = true;
        cleanupContextMenu();
    };
}

export function createContextMenuActionDefinitions(): ContextMenuActionDefinition[] {
    return [
        {
            id: 'removeSelectedElement',
            content: 'Remove selected elements',
            tooltipText: 'Removes the selected elements',
            selector: 'node, edge',
            coreAsWell: true,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                const selectedNodes = evt.cy.$('node:selected');
                const selectedEdges = evt.cy.$('edge:selected');
                const hasSelection =
                    selectedNodes.length > 0 || selectedEdges.length > 0;

                try {
                    if (selectedEdges.length > 0) {
                        removeEdges(evt.cy, selectedEdges);
                    }

                    if (selectedNodes.length > 0) {
                        removeNodes(evt.cy, selectedNodes);
                    }
                } finally {
                    if (hasSelection) {
                        context.syncAll(evt.cy);
                    }
                }
            },
        },
        {
            id: 'removeElement',
            content: 'Remove element',
            tooltipText: 'Removes the element',
            selector: 'node, edge',
            coreAsWell: false,
            show: false,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                const target = evt.target as cytoscape.Collection;
                try {
                    target.remove();
                } finally {
                    context.syncAll(evt.cy);
                }
            },
        },
        {
            id: 'addGhostFromElement',
            content: 'Add Ghost from Element',
            tooltipText:
                'Adds a ghost node based on the element, check for more details in Help modal',
            selector: 'node[!isGhost]',
            coreAsWell: false,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                const target = evt.target as cytoscape.NodeSingular;
                try {
                    addGhost(evt.cy, target, context.graphLimits);
                } finally {
                    context.syncAll(evt.cy);
                }
            },
        },
        {
            id: 'removeGhost',
            content: 'Remove Ghost',
            tooltipText: 'Removes this ghost node and its ghost edges',
            selector: 'node[?isGhost]',
            coreAsWell: false,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                const target = evt.target as cytoscape.NodeSingular;
                try {
                    removeGhost(evt.cy, target);
                } finally {
                    context.syncAll(evt.cy);
                }
            },
        },
        {
            id: 'removeAllGhosts',
            content: 'Remove All Ghosts',
            tooltipText:
                'Removes all ghost nodes and their ghost edges from the graph',
            selector: 'node, edge',
            coreAsWell: true,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                try {
                    removeAllGhosts(evt.cy);
                } finally {
                    context.syncAll(evt.cy);
                }
            },
        },
        {
            id: 'cloneNode',
            content: 'Clone Node',
            tooltipText:
                'Clones the selected node, check for more details in Help modal',
            selector: 'node',
            coreAsWell: false,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                const target = evt.target as cytoscape.NodeSingular;
                try {
                    cloneNode(evt.cy, target, context.graphLimits);
                } finally {
                    context.syncAll(evt.cy);
                }
            },
        },
    ];
}

export function runContextMenuAction(
    action: ContextMenuActionDefinition,
    evt: cytoscape.EventObject,
    deps: ContextMenuActionDependencies
): void {
    try {
        action.onClick(evt, deps);
    } catch (error: unknown) {
        const parsedError = parseError(error, { actionId: action.id });

        logger.error(`Context menu action failed: ${action.id}`, parsedError);
        deps.onError?.(parsedError.message);
    }
}
