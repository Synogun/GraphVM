import { Logger } from '@/config/logger';
import type { GraphInstance } from '@/types/graph';
import { isDev } from '@/utils/general';
import { makeScopedGraphRegistryId as makeActiveGraphRegistryId } from '@/utils/graphRegistry';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { useGraphRegistry as useGraphRegistryContext } from '@Contexts';
import { useEffect, useRef, type RefObject } from 'react';

const logger = Logger.createContextLogger('useGetGraph');

export function useRegisterGraphByTab(
    id: string,
    api: RefObject<GraphInstance>,
    tabId?: string
) {
    const registry = useGraphRegistryContext();
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const resolvedTabId = tabId ?? activeTabId;

    useEffect(() => {
        if (!resolvedTabId) {
            return;
        }

        const activeGraphId = makeActiveGraphRegistryId(id, resolvedTabId);

        if (api.current) {
            registry.register(activeGraphId, api.current);
        }

        return () => {
            if (registry.get(activeGraphId)) {
                registry.unregister(activeGraphId);
            }
        };
    }, [id, api, registry, resolvedTabId]);
}

export function useGetGraph(id: string): RefObject<GraphInstance> {
    const registry = useGraphRegistryContext();
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const core = useRef<GraphInstance>(null);

    useEffect(() => {
        if (!activeTabId) {
            core.current = null;
            return;
        }

        const activeGraphId = makeActiveGraphRegistryId(id, activeTabId);

        const instance = registry.get(activeGraphId);
        if (instance) {
            core.current = instance;
        } else if (isDev()) {
            logger.warn(
                `useGetGraph: tab "${activeTabId}" is active but graph "${activeGraphId}" is not yet registered. ` +
                    'Callbacks formed before the registry effect fires will see a null ref.'
            );
        }

        return registry.subscribe(activeGraphId, (instance) => {
            core.current = instance;
        });
    }, [id, registry, activeTabId]);

    return core;
}

export function useGetGraphByTab(
    id: string,
    tabId?: string
): RefObject<GraphInstance> {
    const registry = useGraphRegistryContext();
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const core = useRef<GraphInstance>(null);
    const resolvedTabId = tabId ?? activeTabId;

    useEffect(() => {
        if (!resolvedTabId) {
            core.current = null;
            return;
        }

        const activeGraphId = makeActiveGraphRegistryId(id, resolvedTabId);

        const instance = registry.get(activeGraphId);
        if (instance) {
            core.current = instance;
        }

        return registry.subscribe(activeGraphId, (instance) => {
            core.current = instance;
        });
    }, [id, registry, resolvedTabId]);

    return core;
}
