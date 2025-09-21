import type { LayoutType } from './layout';

export function isLayoutType(value: string): value is LayoutType {
    const validLayouts = [
        'null',
        'circle',
        'random',
        'grid',
        'concentric',
        'breadthfirst',
        'cose'
    ];

    return validLayouts.includes(value);
}
