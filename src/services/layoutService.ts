import { DefaultLayoutOptions } from '@/config/layoutDefaults';
import { Logger } from '@Logger';
import type cytoscape from 'cytoscape';

const logger = Logger.createContextLogger('LayoutService');

export function arrangeGraph(
    core: cytoscape.Core,
    options?: cytoscape.LayoutOptions
): void {
    const layoutOptions: cytoscape.LayoutOptions = {
        ...DefaultLayoutOptions,
        ...(options ?? {}),
    };

    core.layout(layoutOptions).run();
    logger.info('arrangeGraph > arranged graph with', layoutOptions.name, 'layout');
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

    logger.info(
        'centerGraph > centered graph on',
        eles?.length ? eles.toArray() : 'all nodes'
    );
}
