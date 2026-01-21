import { useEffect, useState } from 'react';
import type { GraphInstance } from '../types/graph';

const registry = new Map<string, GraphInstance>();
const subscribers = new Map<string, Set<() => void>>();

export function useRegisterGraph(id: string, api: GraphInstance) {
    useEffect(() => {
        registry.set(id, api);
        subscribers.get(id)?.forEach((callback) => {
            callback();
        });

        return () => {
            registry.delete(id);
        };
    }, [id, api]);
}

export function useGetGraph(id: string): GraphInstance {
    const [api, setApi] = useState<GraphInstance>(() => registry.get(id) ?? null);

    useEffect(() => {
        if (api) {
            return;
        } // Already have the api

        const onGraphRegistered = () => {
            const registeredApi = registry.get(id);
            if (registeredApi) {
                setApi(registeredApi);
            }
        };

        onGraphRegistered();

        if (!subscribers.has(id)) {
            subscribers.set(id, new Set());
        }

        const subscriberSet = subscribers.get(id);

        if (!subscriberSet) {
            console.warn("This shouldn't happen");
            return;
        }

        const callback = () => {
            onGraphRegistered();
        };
        subscriberSet.add(callback);

        return () => {
            subscriberSet.delete(callback);
            if (subscriberSet.size === 0) {
                subscribers.delete(id);
            }
        };
    }, [id, api]);

    return api;
}
