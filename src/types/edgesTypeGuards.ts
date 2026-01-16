import type cytoscape from 'cytoscape';
import type { EdgeCurveStyle } from './edges';

export function isEdgeCurve(value: unknown): value is EdgeCurveStyle {
    if (!value) return false;

    const validCurves: EdgeCurveStyle[] = [
        'bezier',
        'unbundled-bezier',
        'segments',
        'taxi',
        'straight',
        'haystack',
    ];
    return typeof value === 'string' && validCurves.includes(value as EdgeCurveStyle);
}

export function isEdgeStyle(value: unknown): value is cytoscape.Css.LineStyle {
    const validStyles: cytoscape.Css.LineStyle[] = ['solid', 'dotted', 'dashed', 'double'];
    return typeof value === 'string' && validStyles.includes(value as cytoscape.Css.LineStyle);
}

export function isEdgeArrowShape(value: unknown): value is cytoscape.Css.ArrowShape {
    const validShapes: cytoscape.Css.ArrowShape[] = [
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
    return typeof value === 'string' && validShapes.includes(value as cytoscape.Css.ArrowShape);
}
