import type cytoscape from 'cytoscape';
import { ConfigService } from './services/ConfigService';

/**
 * Determines if the current environment is development.
 *
 * Checks if the current window location does not include 'synogun.github.io',
 * which is used to identify the production environment.
 *
 * @returns {boolean} `true` if running in development mode, otherwise `false`.
 */
export function isDev(): boolean {
    return import.meta.env.DEV;
}

/**
 * Finds the mode (most frequent value) of a specified property within a collection of Cytoscape elements.
 *
 * This function iterates over a collection of Cytoscape edges or nodes and counts the occurrences of each value
 * for the specified property. It then determines the most frequent value (mode) of that property.
 *
 * @param property - The property name to find the mode for.
 * @param eles - A collection of Cytoscape edges or nodes.
 * @returns {string | null} - The mode of the property as a string, or null if the collection is empty or the property does not exist.
 */
export function findPropertyValueMode(
    eles: cytoscape.EdgeCollection | cytoscape.NodeCollection,
    property: string
): string | null {
    if (!eles.length) {
        return null;
    } // return null if the collection is empty
    if (!eles[0].data(property)) {
        return null;
    } // return null if the property does not exist

    const count: Record<string, number> = {};
    const mode = { propValue: '', frequency: 0 };

    // count the occurrences of each property value
    for (const ele of eles) {
        const value = String(ele.data(property));

        // initialize the count for the current value if it does not exist
        if (!Object.keys(count).includes(value)) {
            count[value] = 0;
        }

        count[value]++;

        // update the mode if the current value has a higher frequency
        if (count[value] > mode.frequency) {
            mode.propValue = value;
            mode.frequency = count[value];
        }
    }

    return mode.propValue;
}

type CyElementsDefinition = cytoscape.ElementDefinition[] | cytoscape.ElementsDefinition;
export function assignDefaultElementData(
    elements: CyElementsDefinition & {}
): CyElementsDefinition {
    const configService = ConfigService.getInstance();
    const defaultNodeData = configService.getNodesData();
    const defaultEdgeData = configService.getEdgesData();

    if (Array.isArray(elements)) {
        return elements.map((el) => {
            if (el.group === 'nodes') {
                el.data = {
                    ...defaultNodeData,
                    ...el.data,
                };
            } else {
                el.data = {
                    ...defaultEdgeData,
                    ...el.data,
                };
            }
            return el;
        });
    } else {
        elements.nodes = elements.nodes.map((el) => {
            el.data = {
                ...defaultNodeData,
                ...el.data,
            };
            return el;
        });

        elements.edges = elements.edges.map((el) => {
            el.data = {
                ...defaultEdgeData,
                ...el.data,
            };
            return el;
        });

        return elements;
    }
}

export function makeBlobAndDownload(
    dataStr: string,
    fileName: string,
    fileType: string,
    exportFormat?: string
): void {
    if (fileType === 'png' || fileType === 'jpg') {
        const a = document.createElement('a');

        a.href = dataStr;
        a.download = `${fileName}.${exportFormat ?? ''}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    const blob = new Blob([dataStr], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
