import type cytoscape from 'cytoscape';
import type { EdgeCurveStyle, EdgeLabelStyle } from './edges';

export const ValidEdgeCurves: EdgeCurveStyle[] = [
    'bezier',
    'unbundled-bezier',
    'segments',
    'taxi',
    'round-taxi',
    'round-segments',
    'straight',
    'haystack',
];

export function isEdgeCurve(value: unknown): value is EdgeCurveStyle {
    return (
        typeof value === 'string' &&
        (ValidEdgeCurves as string[]).includes(value)
    );
}

export const ValidEdgeLineStyles: cytoscape.Css.LineStyle[] = [
    'solid',
    'dotted',
    'dashed',
];

export function isEdgeLineStyle(
    value: unknown
): value is cytoscape.Css.LineStyle {
    return (
        typeof value === 'string' &&
        (ValidEdgeLineStyles as string[]).includes(value)
    );
}

export const ValidEdgeArrowShapes: cytoscape.Css.ArrowShape[] = [
    'tee',
    'vee',
    'triangle',
    'triangle-tee',
    'circle-triangle',
    'triangle-cross',
    'triangle-backcurve',
    'square',
    'circle',
    'diamond',
    'chevron',
    'none',
];

export function isEdgeArrowShape(
    value: unknown
): value is cytoscape.Css.ArrowShape {
    return (
        typeof value === 'string' &&
        (ValidEdgeArrowShapes as string[]).includes(value)
    );
}

export const ValidEdgeLabelStyle: EdgeLabelStyle[] = [
    'hidden',
    'weight',
    'index',
    // 'custom'
];

export function isEdgeLabelStyle(value: unknown): value is EdgeLabelStyle {
    return (
        typeof value === 'string' &&
        (ValidEdgeLabelStyle as string[]).includes(value)
    );
}
