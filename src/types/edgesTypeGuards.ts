import type cytoscape from 'cytoscape';
import type { EdgeCurveStyle } from './edges';

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
    if (!value) return false;

    return typeof value === 'string' && ValidEdgeCurves.includes(value as EdgeCurveStyle);
}

export const ValidEdgeLineStyles: cytoscape.Css.LineStyle[] = [
    'solid',
    'dotted',
    'dashed',
    'double',
];

export function isEdgeLineStyle(value: unknown): value is cytoscape.Css.LineStyle {
    return (
        typeof value === 'string' && ValidEdgeLineStyles.includes(value as cytoscape.Css.LineStyle)
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

export function isEdgeArrowShape(value: unknown): value is cytoscape.Css.ArrowShape {
    return (
        typeof value === 'string' &&
        ValidEdgeArrowShapes.includes(value as cytoscape.Css.ArrowShape)
    );
}

export const ValidEdgeLabelStyle = ['hidden', 'weight', 'index'];
