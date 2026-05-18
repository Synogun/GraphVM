import { isBoolean, isPositiveInteger, isRecord } from '@/types/typeGuards';
import type { DaisyUITheme, SettingsData, ShortcutAction, ToastPosition } from '.';

export const ValidDaisyUIThemes: DaisyUITheme[] = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'retro',
    'garden', 'lofi', 'pastel', 'fantasy', 'wireframe', 'business', 'lemonade',
    'winter', 'sunset', 'caramellatte', 'silk', 'synthwave', 'cyberpunk',
    'valentine', 'halloween', 'forest', 'aqua', 'black', 'luxury', 'dracula',
    'cmyk', 'autumn', 'acid', 'night', 'coffee', 'dim', 'nord', 'abyss',
];

export function isValidDaisyUITheme(value: unknown): value is DaisyUITheme {
    return typeof value === 'string' && (ValidDaisyUIThemes as string[]).includes(value);
}

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

const ValidShortcutActions: ShortcutAction[] = [
    'deleteSelected',
    'deselectAll',
    'selectAll',
    'newGraph',
    'addNode',
    'addEdges',
    'arrangeGraph',
    'centerGraph',
    'toggleEdgeMode',
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
    const defaultPaddingOnActions = graph.defaultPaddingOnActions;
    const shortcuts = value.shortcuts;

    if (
        !isRecord(toast) ||
        !isRecord(arrangeOn) ||
        !isRecord(limits) ||
        !isRecord(shortcuts)
    ) {
        return false;
    }

    const isToastValid =
        isPositiveInteger(toast.duration) && isValidToastPosition(toast.position);

    const isThemeValid = isValidDaisyUITheme(ui.theme);

    const isArrangeOnValid =
        isBoolean(arrangeOn.addNode) &&
        isBoolean(arrangeOn.addEdge) &&
        isBoolean(arrangeOn.editNode) &&
        isBoolean(arrangeOn.editEdge) &&
        isBoolean(arrangeOn.import);

    const isLimitsValid =
        isPositiveInteger(limits.maxNodes) && isPositiveInteger(limits.maxEdges);

    const isPaddingValid = isPositiveInteger(defaultPaddingOnActions);

    const isShortcutsValid = ValidShortcutActions.every((action) => {
        const shortcut = shortcuts[action];
        return typeof shortcut === 'string' && shortcut.trim().length > 0;
    });

    return (
        isToastValid &&
        isThemeValid &&
        isArrangeOnValid &&
        isLimitsValid &&
        isPaddingValid &&
        isShortcutsValid
    );
}
