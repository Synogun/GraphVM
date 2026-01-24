import { useGraphProperties } from '@/contexts/GraphContext';
import { useEffect, useRef, type RefObject } from 'react';
import type { GraphInstance } from '../types/graph';

export function useRegisterGraph(id: string, api: RefObject<GraphInstance>) {
    const { registry } = useGraphProperties();

    useEffect(() => {
        if (api.current) {
            registry.register(id, api.current);
        }

        return () => {
            if (registry.get(id)) {
                registry.unregister(id);
            }
        };
    }, [id, api, registry]);
}

export function useGetGraph(id: string): RefObject<GraphInstance> {
    const { registry } = useGraphProperties();
    const core = useRef<GraphInstance>(null);

    useEffect(() => {
        if (registry.get(id)) {
            core.current = registry.get(id);
        }

        return registry.subscribe(id, (instance) => {
            core.current = instance;
        });
    }, [id, registry]);

    return core;
}
