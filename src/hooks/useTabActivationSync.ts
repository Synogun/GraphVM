import { extractElementsInfo } from '@/services/graph';
import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import { useGraphRegistry } from '@Contexts';
import { useEffect } from 'react';
import { useGraphMutation } from './useGraphMutation';

export function useTabActivationSync(graphId = 'main-graph') {
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const registry = useGraphRegistry();
    const { syncAll } = useGraphMutation(graphId);
    const setSelectionInfo = useGraphSelectionStore((s) => s.setSelectionInfo);

    useEffect(() => {
        const scopedId = makeScopedGraphRegistryId(graphId, activeTabId);

        return registry.subscribe(scopedId, (core) => {
            if (!core) {
                return;
            }

            syncAll(core);
            setSelectionInfo(extractElementsInfo(core.$(':selected')));
        });
    }, [activeTabId, graphId, registry, syncAll, setSelectionInfo]);
}
