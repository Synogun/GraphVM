/**
 * Transforms a hyphen-separated string (kebab-case) into a human-readable title-cased string.
 *
 * This function splits the input string by hyphens, capitalizes the first letter
 * of each segment, and joins them back together with spaces.
 *
 * @param property - The property name string to parse (e.g., "my-property-name").
 * @returns A formatted string where each word is capitalized and separated by spaces (e.g., "My Property Name").
 */
export function parseKebabCase(property: string): string {
    return property
        .split('-')
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
