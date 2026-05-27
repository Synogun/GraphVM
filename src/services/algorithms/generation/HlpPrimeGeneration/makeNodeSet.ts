/**
 * Generate the HLP node set.
 *
 * For each choice of the first `L-1` coordinates in `0..P-1`, this function
 * computes the final coordinate `last = (P - (sum % P)) % P` so that the
 * resulting length-`L` vector sums to `0 (mod P)`.
 *
 * @param L length of vectors to generate (must be >= 1)
 * @param P modulus/base (must be >= 1)
 * @returns list of length-`L` vectors whose coordinates sum to 0 (mod P)
 */
export function makeHlpNodeSet(L: number, P: number): number[][] {
    const nodeSet: number[][] = [];
    const current: number[] = [];

    function generate(depth: number, sum: number) {
        if (depth === L - 1) {
            const last = (P - (sum % P)) % P;
            nodeSet.push([...current, last]);
            return;
        }

        for (let i = 0; i < P; i++) {
            current.push(i);
            generate(depth + 1, sum + i);
            current.pop();
        }
    }

    generate(0, 0);

    return nodeSet;
}
