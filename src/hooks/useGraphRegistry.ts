import type { GraphInstance } from '@/types/graph';
import { makeScopedGraphRegistryId as makeActiveGraphRegistryId } from '@/utils/graphRegistry';
import {
    useGraphRegistry as useGraphRegistryContext,
    useGraphWorkspace,
} from '@Contexts';
import { useEffect, useRef, type RefObject } from 'react';

export function useRegisterGraphByTab(
    id: string,
    api: RefObject<GraphInstance>,
    tabId?: string
) {
    const registry = useGraphRegistryContext();
    const { activeTabId } = useGraphWorkspace();
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
    const { activeTabId } = useGraphWorkspace();
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
    const { activeTabId } = useGraphWorkspace();
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
