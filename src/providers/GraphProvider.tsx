import { GraphContext } from '@/contexts/GraphContext';
import type { GraphInstance } from '@/types/graph';
import { useMemo, useState, type ReactNode } from 'react';

export function GraphProvider({ children }: GraphProviderProps) {
    const [nodeCount, setNodeCount] = useState(0);
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

    const [edgeMode, setEdgeMode] = useState<'path' | 'complete'>('path');
    const [edgeCount, setEdgeCount] = useState(0);
    const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

    const nodes = {
        count: nodeCount,
        setCount: setNodeCount,
        selected: selectedNodes,
        setSelected: setSelectedNodes,
    };

    const edges = {
        count: edgeCount,
        setCount: setEdgeCount,
        selected: selectedEdges,
        setSelected: setSelectedEdges,
        edgeMode,
        setEdgeMode,
    };

    const registry = useMemo(() => {
        const instances = new Map<string, GraphInstance>();
        const listeners = new Map<
            string,
            Set<(instance: GraphInstance) => void>
        >();

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
            subscribe: (
                id: string,
                callback: (instance: GraphInstance) => void
            ) => {
                if (!listeners.has(id)) {
                    listeners.set(id, new Set());
                }
                const set = listeners.get(id);

                if (!set) {
                    throw new Error(`No listeners set found for id: ${id}`);
                }

                set.add(callback);
                // Immediately callback with current state
                callback(instances.get(id) ?? null);

                return () => {
                    set.delete(callback);
                    if (set.size === 0) listeners.delete(id);
                };
            },
        };
    }, []);

    const value = { nodes, edges, registry };

    return (
        <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
    );
}

type GraphProviderProps = {
    children: ReactNode;
};
