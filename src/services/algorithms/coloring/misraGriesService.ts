import type {
    EdgeColoringAnimation,
    EdgeColoringStep,
    MisraGriesParams,
} from '@/types';
import type cytoscape from 'cytoscape';
import { generatePalette } from './colorPalette';
import type { ColorMap, EdgeColorMap } from './misraGriesCore';
import {
    assignColor,
    findCdPath,
    freeColor,
    invertPath,
    isColorFree,
    rotateFan,
} from './misraGriesCore';

function snapshot(
    steps: EdgeColoringStep[],
    op: EdgeColoringStep['operation'],
    edgeId: string,
    fan: string[],
    pathEdgeIds: string[],
    colorAssignments: Record<string, number>
): void {
    steps.push({
        operation: op,
        edgeId,
        fanVertexIds: [...fan],
        pathEdgeIds: [...pathEdgeIds],
        colorAssignments: { ...colorAssignments },
    });
}

export function runMisraGriesAnimation(
    graph: cytoscape.Core,
    params: MisraGriesParams
): EdgeColoringAnimation {
    const edges = graph.edges('[!isGhost]');

    // Build edgeIdMap: "u__v" and "v__u" → edgeId
    const edgeIdMap = new Map<string, string>();
    edges.forEach((edge) => {
        const u = edge.data('source') as string;
        const v = edge.data('target') as string;
        const id = edge.id();
        edgeIdMap.set(`${u}__${v}`, id);
        edgeIdMap.set(`${v}__${u}`, id);
    });

    // Compute max degree
    let maxDegree = 0;
    graph.nodes().forEach((node) => {
        const deg = node.connectedEdges('[!isGhost]').length;
        if (deg > maxDegree) maxDegree = deg;
    });

    const palette = generatePalette(maxDegree + 1);

    const C: ColorMap = new Map();
    const G: EdgeColorMap = new Map();
    const colorAssignments: Record<string, number> = {};
    const steps: EdgeColoringStep[] = [];

    for (const edge of edges) {
        const u = edge.data('source') as string;
        const v0 = edge.data('target') as string;
        const eid = edge.id();

        // Build fan with step capture (inline — not using buildMaximalFan)
        const fan: string[] = [v0];
        const inFan = new Set<string>([v0]);
        snapshot(steps, 'build-fan', eid, fan, [], colorAssignments);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const last = fan.at(-1);
            if (!last) break;

            const d = freeColor(last, C);
            const next = C.get(u)?.get(d);
            if (!next || inFan.has(next)) break;
            fan.push(next);
            inFan.add(next);
            snapshot(steps, 'build-fan', eid, fan, [], colorAssignments);
        }

        // Compute alpha = freeColor(u, C), beta = freeColor(fan[last], C)
        const alpha = freeColor(u, C);
        const lastFanVertex = fan.at(-1);
        if (!lastFanVertex) {
            return { algorithm: 'misra-gries', params, palette, steps };
        }

        const beta = freeColor(lastFanVertex, C);

        // Find cd-path from u: start with beta (alpha is free at u; beta may be used at u)
        const cdPathVertices = findCdPath(u, beta, alpha, C);
        const pathEdgeIds: string[] = [];
        for (let i = 0; i < cdPathVertices.length - 1; i++) {
            const a = cdPathVertices[i];
            const b = cdPathVertices[i + 1];
            const eid2 = edgeIdMap.get(`${a}__${b}`) ?? edgeIdMap.get(`${b}__${a}`);
            if (eid2) pathEdgeIds.push(eid2);
        }

        // Snapshot flip-path step
        snapshot(steps, 'flip-path', eid, fan, pathEdgeIds, colorAssignments);

        // Invert the cd-path
        invertPath(cdPathVertices, alpha, beta, C, G);

        // Update colorAssignments for edges that had their alpha/beta colors swapped
        for (let i = 0; i < cdPathVertices.length - 1; i++) {
            const a = cdPathVertices[i];
            const b = cdPathVertices[i + 1];
            const key = edgeIdMap.get(`${a}__${b}`) ?? edgeIdMap.get(`${b}__${a}`);
            if (key && colorAssignments[key]) {
                const cur = colorAssignments[key];
                if (cur === alpha - 1) colorAssignments[key] = beta - 1;
                else if (cur === beta - 1) colorAssignments[key] = alpha - 1;
            }
        }

        const w = fan.findLastIndex((v) => isColorFree(v, beta, C));

        // Snapshot rotate-fan steps for each edge in fan.slice(0, w+1) except last
        const fanSlice = fan.slice(0, w + 1);
        for (let i = 0; i < fanSlice.length - 1; i++) {
            snapshot(
                steps,
                'rotate-fan',
                eid,
                fanSlice.slice(0, i + 2),
                [],
                colorAssignments
            );
        }

        // Rotate fan
        rotateFan(fanSlice, u, C, G);

        // Update colorAssignments for all edges that got re-colored during rotation
        for (let i = 0; i < fanSlice.length - 1; i++) {
            const v = fanSlice[i];
            const newColor = G.get(u)?.get(v) ?? 0;
            if (newColor > 0) {
                const key =
                    edgeIdMap.get(`${u}__${v}`) ?? edgeIdMap.get(`${v}__${u}`);
                if (key) colorAssignments[key] = newColor - 1;
            }
        }

        // Assign color beta to (u, fan[w])
        assignColor(u, fan[w], beta, C, G);

        // Update colorAssignments: beta is 1-indexed, palette is 0-indexed
        const edgeKey =
            edgeIdMap.get(`${u}__${fan[w]}`) ??
            edgeIdMap.get(`${fan[w]}__${u}`) ??
            eid;
        colorAssignments[edgeKey] = beta - 1;

        // Reconstruct colorAssignments from G to capture any missed updates
        edges.forEach((e) => {
            const eu = e.data('source') as string;
            const ev = e.data('target') as string;
            const eId = e.id();
            const gColor = G.get(eu)?.get(ev) ?? G.get(ev)?.get(eu) ?? 0;
            if (gColor > 0) {
                colorAssignments[eId] = gColor - 1;
            }
        });

        // Snapshot color-edge step
        snapshot(steps, 'color-edge', eid, fan, [], colorAssignments);
    }

    return { algorithm: 'misra-gries', params, palette, steps };
}
