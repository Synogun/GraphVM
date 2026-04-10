/**
 * Transforms a hyphen-separated string (kebab-case) into a human-readable title-cased string.
 *
 * This function splits the input string by hyphens, capitalizes the first letter
 * of each segment, and joins them back together with spaces.
 *
 * @param str - The property name string to parse (e.g., "my-property-name").
 * @returns A formatted string where each word is capitalized and separated by spaces (e.g., "My Property Name").
 */
export function parseKebabCase(str: string): string {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Transforms a camelCase string into a human-readable title-cased string.
 *
 * This function uses a regular expression to insert spaces before uppercase letters,
 * then capitalizes the first letter of each resulting word.
 *
 * @param str - The camelCase string to parse (e.g., "myPropertyName").
 * @returns A formatted string where each word is capitalized and separated by spaces (e.g., "My Property Name").
 */
export function parseCamelCase(str: string): string {
    return str
        .replaceAll(/([A-Z])/g, ' $1')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Finds the mode (most frequent value) of a specified property within a collection of Cytoscape elements.
 *
 * This function iterates over a collection of Cytoscape edges or nodes and counts the occurrences of each value
 * for the specified property. It then determines the most frequent value (mode) of that property.
 *
 * @param property - The property name to find the mode for.
 * @param eles - A collection of Cytoscape edges or nodes.
 * @param includesGhosts - A boolean indicating whether to include elements marked as "ghosts" in the calculation. Defaults to false.
 * @returns {string | null} - The mode of the property as a string, or null if the collection is empty or the property does not exist.
 */
export function findPropertyValueMode(
    eles: cytoscape.EdgeCollection | cytoscape.NodeCollection,
    property: string,
    includesGhosts = false
): string | null {
    if (!eles.length) {
        return null;
    }

    const count: Record<string, number> = {};
    const mode: { propValue: string | null; frequency: number } = {
        propValue: null,
        frequency: 0,
    };

    for (const ele of eles) {
        if (!includesGhosts && ele.data('isGhost')) {
            continue;
        }

        const value = String(ele.data(property));

        if (!Object.keys(count).includes(value)) {
            count[value] = 0;
        }

        count[value]++;

        if (count[value] > mode.frequency) {
            mode.propValue = value;
            mode.frequency = count[value];
        }
    }

    return mode.propValue;
}
