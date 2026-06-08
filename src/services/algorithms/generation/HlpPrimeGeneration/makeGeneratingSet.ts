/**
 * Produce all k-combinations (unordered, without repetition) of indices
 * from `0..n-1`.
 *
 * Examples:
 * - `makeCombinations(4,2)` -> `[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]`
 *
 * Behavior and notes:
 * - This implementation uses backtracking with a single reusable `path`
 *   buffer (push/pop) to avoid allocating intermediate arrays on each
 *   recursion step.
 *
 * @param n pool size (must be >= 0)
 * @param k selection size (must be >= 0)
 * @returns list of k-length index combinations
 */
export function makeCombinations(n: number, k: number): number[][] {
    const combinations: number[][] = [];

    if (k === 0) {
        return [[]];
    }
    if (k > n) {
        return [];
    }

    const path: number[] = [];

    function combine(start: number) {
        if (path.length === k) {
            combinations.push(path.slice());
            return;
        }

        for (let i = start; i < n; i++) {
            path.push(i);
            combine(i + 1);
            path.pop();
        }
    }

    combine(0);

    return combinations;
}

/**
 * Generate the HLP generating set for a given coordinate dimension `L`.
 *
 * The generating set consists of vectors that have a `1` in one coordinate,
 * a `-1` in another coordinate, and `0`s elsewhere. For each pair of distinct
 * coordinates `(i, j)`, both the vectors swapped and unswapped are included:
 *
 * @param L coordinate dimension (must be >= 2)
 * @returns list of generating vectors for the HLP graph of dimension L
 */
export function makeHlpGeneratingSet(L: number): number[][] {
    const generatingSet: number[][] = [];
    const combinations = makeCombinations(L, 2);

    for (const [i, j] of combinations) {
        const vector1 = new Array<number>(L).fill(0);
        vector1[i] = 1;
        vector1[j] = -1;
        generatingSet.push(vector1);

        const vector2 = new Array<number>(L).fill(0);
        vector2[i] = -1;
        vector2[j] = 1;
        generatingSet.push(vector2);
    }

    return generatingSet;
}
