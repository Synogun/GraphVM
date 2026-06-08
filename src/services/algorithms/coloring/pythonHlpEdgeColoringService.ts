import { ParsedError } from '@/config/parsedError';
import { makeHlpGeneratingSet } from '@/services/algorithms/generation/HlpPrimeGeneration';
import type {
    EdgeColoringAnimation,
    EdgeColoringStep,
    HlpEdgeColoringParams,
} from '@/types';
import type cytoscape from 'cytoscape';
import { generatePalette } from './colorPalette';

// Faithful TypeScript port of visualGabriel.py (Professor's algorithm).
// Internal arrays are 1-indexed to match the Python source exactly.

// Python's % is always non-negative but TS % can return negative for negative operands.
// py: (n % m)
function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

// Python uses tuple keys like (u, v) in dicts/sets; TS Map requires string keys.
function eKey(u: number, v: number): string {
    return `${String(u)}__${String(v)}`;
}

// --- Python helpers (visualGabriel.py: update, color, flip, gerar_ciclo) ---

// py: def update(X, C, u): X[u] = 1; while C[u][X[u]]: X[u] += 1
function pyUpdate(X: number[], C: number[][], u: number): void {
    X[u] = 1;
    while (C[u][X[u]]) X[u]++;
}

// py: def color(C, G, X, u, v, c): ... return p
// C[u][c] = neighbor of u via color c; G[u][v] = color of edge (u,v); both 1-indexed.
function pyColor(
    C: number[][],
    G: number[][],
    X: number[],
    u: number,
    v: number,
    c: number
): number {
    const p = G[u][v]; // old color of (u,v)
    G[u][v] = G[v][u] = c;
    C[u][c] = v;
    C[v][c] = u;
    C[u][p] = C[v][p] = 0; // clear old color slot (no-op when p=0)
    if (p) {
        X[u] = X[v] = p; // freed color p is now available
    } else {
        pyUpdate(X, C, u);
        pyUpdate(X, C, v);
    }
    return p;
}

// py: def flip(C, G, X, u, c1, c2): ... return p
// Swaps colors c1 and c2 at vertex u; returns old neighbor via c1 (next vertex to flip).
function pyFlip(
    C: number[][],
    G: number[][],
    X: number[],
    u: number,
    c1: number,
    c2: number
): number {
    const p = C[u][c1]; // py: p = C[u][c1]
    [C[u][c1], C[u][c2]] = [C[u][c2], C[u][c1]]; // py: C[u][c1], C[u][c2] = C[u][c2], C[u][c1]
    if (p) G[u][p] = G[p][u] = c2;
    if (!C[u][c1]) X[u] = c1;
    if (!C[u][c2]) X[u] = c2;
    return p;
}

// py: def gerar_ciclo(u, e, vertices, P): ciclo = [u]; v = tuple((u[i]+e[i])%P ...); while v != u: ...
// mod() handles negative e[i] values (e.g. -1) that Python % resolves naturally.
function pyGeraCiclo(u: number[], e: number[], P: number): number[][] {
    const ciclo: number[][] = [u];
    let v = u.map((ui, i) => mod(ui + e[i], P));
    while (!v.every((vi, i) => vi === u[i])) {
        ciclo.push(v);
        v = v.map((vi, i) => mod(vi + e[i], P));
    }
    return ciclo;
}

// --- Snapshot helper (no Python equivalent — added for animation architecture) ---

function makeSnapper(
    G: number[][],
    uniqueEdgeInts: [number, number][],
    edgeIdByInts: Map<string, string>,
    intToNodeId: (i: number) => string,
    steps: EdgeColoringStep[]
) {
    return (
        op: EdgeColoringStep['operation'],
        edgeId: string,
        fanInts: number[],
        pathEdgeIds: string[]
    ): void => {
        const colorAssignments: Record<string, number> = {};
        for (const [u, v] of uniqueEdgeInts) {
            const c = G[u][v];
            if (c > 0) {
                // G is 1-indexed; palette is 0-indexed → c - 1
                const eid =
                    edgeIdByInts.get(eKey(u, v)) ?? edgeIdByInts.get(eKey(v, u));
                if (eid) colorAssignments[eid] = c - 1;
            }
        }
        steps.push({
            operation: op,
            edgeId,
            fanVertexIds: fanInts.map((i) => intToNodeId(i)),
            pathEdgeIds,
            colorAssignments,
        });
    };
}

// --- Vizing algorithm (visualGabriel.py: vizing) ---

// py: def vizing(C, G, X, E, N, M): ... return G
// E contains both directions per edge, matching gerar_arestas_Hlp output.
// snap() calls are the only additions; all branching logic is identical to Python.
function pyVizing(
    C: number[][],
    G: number[][],
    X: number[],
    E: [number, number][],
    N: number,
    uniqueEdgeInts: [number, number][],
    edgeIdByInts: Map<string, string>,
    intToNodeId: (i: number) => string,
    steps: EdgeColoringStep[]
): void {
    const snap = makeSnapper(G, uniqueEdgeInts, edgeIdByInts, intToNodeId, steps);

    // py: for i in range(1, N+1): X[i] = 1
    for (let i = 1; i <= N; i++) X[i] = 1;
    let t = 0;
    while (t < E.length) {
        const [u, v0] = E[t]; // py: u, v0 = E[t]
        let v = v0;
        const c0 = X[u]; // py: v, c0 = v0, X[u]
        let c = c0;
        let d = 0;
        const L: [number, number][] = []; // list of (vertex, free_color) pairs
        const vst = new Array<number>(N + 1).fill(0);

        const edgeId =
            edgeIdByInts.get(eKey(u, v0)) ?? edgeIdByInts.get(eKey(v0, u)) ?? '';

        snap('build-fan', edgeId, [v], []);

        while (!G[u][v0]) {
            // py: L.append((v, d := X[v])) — walrus operator becomes two statements
            d = X[v];
            L.push([v, d]);
            snap(
                'build-fan',
                edgeId,
                L.map(([vv]) => vv),
                []
            );

            if (!C[v][c]) {
                // py: for a in range(len(L)-1, -1, -1): C,G,X,c = color(C,G,X,u,L[a][0],c)
                for (let a = L.length - 1; a >= 0; a--) {
                    c = pyColor(C, G, X, u, L[a][0], c);
                    snap(
                        'rotate-fan',
                        edgeId,
                        L.slice(0, a + 1).map(([vv]) => vv),
                        []
                    );
                }
            } else if (!C[u][d]) {
                // py: for a in range(len(L)-1, -1, -1): C,G,X,h = color(C,G,X,u,L[a][0],L[a][1])
                for (let a = L.length - 1; a >= 0; a--) {
                    pyColor(C, G, X, u, L[a][0], L[a][1]);
                    snap(
                        'rotate-fan',
                        edgeId,
                        L.slice(0, a + 1).map(([vv]) => vv),
                        []
                    );
                }
            } else if (vst[d]) {
                break; // py: elif vst[d]: break
            } else {
                vst[d] = 1;
                v = C[u][d]; // py: v = C[u][d]
            }
        }

        if (!G[u][v0]) {
            // py: while v: C,G,X,v = flip(C,G,X,v,c,d); c,d = d,c
            while (v) {
                snap('flip-path', edgeId, [], []);
                v = pyFlip(C, G, X, v, c, d);
                [c, d] = [d, c];
            }

            if (C[u][c0]) {
                // py: a = 0; for b in range(len(L)-2,-1,-1): if L[b][1]==c: break; a=b
                let a = 0;
                for (let b = L.length - 2; b >= 0; b--) {
                    if (L[b][1] === c) break;
                    a = b;
                }
                // py: while a>=0: C,G,X,h = color(C,G,X,u,L[a][0],L[a][1]); a-=1
                while (a >= 0) {
                    pyColor(C, G, X, u, L[a][0], L[a][1]);
                    snap(
                        'rotate-fan',
                        edgeId,
                        L.slice(0, a + 1).map(([vv]) => vv),
                        []
                    );
                    a--;
                }
            } else {
                t--; // py: t -= 1 — retry this edge next iteration
            }
        }

        snap('color-edge', edgeId, [], []);
        t++; // py: t += 1
    }
}

// --- Cycle coloring (visualGabriel.py: colorir_arestas) ---

// py: def colorir_arestas(arestas, vertices, gerador, P): ... return cores
// cores in Python is dict of (u_idx, v_idx) → color; here it's edgeId → palette index.
function pyColorirArestas(
    arestas: [number, number][],
    vertices: number[][],
    gerador: number[][],
    P: number,
    edgeIdByInts: Map<string, string>,
    steps: EdgeColoringStep[]
): void {
    const cores: Record<string, number> = {}; // py: cores = {}

    // py: vertices.index(coord)+1 — pre-built map avoids O(n) search per lookup
    const coordToInt = new Map<string, number>();
    vertices.forEach((v, i) => coordToInt.set(v.join(','), i + 1));

    // py: U = set(arestas) — arestas already has both directions
    const U = new Set<string>(arestas.map(([u, v]) => eKey(u, v)));

    while (U.size > 0) {
        // py: (u, v) = U.pop() — Set has no pop(); grab first available key
        let first: string | undefined;
        for (const key of U) {
            first = key;
            break;
        }
        if (first === undefined) break;

        U.delete(first);
        const [uStr, vStr] = first.split('__');
        const u = Number.parseInt(uStr, 10);
        const v = Number.parseInt(vStr, 10);
        const u_idx = u - 1; // py: u_idx = u - 1
        const v_idx = v - 1; // py: v_idx = v - 1
        U.add(eKey(u, v)); // py: U.add((u, v)) — add back so cycle loop can remove it

        const vertU = vertices[u_idx];
        const vertV = vertices[v_idx];

        // py: e = list((vertices[v_idx][i] - vertices[u_idx][i]) % P ...)
        let e = vertU.map((ui, i) => mod(vertV[i] - ui, P));
        // py: for j in range(len(e)): if e[j] == P-1: e[j] = -1
        e = e.map((ei) => (ei === P - 1 ? -1 : ei));

        // py: ei = list((vertices[u_idx][i] - vertices[v_idx][i]) % P ...)
        let ei = vertV.map((vi, i) => mod(vertU[i] - vi, P));
        // py: for j in range(len(ei)): if ei[j] == P-1: ei[j] = -1
        ei = ei.map((eii) => (eii === P - 1 ? -1 : eii));

        const ciclo = pyGeraCiclo(vertU, e, P); // py: ciclo = gerar_ciclo(vertices[u_idx], e, vertices, P)

        // py: for g in range(len(gerador)): if e == gerador[g]: break
        let g_idx = 0;
        for (let g = 0; g < gerador.length; g++) {
            if (gerador[g].every((val, idx) => val === e[idx])) {
                g_idx = g;
                break;
            }
        }
        // py: for k in range(len(gerador)): if ei == gerador[k]: break
        let k_idx = 0;
        for (let k = 0; k < gerador.length; k++) {
            if (gerador[k].every((val, idx) => val === ei[idx])) {
                k_idx = k;
                break;
            }
        }

        const cor_e = g_idx + 1; // py: cor_e = g + 1
        const cor_e_inv = k_idx + 1; // py: cor_e_inv = k + 1

        for (let i = 0; i < P; i++) {
            // py: u = ciclo[i%P]; v = ciclo[(i+1)%P]
            const cycleU = ciclo[i % P];
            const cycleV = ciclo[(i + 1) % P];
            // py: u_idx = vertices.index(u)+1; v_idx = vertices.index(v)+1
            const uInt = coordToInt.get(cycleU.join(',')) ?? 0;
            const vInt = coordToInt.get(cycleV.join(',')) ?? 0;
            const color = i % 2 === 0 ? cor_e : cor_e_inv; // py: if i%2==0: cor_e else: cor_e_inv

            // py: cores[(u_idx,v_idx)] = color; cores[(v_idx,u_idx)] = color
            // Undirected edge → single edgeId; palette index = color - 1
            const edgeId =
                edgeIdByInts.get(eKey(uInt, vInt)) ??
                edgeIdByInts.get(eKey(vInt, uInt));

            if (edgeId) {
                cores[edgeId] = color - 1;
                steps.push({
                    operation: 'color-edge',
                    edgeId,
                    fanVertexIds: [],
                    pathEdgeIds: [],
                    colorAssignments: { ...cores },
                });
            }

            // py: U.remove((u_idx,v_idx)); U.remove((v_idx,u_idx))
            U.delete(eKey(uInt, vInt));
            U.delete(eKey(vInt, uInt));
        }
    }
}

// --- Main export ---

export function runPythonHlpEdgeColoringAnimation(
    graph: cytoscape.Core,
    params: HlpEdgeColoringParams
): EdgeColoringAnimation {
    const firstNode = graph.nodes().first();
    const metadata = firstNode.data('metadata') as
        | { coord?: number[]; L?: number; P?: number }
        | undefined;

    if (metadata?.L === undefined || metadata.P === undefined) {
        throw new ParsedError(
            'Graph is not an HLP graph. Generate one using Graph Templates → HLP.'
        );
    }

    const { L, P } = metadata;
    // py: gerador = conjunto_gerador(L, P) — makeHlpGeneratingSet is the TS equivalent (P unused)
    const gerador = makeHlpGeneratingSet(L);
    const palette = generatePalette(gerador.length + 1);

    // Build 1-based integer node mapping (matching Python gerar_vertices_Hlp indexing).
    // py: vertices = gerar_vertices_Hlp(L, P) → vertices[i] is coord of node i+1
    const nodeIds: string[] = ['']; // slot 0 unused; nodeIds[i] = cytoscape ID of node i
    const nodeIntId = new Map<string, number>(); // cytoscape ID → 1-based int
    const vertices: number[][] = []; // 0-indexed: vertices[i] = coord of node (i+1)

    graph.nodes().forEach((node) => {
        const idx = nodeIds.length;
        nodeIds.push(node.id());
        nodeIntId.set(node.id(), idx);
        const meta = node.data('metadata') as { coord: number[] };
        vertices.push(meta.coord);
    });

    const N = nodeIds.length - 1;

    // Build edge maps with both directions, matching gerar_arestas_Hlp which produces
    // (u,v) and (v,u) for each edge since the generating set includes g and -g.
    const edgeIdByInts = new Map<string, string>();
    const uniqueEdgeInts: [number, number][] = [];

    graph.edges('[!isGhost]').forEach((edge) => {
        const u = nodeIntId.get(edge.data('source') as string) ?? 0;
        const v = nodeIntId.get(edge.data('target') as string) ?? 0;
        edgeIdByInts.set(eKey(u, v), edge.id());
        edgeIdByInts.set(eKey(v, u), edge.id());
        uniqueEdgeInts.push([u, v]);
    });

    const intToNodeId = (i: number): string => nodeIds[i];
    const steps: EdgeColoringStep[] = [];

    if (P % 2 === 0) {
        // py: G = colorir_arestas(arestas, vertices, gerador, P)
        const arestas: [number, number][] = [];
        for (const [u, v] of uniqueEdgeInts) {
            arestas.push([u, v], [v, u]); // both directions, matching gerar_arestas_Hlp
        }

        pyColorirArestas(arestas, vertices, gerador, P, edgeIdByInts, steps);
    } else {
        // py: C, G = clear(N) — [[0]*(N+1) for _ in range(N+1)]
        const size = N + 1;
        const C = Array.from({ length: size }, () =>
            new Array<number>(size).fill(0)
        );
        const G = Array.from({ length: size }, () =>
            new Array<number>(size).fill(0)
        );
        const X = new Array<number>(size).fill(0);

        // py: G = vizing(C, G, X, arestas, N, M)
        const E: [number, number][] = [];
        for (const [u, v] of uniqueEdgeInts) {
            E.push([u, v], [v, u]); // both directions, matching gerar_arestas_Hlp
        }

        pyVizing(C, G, X, E, N, uniqueEdgeInts, edgeIdByInts, intToNodeId, steps);
    }

    return { algorithm: 'hlp-edge-coloring', params, palette, steps };
}
