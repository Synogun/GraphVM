import { useGraphProperties } from '@/contexts/GraphContext';
import { useEffect, useState } from 'react';
import type { GraphInstance } from '../types/graph';

export function useRegisterGraph(id: string, api: GraphInstance) {
    const { registry } = useGraphProperties();

    useEffect(() => {
        if (api) {
            registry.register(id, api);
        }

        return () => {
            if (api) {
                registry.unregister(id);
            }
        };
    }, [id, api, registry]);
}

export function useGetGraph(id: string): GraphInstance {
    const { registry } = useGraphProperties();
    const [api, setApi] = useState<GraphInstance>(() => registry.get(id));

    useEffect(() => {
        return registry.subscribe(id, (instance) => {
            setApi(instance);
        });
    }, [id, registry]);

    return api;
}
