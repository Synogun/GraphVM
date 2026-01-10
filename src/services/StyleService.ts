import type { StylesheetCSS } from 'cytoscape';
import { getEdgeArrowShape, getEdgeCurve, getEdgeStyle, getNodeShape } from './ConfigService';

/**
 *
 * I'M NOT PROUD OF THIS CODE, BUT IT WORKS FOR NOW.
 * DON'T JUDGE ME.
 *
 */

const propertyMap = {
    shape: {
        toPlain: 'data(shape)',
        toSheet: getNodeShape,
    },

    'line-style': {
        toPlain: 'data(style)',
        toSheet: getEdgeStyle,
    },

    'curve-style': {
        toPlain: 'data(curve)',
        toSheet: getEdgeCurve,
    },

    'target-arrow-shape': {
        toPlain: 'data(arrowShape)',
        toSheet: getEdgeArrowShape,
    },
};

export function sheetToPlain(stylesheet: StylesheetCSS[]): StylesheetCSS[] {
    const plainStylesheet = JSON.parse(JSON.stringify(stylesheet)) as StylesheetCSS[];

    for (const style of plainStylesheet) {
        //@ts-expect-error For some reason the object reaches with a .style but TS can't infer it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        for (const [key, value] of Object.entries(style.style)) {
            if (value !== 'fn' || !(key in propertyMap)) continue;

            const propKey = key as keyof typeof propertyMap;
            //@ts-expect-error For some reason the object reaches with a .style but TS can't infer it
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            style.style[propKey] = propertyMap[propKey].toPlain;
        }
    }
    return plainStylesheet;
}
