import type { ToastPosition } from './settings';

const ValidToastPositions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'center-left',
    'center-center',
    'center-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];

export function isValidToastPosition(position: unknown): position is ToastPosition {
    return (
        typeof position === 'string' &&
        (ValidToastPositions as string[]).includes(position)
    );
}
