import type cytoscape from 'cytoscape';

export const ValidNodeShapes: cytoscape.Css.NodeShape[] = [
    'ellipse',
    'triangle',
    'rectangle',
    'bottom-round-rectangle',
    'cut-rectangle',
    'barrel',
    'rhomboid',
    'diamond',
    'pentagon',
    'hexagon',
    'concave-hexagon',
    'heptagon',
    'octagon',
    'star',
    'tag',
    'vee',
    // 'polygon', // Complex shape // TODO: implement polygon points handling
    // 'round-rectangle', // TODO: Decide on round shapes handling
    // 'round-triangle',
    // 'round-diamond',
    // 'round-pentagon',
    // 'round-hexagon',
    // 'round-heptagon',
    // 'round-octagon',
    // 'round-tag',
    // 'right-rhomboid',
];

export function isNodeShape(value: unknown): value is cytoscape.Css.NodeShape {
    return typeof value === 'string' && ValidNodeShapes.includes(value as cytoscape.Css.NodeShape);
}
