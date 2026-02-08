export const DefaultLayoutOptions = {
    name: 'circle',

    animate: true,
    animationDuration: 500,
    animationEasing: 'ease-in-out',

    fit: true,
    spacingFactor: 1.5,

    radius: 100,

    rows: 3,
    cols: 3,
    condensed: true,

    minNodeSpacing: 10,
};

export const DefaultGridLayoutOptions = {
    ...DefaultLayoutOptions,
    name: 'grid',

    rows: 3,
    cols: 3,
    condensed: true,
};

export const DefaultCircleLayoutOptions = {
    ...DefaultLayoutOptions,
    name: 'circle',

    radius: 100,
};

export const DefaultCoseLayoutOptions = {
    ...DefaultLayoutOptions,
    name: 'cose',

    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: true,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0,
};
