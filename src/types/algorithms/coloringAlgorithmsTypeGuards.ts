import type { ColoringAlgorithm } from './coloringAlgorithms';

export const ValidColoringAlgorithms: ColoringAlgorithm[] = [
    'misra-gries',
    'hlp-edge-coloring',
];

export function isColoringAlgorithm(value: unknown): value is ColoringAlgorithm {
    return (
        typeof value === 'string' &&
        (ValidColoringAlgorithms as string[]).includes(value)
    );
}
