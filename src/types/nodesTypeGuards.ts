import type cytoscape from 'cytoscape';
import type { NodesData } from './nodes';

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
    return (
        typeof value === 'string' && (ValidNodeShapes as string[]).includes(value)
    );
}

export function isDefaultNodeData(data: unknown): data is NodesData {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const requiredProperties = ['color', 'shape', 'label'];

    return requiredProperties.every((prop) => prop in data);
}
