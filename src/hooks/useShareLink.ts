import { decodeSharePayload, getShareParam } from '@/services/persistence';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { useSnapshotStore, useToasts } from '@Contexts';
import { useEffect } from 'react';

export function useShareLink() {
    const createTab = useGraphWorkspaceStore((s) => s.createTab);
    const { setSnapshot } = useSnapshotStore();
    const { addToast } = useToasts();

    useEffect(() => {
        const encoded = getShareParam();
        if (!encoded) {
            return;
        }

        window.history.replaceState(null, '', window.location.pathname);

        const payload = decodeSharePayload(encoded);

        if (!payload) {
            addToast({
                type: 'error',
                message:
                    'Failed to load shared graph. The link may be invalid or corrupted.',
            });
            return;
        }

        const tabId = createTab(payload.name);
        setSnapshot(tabId, payload.graph);
    }, [addToast, createTab, setSnapshot]);
}
