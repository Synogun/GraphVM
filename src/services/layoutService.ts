import { DefaultLayoutOptions } from '@/constants/layoutDefaults';
import type cytoscape from 'cytoscape';

export function arrangeGraph(
    core: cytoscape.Core,
    options?: cytoscape.LayoutOptions
): void {
    const layoutOptions: cytoscape.LayoutOptions = {
        ...DefaultLayoutOptions,
        ...(options ?? {}),
    };

    core.layout(layoutOptions).run();
}

export function centerGraph(
    core: cytoscape.Core,
    eles?: cytoscape.Collection,
    padding = 30
): void {
    if (eles?.length) {
        core.fit(eles, padding);
    } else {
        core.fit(core.nodes(), padding);
    }
}
