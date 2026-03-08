import { makeScopedGraphRegistryId as makeActiveGraphRegistryId } from '@/utils/graphRegistry';
import {
    useGraphRegistry as useGraphRegistryContext,
    useGraphWorkspace,
} from '@Contexts';
import { useEffect, useRef, type RefObject } from 'react';
import type { GraphInstance } from '../types/graph';

export function useRegisterGraph(id: string, api: RefObject<GraphInstance>) {
    const registry = useGraphRegistryContext();
    const { activeTabId } = useGraphWorkspace();

    useEffect(() => {
        if (!activeTabId) {
            return;
        }

        const activeGraphId = makeActiveGraphRegistryId(id, activeTabId);

        if (api.current) {
            registry.register(activeGraphId, api.current);
        }

        return () => {
            if (registry.get(activeGraphId)) {
                registry.unregister(activeGraphId);
            }
        };
    }, [id, api, registry, activeTabId]);
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

        if (registry.get(activeGraphId)) {
            core.current = registry.get(activeGraphId);
        }

        return registry.subscribe(activeGraphId, (instance) => {
            core.current = instance;
        });
    }, [id, registry, activeTabId]);

    return core;
}
