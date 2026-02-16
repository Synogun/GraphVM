import { DefaultEdgesData, DefaultNodesData } from '@/constants/graphDefaults';
import type { EdgesData } from '@/types/edges';
import type { NodesData } from '@/types/nodes';
import { Logger } from '@Logger';
import type cytoscape from 'cytoscape';
import type { ElementsDefinition } from 'cytoscape';
import { makeEdgeId } from './edgesService';
import { makeNodeId } from './nodesService';

const logger = Logger.createContextLogger('ImportExportService');

export function isFileValid(file: File) {
    const validType = file.type === 'application/json' || file.type === 'text/plain';

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    return validType && file.size <= maxSizeInBytes;
}

export function isDataValid(data: string, type: FileType, separator: string) {
    if (type !== 'text/plain') {
        return false;
    }

    let isValid = true;
    const parsedData = data.replaceAll('\r', '').split('\n');

    if (parsedData.length < 1) {
        return false;
    }

    for (const line of parsedData) {
        const values = line.split(separator);
        if (values.length < 2 || values.length > 3) {
            isValid = false;
            break;
        }
    }

    return isValid;
}

export function parseTextData(
    data: string,
    type: FileType,
    defaults?: { nodes: NodesData; edges: EdgesData }
): { elements: ElementsDefinition; directed: boolean } | false {
    const separator = ' ';

    if (!isDataValid(data, type, separator)) {
        logger.warn('Invalid data format');
        return false;
    }

    const lines = data
        .replaceAll('\r', '')
        .split('\n')
        .map((line) => line.replaceAll(/\s+/g, ' ').trim().split(separator));

    if (lines.length < 1) {
        logger.warn('No data to parse');
        return false;
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
        logger.error('Error parsing edge data:', error);
        return false;
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

    return { elements: { nodes, edges }, directed };
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
