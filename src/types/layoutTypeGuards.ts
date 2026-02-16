import type { LayoutType } from './layout';

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
