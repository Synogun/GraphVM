import type { ToastType } from '.';

const ValidToastTypes: ToastType[] = ['info', 'success', 'warning', 'error'];

export function isValidToastType(type: unknown): type is ToastType {
    return typeof type === 'string' && (ValidToastTypes as string[]).includes(type);
}
