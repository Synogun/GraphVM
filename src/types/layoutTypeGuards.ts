import { isDev } from '@/utils/general';
import type { LayoutType } from './layout';

export const ValidGraphLayouts = [
    'circle',
    'grid',
    'concentric',
    'breadthfirst',
    'fcose',
    'preset',
    'random',
    ...(isDev() ? ['null'] : []),
];

export function isLayoutType(value: string): value is LayoutType {
    return ValidGraphLayouts.includes(value);
}
