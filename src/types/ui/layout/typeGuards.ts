import type { LayoutType } from '.';

export const ValidGraphLayouts: LayoutType[] = [
    'circle',
    'grid',
    'concentric',
    'breadthfirst',
    'fcose',
    'preset',
    'random',
];

export function isLayoutType(value: unknown): value is LayoutType {
    return (
        typeof value === 'string' && (ValidGraphLayouts as string[]).includes(value)
    );
}

export function isLayoutOptions(value: unknown): value is cytoscape.LayoutOptions {
    return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        typeof value.name === 'string' &&
        (ValidGraphLayouts as string[]).includes(value.name)
    );
}
