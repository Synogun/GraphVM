// C[u][c] = neighbor v (vertex u uses color c on edge to v)
export type ColorMap = Map<string, Map<number, string>>;

// G[u][v] = color (0 = uncolored)
export type EdgeColorMap = Map<string, Map<string, number>>;

// --- Internal helpers ---

function getC(C: ColorMap, u: string, c: number): string | undefined {
    return C.get(u)?.get(c);
}

function setC(C: ColorMap, u: string, c: number, v: string | undefined): void {
    if (v === undefined) {
        C.get(u)?.delete(c);
    } else {
        if (!C.has(u)) {
            C.set(u, new Map());
        }
        C.get(u)!.set(c, v);
    }
}

function getG(G: EdgeColorMap, u: string, v: string): number {
    return G.get(u)?.get(v) ?? 0;
}

function setG(G: EdgeColorMap, u: string, v: string, c: number): void {
    if (!G.has(u)) {
        G.set(u, new Map());
    }
    G.get(u)!.set(v, c);
}

// --- Exported functions ---

/**
 * Returns smallest c >= 1 not present in C.get(u)
 */
export function freeColor(u: string, C: ColorMap): number {
    const used = C.get(u);
    let c = 1;
    while (used?.has(c)) {
        c++;
    }
    return c;
}

/**
 * Returns true if color c is not used at vertex v
 */
export function isColorFree(v: string, c: number, C: ColorMap): boolean {
    return !C.get(v)?.has(c);
}

/**
 * Build maximal fan starting at v0 from root u.
 * fan = [v0]; extend by following C[u][freeColor(last)] while next exists and not in fan.
 */
export function buildMaximalFan(
    u: string,
    v0: string,
    C: ColorMap,
    G: EdgeColorMap
): string[] {
    void G; // G unused in fan building but kept in signature for consistency
    const fan: string[] = [v0];
    const inFan = new Set<string>([v0]);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
        const last = fan[fan.length - 1];
        const d = freeColor(last, C);
        const next = getC(C, u, d);
        if (next === undefined || inFan.has(next)) {
            break;
        }
        fan.push(next);
        inFan.add(next);
    }

    return fan;
}

/**
 * Walk alternating alpha/beta colors from u via C, collect vertex sequence.
 */
export function findCdPath(
    u: string,
    alpha: number,
    beta: number,
    C: ColorMap
): string[] {
    const path: string[] = [u];
    let cur = u;
    let nextColor = alpha;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
        const next = getC(C, cur, nextColor);
        if (next === undefined) {
            break;
        }
        path.push(next);
        cur = next;
        nextColor = nextColor === alpha ? beta : alpha;
    }

    return path;
}

/**
 * For each consecutive pair in pathVertices: swap alpha/beta in both C and G.
 * Snapshot original colors first to avoid reading stale G values mid-iteration.
 */
export function invertPath(
    path: string[],
    alpha: number,
    beta: number,
    C: ColorMap,
    G: EdgeColorMap
): void {
    if (path.length <= 1) return;

    // Snapshot all original edge colors before modifying anything
    const originalColors: number[] = [];
    for (let i = 0; i < path.length - 1; i++) {
        originalColors.push(getG(G, path[i], path[i + 1]));
    }

    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        const cur = originalColors[i];
        const next = cur === alpha ? beta : alpha;

        setG(G, u, v, next);
        setG(G, v, u, next);

        // Clear old C entries only if they still point to the correct vertex
        if (C.get(u)?.get(cur) === v) setC(C, u, cur, undefined);
        if (C.get(v)?.get(cur) === u) setC(C, v, cur, undefined);

        setC(C, u, next, v);
        setC(C, v, next, u);
    }
}

/**
 * Rotate fan[0..len-1]: each (u,fan[i]) gets color of (u,fan[i+1]);
 * (u,fan[last]) becomes uncolored (0).
 */
export function rotateFan(
    fan: string[],
    u: string,
    C: ColorMap,
    G: EdgeColorMap
): void {
    if (fan.length <= 1) return;

    // Snapshot all original colors before any modifications to avoid reading stale G values
    const originalColors = fan.map((v) => getG(G, u, v));

    for (let i = 0; i < fan.length - 1; i++) {
        const vi = fan[i];
        const oldC = originalColors[i]; // original color of (u, vi)
        const newC = originalColors[i + 1]; // original color of (u, fan[i+1])

        // Clear old C entry for (u, vi) only if it still points to the correct vertex
        if (oldC) {
            if (C.get(u)?.get(oldC) === vi) {
                setC(C, u, oldC, undefined);
            }
            if (C.get(vi)?.get(oldC) === u) {
                setC(C, vi, oldC, undefined);
            }
        }

        // Assign new color to (u, vi)
        setG(G, u, vi, newC);
        setG(G, vi, u, newC);
        if (newC) {
            setC(C, u, newC, vi);
            setC(C, vi, newC, u);
        }
    }

    // Uncolor the last fan edge
    const lastV = fan[fan.length - 1];
    const lastC = originalColors[fan.length - 1];
    setG(G, u, lastV, 0);
    setG(G, lastV, u, 0);
    if (lastC) {
        // Only remove C[u][lastC] if it wasn't reassigned by the loop
        if (C.get(u)?.get(lastC) === lastV) {
            setC(C, u, lastC, undefined);
        }
        setC(C, lastV, lastC, undefined);
    }
}

/**
 * Set G[u][v]=G[v][u]=c, C[u][c]=v, C[v][c]=u
 */
export function assignColor(
    u: string,
    v: string,
    c: number,
    C: ColorMap,
    G: EdgeColorMap
): void {
    setG(G, u, v, c);
    setG(G, v, u, c);
    setC(C, u, c, v);
    setC(C, v, c, u);
}
