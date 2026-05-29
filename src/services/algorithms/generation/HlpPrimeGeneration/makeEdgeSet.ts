export function makeHlpEdgeSet(
    nodeSet: number[][],
    generatingSet: number[][],
    P: number
): number[][] {
    const edgeSet: number[][] = [];

    const indexMap = new Map<string, number>();
    for (let i = 0; i < nodeSet.length; i++) {
        const key = nodeSet[i].join(',');
        indexMap.set(key, i);
    }

    for (let i = 0; i < nodeSet.length; i++) {
        const node = nodeSet[i];

        for (let gi = 0; gi < generatingSet.length; gi++) {
            const generator = generatingSet[gi];
            const newCoordinate = node.map(
                (value, index) => (value + generator[index] + P) % P
            );
            const key = newCoordinate.join(',');
            const newIndex = indexMap.get(key);

            if (newIndex !== undefined) {
                edgeSet.push([i, newIndex, gi]);
            }
        }
    }

    return edgeSet;
}
