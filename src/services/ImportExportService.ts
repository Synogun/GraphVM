import type { ElementsDefinition } from 'cytoscape';
import { ConfigService } from './ConfigService';

export type FileType = 'application/json' | 'text/plain';

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
    console.log('Data Preview:', lines);

    if (!isDataValid(data, type)) {
        console.error('Invalid data format');
        return false;
    }

    const ConfigManager = ConfigService.getInstance();
    const nodeSet = new Set<string>();
    const edges = [];

    try {
        for (const line of lines) {
            if (line.length < 2) {
                continue;
            }

            const [source, target, weight = 1] = line.map((val) => val.trim());

            nodeSet.add(source);
            nodeSet.add(target);

            edges.push({
                data: {
                    ...ConfigManager.getEdgesData(),
                    source,
                    target,
                    weight,
                },
            });
        }
    } catch (error) {
        console.error('Error parsing edge data:', error);
        return false;
    }

    const nodes = Array.from(nodeSet).map((id) => ({
        data: { ...ConfigManager.getNodesData(), id },
    }));

    return { nodes, edges };
}
