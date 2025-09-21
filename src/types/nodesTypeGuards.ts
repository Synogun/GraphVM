import type cytoscape from 'cytoscape';

export function isNodeShape(value: unknown): value is cytoscape.Css.NodeShape {
    const validShapes: cytoscape.Css.NodeShape[] = [
        'rectangle',
        'roundrectangle',
        'ellipse',
        'triangle',
        'pentagon',
        'hexagon',
        'heptagon',
        'octagon',
        'star',
        'barrel',
        'diamond',
        'vee',
        'rhomboid',
        'polygon',
        'tag',
        'round-rectangle',
        'round-triangle',
        'round-diamond',
        'round-pentagon',
        'round-hexagon',
        'round-heptagon',
        'round-octagon',
        'round-tag',
        'cut-rectangle',
        'bottom-round-rectangle',
        'concave-hexagon'
    ];
    return typeof value === 'string' && validShapes.includes(value as cytoscape.Css.NodeShape);
}
