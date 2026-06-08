import cytoscape from 'cytoscape';

export function createHeadlessGraph(data?: Record<string, unknown>) {
    return cytoscape({
        headless: true,
        elements: [],
        ...(data ? { data } : {}),
    });
}

type StringOrSeedOptions = string | SeedNodeOptions;

export function createSeededGraph(
    nodeIds: StringOrSeedOptions[] = ['a', 'b', 'c'],
    data?: Record<string, unknown>
) {
    const core = createHeadlessGraph(data);
    seedNodes(core, nodeIds);
    return core;
}

export function seedNodes(core: cytoscape.Core, nodeIds: StringOrSeedOptions[]) {
    const nodes = nodeIds.map((node, index) => {
        const options = typeof node === 'string' ? { id: node } : node;

        return {
            group: 'nodes' as const,
            data: {
                id: options.id,
                label: options.label ?? options.id,
                index: options.index ?? index + 1,
                isGhost: options.isGhost ?? false,
            },
            position: options.position ?? { x: index * 100, y: 0 },
        };
    });

    core.add(nodes);
}

export function summarizeEdges(core: cytoscape.Core) {
    return core
        .edges()
        .map((edge) => ({
            id: edge.id(),
            source: edge.source().id(),
            target: edge.target().id(),
            classes: edge.classes().sort(),
            isGhost: Boolean(edge.data('isGhost')),
            style: String(edge.data('style')),
            weight: Number(edge.data('weight')),
        }))
        .sort((left, right) => {
            const leftKey = `${left.source}->${left.target}:${left.id}`;
            const rightKey = `${right.source}->${right.target}:${right.id}`;
            return leftKey.localeCompare(rightKey);
        });
}

export function summarizeEdgeRoutes(core: cytoscape.Core) {
    return summarizeEdges(core).map((edge) => `${edge.source}->${edge.target}`);
}

type SeedNodeOptions = {
    id: string;
    label?: string;
    index?: number;
    isGhost?: boolean;
    position?: { x: number; y: number };
};
