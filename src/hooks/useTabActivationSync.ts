import { extractElementsInfo } from '@/services/graph';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import { useGraphRegistry, useGraphSelection, useGraphWorkspace } from '@Contexts';
import { useEffect } from 'react';
import { useGraphMutation } from './useGraphMutation';

export function useTabActivationSync(graphId = 'main-graph') {
    const { activeTabId } = useGraphWorkspace();
    const registry = useGraphRegistry();
    const { syncAll } = useGraphMutation(graphId);
    const {
        selectionInfo: { setInfo },
    } = useGraphSelection();

    useEffect(() => {
        const scopedId = makeScopedGraphRegistryId(graphId, activeTabId);

        return registry.subscribe(scopedId, (core) => {
            if (!core) {
                return;
            }

            syncAll(core);
            setInfo(extractElementsInfo(core.$(':selected')));
        });
    }, [activeTabId, graphId, registry, syncAll, setInfo]);
}
