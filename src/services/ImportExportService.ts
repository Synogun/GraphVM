import type { ElementsDefinition } from 'cytoscape';
import { DefaultStyleService } from './DefaultStyleService';
import { makeNodeId } from './NodesService';
import { makeEdgeId } from './EdgesService';
import { Logger } from '@Logger';

const logger = Logger.createContextLogger('ImportExportService');

export function isFileValid(file: File) {
    const validType = file.type === 'application/json' || file.type === 'text/plain';

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    return validType && file.size <= maxSizeInBytes;
}

export function isDataValid(data: string, type: FileType) {
    if (type !== 'text/plain') {
        return false;
    }

    let isValid = true;
    const separator = ' ';

    for (const line of data.replaceAll('\r', '').split('\n')) {
        const values = line.split(separator);
        if (values.length < 2 || values.length > 3) {
            isValid = false;
            break;
        }
    }

    return isValid;
}

export function parseTextData(data: string, type: FileType): ElementsDefinition | false {
    const separator = ' ';

    const lines = data
        .replaceAll('\r', '')
        .split('\n')
        .map((line) => line.replaceAll(/\s+/g, ' ').trim().split(separator));

    if (!isDataValid(data, type)) {
        logger.warn('Invalid data format');
        return false;
    }

    const ConfigManager = DefaultStyleService.getInstance();
    const nodeMap = new Map<string, string>();
    const edges = [];

    try {
        for (const line of lines) {
            if (line.length < 2) {
                continue;
            }

            const [sourceLabel, targetLabel, weight = 1] = line.map((val) => val.trim());

            const sourceId = nodeMap.get(sourceLabel) ?? makeNodeId();
            const targetId = nodeMap.get(targetLabel) ?? makeNodeId();

            edges.push({
                data: {
                    ...ConfigManager.getEdgesData(),
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
            ...ConfigManager.getNodesData(),
            id,
            label,
        },
    }));

    return { nodes, edges };
}

export type FileType = 'application/json' | 'text/plain';
