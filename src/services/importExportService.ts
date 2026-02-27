import { ParsedError, parseError } from '@/config/parsedError';
import { DefaultEdgesData, DefaultNodesData } from '@/constants/graphDefaults';
import type { EdgesData } from '@/types/edges';
import type { NodesData } from '@/types/nodes';
import type cytoscape from 'cytoscape';
import type { CytoscapeOptions } from 'cytoscape';
import { makeEdgeId } from './edgesService';
import { makeNodeId } from './nodesService';

function isDataValid(data: string[][]) {
    if (data.length < 1) {
        return false;
    }

    for (const line of data) {
        if (line.length < 2 || line.length > 3) {
            return false;
        }
    }

    return true;
}

export function parseTextData(
    data: string,
    defaults?: { nodes: NodesData; edges: EdgesData }
): CytoscapeOptions {
    const separator = ' ';

    const lines = data
        .replaceAll('\r', '')
        .split('\n')
        .map((line) => line.replaceAll(/\s+/g, ' ').trim().split(separator));

    if (!isDataValid(lines)) {
        throw new ParsedError(
            'Invalid file data. Each line must contain 2 or 3 values separated by spaces.',
            { context: { dataPreview: data.slice(0, 100) } }
        );
    }

    const headerTokens = lines.shift() ?? [];
    const [numNodes] = headerTokens.map(Number);
    const directedHeader = headerTokens[2]?.toUpperCase?.();
    const directed = directedHeader === 'D';

    const currentNodesData = {
        ...DefaultNodesData,
        ...(defaults?.nodes ?? {}),
    };
    const currentEdgesData = {
        ...DefaultEdgesData,
        ...(defaults?.edges ?? {}),
    };

    const nodeMap = new Map<string, string>();
    const edges: cytoscape.EdgeDefinition[] = [];

    try {
        for (const line of lines) {
            if (line.length < 2) {
                continue;
            }

            const [sourceLabel, targetLabel, weight = 1] = line.map((val) =>
                val.trim()
            );

            const sourceId = nodeMap.get(sourceLabel) ?? makeNodeId();
            const targetId = nodeMap.get(targetLabel) ?? makeNodeId();

            edges.push({
                data: {
                    ...currentEdgesData,
                    id: makeEdgeId(),
                    source: sourceId,
                    target: targetId,
                    weight,
                },
            });

            if (!nodeMap.has(sourceLabel)) {
                nodeMap.set(sourceLabel, sourceId);
            }
            if (!nodeMap.has(targetLabel)) {
                nodeMap.set(targetLabel, targetId);
            }
        }
    } catch (error) {
        const parsedError = parseError(error);
        throw new ParsedError(
            'Error parsing file data. Please ensure it is correctly formatted.',
            {
                cause: parsedError,
                context: { dataPreview: data.slice(0, 100) },
            }
        );
    }

    const nodes = Array.from(nodeMap.entries()).map(([label, id]) => ({
        data: {
            ...currentNodesData,
            id,
            label,
        },
    }));

    if (numNodes !== nodes.length) {
        for (let i = nodes.length; i < numNodes; i++) {
            const newId = makeNodeId();
            const newIndex = nodes.length + 1;
            nodes.push({
                data: {
                    ...currentNodesData,
                    id: newId,
                    label: newIndex.toString(),
                },
            });
        }
    }

    return { elements: { nodes, edges }, data: { directed } };
}

export function mapElementsToText(graph: cytoscape.Core): string {
    const directedFlag = graph.data('directed') ? 'D' : 'U';

    let dataStr = `${graph.nodes().length.toString()} ${graph.edges().length.toString()} ${directedFlag}\n`;

    // Map Edges
    dataStr += graph
        .edges()
        .map((edge) => {
            const {
                source: sourceId,
                target: targetId,
                weight,
            } = edge.data() as EdgesData;

            const sourceLabel = graph.$id(sourceId).data('label') as string;
            const targetLabel = graph.$id(targetId).data('label') as string;

            let text = `${sourceLabel} ${targetLabel}`;

            if (weight && weight !== 1) {
                text += ` ${weight.toString()}`;
            }

            return text;
        })
        .join('\n');

    return dataStr;
}

export type FileType = 'application/json' | 'text/plain';
