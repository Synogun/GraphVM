import { ParsedError } from '@/config/parsedError';
import type { GraphInstance } from '@/types/graph';
import { GraphRegistryContext } from '@Contexts';
import { useMemo, type ReactNode } from 'react';

export function GraphRegistryProvider({ children }: GraphRegistryProviderProps) {
    const registry = useMemo(() => {
        const instances = new Map<string, GraphInstance>();
        const listeners = new Map<string, Set<(instance: GraphInstance) => void>>();

        const notify = (id: string) => {
            const instance = instances.get(id) ?? null;
            listeners.get(id)?.forEach((cb) => {
                cb(instance);
            });
        };

        return {
            register: (id: string, instance: GraphInstance) => {
                instances.set(id, instance);
                notify(id);
            },
            unregister: (id: string) => {
                instances.delete(id);
                notify(id);
            },
            get: (id: string) => instances.get(id) ?? null,
            subscribe: (id: string, callback: (instance: GraphInstance) => void) => {
                if (!listeners.has(id)) {
                    listeners.set(id, new Set());
                }

                const set = listeners.get(id);
                if (!set) {
                    throw new ParsedError(
                        'No listeners set found for the graph id',
                        {
                            context: { graphId: id },
                        }
                    );
                }

                set.add(callback);
                callback(instances.get(id) ?? null);

                return () => {
                    set.delete(callback);
                    if (set.size === 0) {
                        listeners.delete(id);
                    }
                };
            },
        };
    }, []);

    return (
        <GraphRegistryContext.Provider value={registry}>
            {children}
        </GraphRegistryContext.Provider>
    );
}

type GraphRegistryProviderProps = {
    children: ReactNode;
};
