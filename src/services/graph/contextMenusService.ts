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
import { AppIcons } from '@/components/common/AppIcons';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { IconType } from 'react-icons';
import { removeEdges, updateEdges } from './edgesService';
import { addGhost, removeAllGhosts, removeGhost } from './ghostService';
import { cloneNode, removeNodes } from './nodesService';

function menuItemContent(Icon: IconType, label: string): string {
    const iconHtml = renderToStaticMarkup(React.createElement(Icon, { size: 15 }));
    return `<span style="display:flex;align-items:center;gap:6px">${iconHtml}${label}</span>`;
}

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
            'bg-base-200 text-xs',
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
            id: 'runAlgorithm',
            content: menuItemContent(AppIcons.Algorithms, 'Run an Algorithm'),
            tooltipText: 'Open the algorithms panel to run an algorithm',
            selector: '',
            coreAsWell: true,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (_evt, context) => {
                context.openAlgorithmsModal?.();
            },
        },
        {
            id: 'removeSelectedElement',
            content: menuItemContent(AppIcons.DeleteElements, 'Remove selected elements'),
            tooltipText: 'Removes the selected elements',
            selector: '',
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
            content: menuItemContent(AppIcons.DeleteElements, 'Remove element'),
            tooltipText: 'Removes the element',
            selector: 'node, edge',
            coreAsWell: false,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                const target = evt.target as
                    | cytoscape.NodeSingular
                    | cytoscape.EdgeSingular;
                try {
                    if (target.data('isGhost')) {
                        removeGhost(evt.cy, target);
                    }

                    if (target.isNode()) {
                        removeNodes(evt.cy, target);
                    } else {
                        removeEdges(evt.cy, target);
                    }
                } finally {
                    context.syncAll(evt.cy);
                }
            },
        },
        {
            id: 'addGhostFromElement',
            content: menuItemContent(AppIcons.Ghost, 'Add Ghost from Element'),
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
            id: 'removeAllGhosts',
            content: menuItemContent(AppIcons.ClearAll, 'Remove All Ghosts'),
            tooltipText:
                'Removes all ghost nodes and their ghost edges from the graph',
            selector: '',
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
            content: menuItemContent(AppIcons.Copy, 'Clone Node'),
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
        {
            id: 'changeLabel',
            content: menuItemContent(AppIcons.Edit, 'Change Label'),
            tooltipText: 'Change the label of this element',
            selector: 'node, edge',
            coreAsWell: false,
            show: true,
            disabled: false,
            hasTrailingDivider: false,
            onClick: (evt, context) => {
                const target = evt.target as cytoscape.SingularElementArgument;

                if (target.isEdge()) {
                    const selectedEdges = evt.cy.$('edge:selected');
                    const edgesToUpdate =
                        selectedEdges.length > 0 && target.selected()
                            ? selectedEdges
                            : (target as cytoscape.EdgeCollection);

                    if (!target.selected()) {
                        evt.cy.$(':selected').unselect();
                        target.select();
                    }

                    const edgeIds = edgesToUpdate.map((e) => e.id());
                    updateEdges(evt.cy, edgeIds, 'labelStyle', 'custom');
                    context.openEdgeLabelModal?.();
                } else {
                    if (!target.selected()) {
                        evt.cy.$(':selected').unselect();
                        target.select();
                    }

                    context.openNodeLabelModal?.();
                }
                context.syncAll(evt.cy);
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
