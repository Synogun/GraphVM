import type cytoscape from 'cytoscape';
import { useEffect, useState } from 'react';

export type GraphApi = cytoscape.Core | null;

const registry = new Map<string, GraphApi>();
const subscribers = new Map<string, Set<() => void>>();

export function useRegisterGraph(id: string, api: GraphApi) {
    useEffect(() => {
        registry.set(id, api);
        subscribers.get(id)?.forEach((callback) => {
            callback();
        });

        return () => {
            registry.delete(id);
        };
    });
}

export function useGetGraph(id: string): GraphApi {
    const [api, setApi] = useState<GraphApi>(() => registry.get(id) ?? null);

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
