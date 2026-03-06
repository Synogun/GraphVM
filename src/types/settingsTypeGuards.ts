import type { SettingsData, ToastPosition } from './settings';
import { isBoolean, isPositiveInteger, isRecord } from './typeGuards';

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

export function isSettingsData(value: unknown): value is SettingsData {
    if (!isRecord(value)) {
        return false;
    }

    const ui = value.ui;
    const graph = value.graph;

    if (!isRecord(ui) || !isRecord(graph)) {
        return false;
    }

    const toast = ui.toast;
    const arrangeOn = graph.arrangeOn;
    const limits = graph.limits;

    if (!isRecord(toast) || !isRecord(arrangeOn) || !isRecord(limits)) {
        return false;
    }

    const isToastValid =
        isPositiveInteger(toast.duration) && isValidToastPosition(toast.position);

    const isArrangeOnValid =
        isBoolean(arrangeOn.addNode) &&
        isBoolean(arrangeOn.addEdge) &&
        isBoolean(arrangeOn.editNode) &&
        isBoolean(arrangeOn.editEdge) &&
        isBoolean(arrangeOn.import);

    const isLimitsValid =
        isPositiveInteger(limits.maxNodes) && isPositiveInteger(limits.maxEdges);

    return isToastValid && isArrangeOnValid && isLimitsValid;
}
