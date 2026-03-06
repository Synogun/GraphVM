export function isString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

export function isPositiveInteger(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export function isArrayOfStrings(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(isString);
}
