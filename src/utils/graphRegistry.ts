export function makeScopedGraphRegistryId(graphId: string, tabId: string) {
    return `${graphId}::${tabId}`;
}
