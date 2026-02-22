import { DefaultEdgesData, DefaultNodesData } from '@/constants/graphDefaults';
import type { EdgeCurveStyle, EdgesData } from '@/types/edges';
import {
    isDefaultEdgeData,
    isEdgeArrowShape,
    isEdgeCurve,
    isEdgeLineStyle,
} from '@/types/edgesTypeGuards';
import type { NodesData } from '@/types/nodes';
import { isDefaultNodeData, isNodeShape } from '@/types/nodesTypeGuards';
import {
    type EdgeSingular,
    type NodeSingular,
    type StylesheetStyle,
} from 'cytoscape';

/**
 * Type guard to check if a graph instance has the default data initialized
 */
function hasDefaultData(cy: cytoscape.Core): boolean {
    return (
        cy.data('defaultNodesData') !== undefined &&
        cy.data('defaultEdgesData') !== undefined
    );
}

export function getDefaultNodesData(graph: cytoscape.Core): NodesData {
    const defaults: unknown = graph.data('defaultNodesData');
    return isDefaultNodeData(defaults) ? defaults : { ...DefaultNodesData };
}

export function setDefaultNodesData(
    graph: cytoscape.Core,
    data: Partial<NodesData>
): void {
    const defaults = getDefaultNodesData(graph);
    graph.data('defaultNodesData', { ...defaults, ...data });
}

export function getDefaultEdgesData(graph: cytoscape.Core): EdgesData {
    const defaults: unknown = graph.data('defaultEdgesData');
    return isDefaultEdgeData(defaults) ? defaults : { ...DefaultEdgesData };
}

export function setDefaultEdgesData(
    graph: cytoscape.Core,
    data: Partial<EdgesData>
): void {
    const defaults = getDefaultEdgesData(graph);
    graph.data('defaultEdgesData', { ...defaults, ...data });
}

export function getNodeShape(e: NodeSingular): cytoscape.Css.NodeShape {
    const shape: unknown = e.data('shape');
    if (isNodeShape(shape)) return shape;

    const graph = e.cy();
    if (hasDefaultData(graph)) {
        const defaults = getDefaultNodesData(graph);
        return defaults.shape;
    }

    return 'ellipse';
}

export function getEdgeLabel(e: EdgeSingular): string {
    const label: unknown = e.data('label');
    const graph = e.cy();

    let effectiveLabel = 'hidden';

    // 1. Try to use element data
    if (typeof label === 'string') {
        effectiveLabel = label;
    }
    // 2. Try to use default data
    else if (hasDefaultData(graph)) {
        const defaults = getDefaultEdgesData(graph);
        effectiveLabel = defaults.label;
    }

    if (effectiveLabel === 'hidden') return '';
    if (effectiveLabel === 'weight') return String(e.data('weight'));
    if (effectiveLabel === 'index') return String(e.data('index'));
    if (effectiveLabel === 'custom') {
        // TODO: implement custom label parsing with {propertyName} syntax
        return '';
    }

    return '';
}

export function getEdgeStyle(e: EdgeSingular): cytoscape.Css.LineStyle {
    const style: unknown = e.data('style');
    if (isEdgeLineStyle(style)) return style;

    const graph = e.cy();
    if (hasDefaultData(graph)) {
        const defaults = getDefaultEdgesData(graph);
        return defaults.style;
    }

    return 'solid';
}

export function getEdgeCurve(e: EdgeSingular): EdgeCurveStyle {
    const curve: unknown = e.data('curve');
    if (isEdgeCurve(curve)) return curve;

    const graph = e.cy();
    if (hasDefaultData(graph)) {
        const defaults = getDefaultEdgesData(graph);
        return defaults.curve;
    }

    return 'bezier';
}

export function getEdgeArrowShape(e: EdgeSingular): cytoscape.Css.ArrowShape {
    const shape: unknown = e.data('arrowShape');
    if (isEdgeArrowShape(shape)) return shape;

    const graph = e.cy();
    if (hasDefaultData(graph)) {
        const defaults = getDefaultEdgesData(graph);
        return defaults.arrowShape;
    }

    return 'triangle';
}

export function transformStylesheet(
    stylesheet: StylesheetStyle[],
    format: 'sheet' | 'json' = 'json'
): StylesheetStyle[] {
    const nodesPropertyMap = {
        shape: { toJson: 'data(shape)', toSheet: getNodeShape },
    };

    const edgesPropertyMap = {
        label: { toJson: 'data(label)', toSheet: getEdgeLabel },
        'line-style': { toJson: 'data(style)', toSheet: getEdgeStyle },
        'curve-style': { toJson: 'data(curve)', toSheet: getEdgeCurve },
        'target-arrow-shape': {
            toJson: 'data(arrowShape)',
            toSheet: getEdgeArrowShape,
        },
    };

    for (const styleBlock of stylesheet) {
        const css = styleBlock.style as Record<string, string>;

        for (const key of Object.keys(css)) {
            if (styleBlock.selector.includes('node') && key in nodesPropertyMap) {
                const nodeKey = key as keyof typeof nodesPropertyMap;
                (styleBlock.style as Record<string, unknown>)[key] =
                    format === 'json'
                        ? nodesPropertyMap[nodeKey].toJson
                        : nodesPropertyMap[nodeKey].toSheet;
            } else if (
                styleBlock.selector.includes('edge') &&
                key in edgesPropertyMap
            ) {
                const edgeKey = key as keyof typeof edgesPropertyMap;
                (styleBlock.style as Record<string, unknown>)[key] =
                    format === 'json'
                        ? edgesPropertyMap[edgeKey].toJson
                        : edgesPropertyMap[edgeKey].toSheet;
            }
        }
    }
    return stylesheet;
}
