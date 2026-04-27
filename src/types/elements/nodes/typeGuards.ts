import type cytoscape from 'cytoscape';
import type { NodesData } from '.';

export const ValidNodeShapes: cytoscape.Css.NodeShape[] = [
    'ellipse',
    'triangle',
    'round-triangle',
    'rectangle',
    'round-rectangle',
    'bottom-round-rectangle',
    'cut-rectangle',
    'barrel',
    'rhomboid',
    'diamond',
    'round-diamond',
    'pentagon',
    'round-pentagon',
    'hexagon',
    'round-hexagon',
    'concave-hexagon',
    'heptagon',
    'round-heptagon',
    'octagon',
    'round-octagon',
    'star',
    'tag',
    'round-tag',
    'vee',
    // 'polygon', // Complex shape // TODO: implement polygon points handling
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

    const candidate = data as Partial<NodesData>;

    const hasColor = typeof candidate.color === 'string';
    const hasLabel = typeof candidate.label === 'string';
    const hasId = typeof candidate.id === 'string';
    const hasShape = isNodeShape(candidate.shape);

    return [hasColor, hasLabel, hasId, hasShape].every(Boolean);
}
