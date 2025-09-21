import type cytoscape from 'cytoscape';
import { ConfigService } from './ConfigService';

export function arrangeGraph(core: cytoscape.Core, options: cytoscape.LayoutOptions): void {
    const configService = ConfigService.getInstance();
    const layoutOptions: cytoscape.LayoutOptions = {
        ...configService.getLayoutOptions(), // default layout options
        ...options,
    };

    core.layout(layoutOptions).run();
    console.log('arrangeGraph > arranged graph with', options.name, 'layout');
}

export function centerGraph(core: cytoscape.Core, eles?: cytoscape.Collection, padding = 30): void {
    if (eles?.length) {
        core.fit(eles, padding);
    } else {
        core.fit(core.nodes(), padding);
    }

    console.log(
        'centerGraph > centered graph on',
        eles?.length ? eles.toArray() : 'all nodes',
    );
}
