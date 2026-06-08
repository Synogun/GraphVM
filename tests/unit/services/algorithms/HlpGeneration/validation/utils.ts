export function sortByCoordinates(a: number[], b: number[]): number {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return a[i] - b[i];
        }
    }
    return 0;
}

export type JSONData = {
    generating_set_combinations: number[][];
    generating_set: number[][];
    node_set_product: number[][];
    node_set: number[][];
    edge_set: number[][];
    edge_set_prime: number[][];
};

export function loadHlpValidation(
    key: keyof JSONData,
    filePath: string
): number[][] {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data: unknown = require(`./${filePath}.json`);
    return (data as JSONData)[key];
}
