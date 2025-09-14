import type cy from 'cytoscape';


/**
 * Determines if the current environment is development.
 *
 * Checks if the current window location does not include 'synogun.github.io',
 * which is used to identify the production environment.
 *
 * @returns {boolean} `true` if running in development mode, otherwise `false`.
 */
function isDev(): boolean {
    return !window.location.href.includes('synogun.github.io');
}

function setupLiveReload(): boolean {
    if (!isDev()) {
        return false;
    }

    new EventSource('/esbuild').addEventListener('change', () => {
        location.reload();
    });

    const title = document.getElementById('page-title');
    if (title) {
        title.innerText = 'GraphVM - Development';
    }

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
function findPropertyValueMode(eles: cy.EdgeCollection | cy.NodeCollection, property: string): string | null {
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

/**
 * Determines whether the current device is a mobile device.
 *
 * This function checks the `navigator.userAgent` string for patterns
 * that match common mobile device identifiers such as "Mobi", "Android",
 * "iPhone", "iPad", and "iPod".
 *
 * @returns {boolean} `true` if the current device is a mobile device, otherwise `false`.
 */
function isMobileDevice(): boolean {
    return typeof navigator.userAgent === 'string' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// +---------------------------------------------------------------------------+

export {
    findPropertyValueMode,
    isDev,
    isMobileDevice,
    setupLiveReload
};

