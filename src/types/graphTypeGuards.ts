import type { StylesheetCSS, StylesheetStyle } from 'cytoscape';

export function isStylesheetCSSArray(value: unknown): value is StylesheetCSS[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item: unknown) =>
                typeof item === 'object' &&
                item !== null &&
                'selector' in item &&
                'css' in item
        )
    );
}

export function isStylesheetStyleArray(
    value: unknown
): value is StylesheetStyle[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item: unknown) =>
                typeof item === 'object' &&
                item !== null &&
                'selector' in item &&
                'style' in item
        )
    );
}

export function isCytoscapeOptions(
    value: unknown
): value is cytoscape.CytoscapeOptions {
    return (
        typeof value === 'object' &&
        value !== null &&
        'elements' in value &&
        'style' in value
    );
}
