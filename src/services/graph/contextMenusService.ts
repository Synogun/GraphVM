import type { GraphLimits } from '@/types/settings';
import type contextMenus from 'cytoscape-context-menus';
import { removeEdges } from './edgesService';
import { addGhostFromNode, cloneNode, removeNodes } from './nodesService';

export function bindContextMenu(
    cy: cytoscape.Core,
    syncAll: (core: cytoscape.Core) => void,
    graphLimits?: GraphLimits
): () => void {
    const menuOptions: contextMenus.MenuOptions = {
        evtType: 'cxttap',
        menuItems: [
            {
                id: 'removeSelectedElement', // ID of menu item
                content: 'Remove selected elements', // Display content of menu item
                tooltipText: 'Removes the selected elements', // Tooltip text for menu item
                // image: { src: 'remove.svg', width: 12, height: 12, x: 6, y: 4 }, // menu icon
                // Filters the elements to have this menu item on cxttap
                // If the selector is not truthy no elements will have this menu item on cxttap
                selector: 'node, edge',
                onClickFunction: function (evt: cytoscape.EventObject) {
                    const selectedNodes = evt.cy.$('node:selected');
                    const selectedNodesLength = selectedNodes.length;
                    const selectedEdges = evt.cy.$('edge:selected');
                    const selectedEdgesLength = selectedEdges.length;

                    if (selectedNodesLength === 0 && selectedEdgesLength === 0) {
                        return;
                    }

                    if (selectedEdgesLength > 0) {
                        removeEdges(evt.cy, selectedEdges);
                    }

                    if (selectedNodesLength > 0) {
                        removeNodes(evt.cy, selectedNodes);
                    }

                    if (selectedNodesLength > 0 || selectedEdgesLength > 0) {
                        syncAll(evt.cy);
                    }
                },
                disabled: false, // Whether the item will be created as disabled
                show: true, // Whether the item will be shown or not
                hasTrailingDivider: false, // Whether the item will have a trailing divider
                coreAsWell: true, // Whether core instance have this item on cxttap
                // submenu: [], // Shows the listed menuItems as a submenu for this item. An item must have either submenu or onClickFunction or both.
            },
            {
                id: 'removeElement',
                content: 'Remove element',
                tooltipText: 'Removes the element',
                // image: { src: 'remove.svg', width: 12, height: 12, x: 6, y: 4 },
                selector: 'node, edge',
                onClickFunction: function (evt: cytoscape.EventObject) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    evt.target.remove();
                    syncAll(evt.cy);
                },
                disabled: false,
                show: false,
                hasTrailingDivider: false,
                coreAsWell: false,
            },
            {
                id: 'addGhostFromElement',
                content: 'Add Ghost from Element',
                tooltipText:
                    'Adds a ghost node based on the element, ' +
                    'check for more details in Help modal',
                selector: 'node[!isGhost]',
                onClickFunction: function (evt: cytoscape.EventObject) {
                    const target = evt.target as cytoscape.NodeSingular;

                    if (target.data('isGhost')) {
                        return;
                    }

                    const graph = evt.cy;

                    addGhostFromNode(graph, target, graphLimits);
                    syncAll(graph);
                },
                disabled: false,
                show: true,
                hasTrailingDivider: false,
                coreAsWell: false,
            },
            {
                id: 'cloneNode',
                content: 'Clone Node',
                tooltipText:
                    'Clones the selected node, ' +
                    'check for more details in Help modal',
                selector: 'node',
                onClickFunction: function (evt: cytoscape.EventObject) {
                    const target = evt.target as cytoscape.NodeSingular;
                    const graph = evt.cy;

                    cloneNode(graph, target, graphLimits);
                    syncAll(graph);
                },
                disabled: false,
                show: true,
                hasTrailingDivider: false,
                coreAsWell: false,
            },

            // TODO: Add options to context menu:
            // Hide elements
            // Restore hidden edge(s) (dynamic with submenu and hidden edges as options)
        ],
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
