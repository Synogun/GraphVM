import type { StylesheetCSS } from 'cytoscape';

export const isStylesheetCSSArray = (value: unknown): value is StylesheetCSS[] => {
    return (
        Array.isArray(value) &&
        value.every(
            (item: unknown) =>
                typeof item === 'object' && item !== null && 'selector' in item && 'style' in item
        )
    );
};
