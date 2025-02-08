import $ from 'jquery';
import cy from 'cytoscape';

/**
 * Checks if the current environment is development or production.
 *
 * This function determines if the current URL starts with "https://synogun.github.io/gViewJS/".
 * If it does, it returns false indicating a production environment.
 * Otherwise, it modifies the DOM to indicate a development environment and returns true.
 *
 * @returns {boolean} - Returns true if the environment is development, false if it is production.
 */
function checkDevelopment(): boolean {
    if (window.location.href.startsWith('https://synogun.github.io/GraphVM/')) {
        return false;
    }

    $('#is-dev').removeClass('d-none');
    $('title').text('Graph - Development');
    return true;
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
function findPropertyValueMode(property: string, eles: cy.EdgeCollection | cy.NodeCollection): string | null {
    if (!eles.length) { return null; } // return null if the collection is empty
    if (!eles[0].data(property)) { return null; } // return null if the property does not exist

    const count: Record<string, number> = {};
    const mode = { propValue: '', frequency: 0 };

    // count the occurrences of each property value
    for (const ele of eles) {
        const value = String(ele.data(property));

        // initialize the count for the current value if it does not exist
        if (!Object.keys(count).includes(value)) { count[value] = 0; }

        count[value]++;

        // update the mode if the current value has a higher frequency
        if (count[value] > mode.frequency) {
            mode.propValue = value;
            mode.frequency = count[value];
        }
    }

    return mode.propValue;
}

// +---------------------------------------------------------------------------+

export {
    checkDevelopment,
    findPropertyValueMode,
};
