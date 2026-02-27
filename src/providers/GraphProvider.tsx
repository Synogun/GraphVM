import { ParsedError } from '@/config/parsedError';
import type { GraphInstance } from '@/types/graph';
import { GraphContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';

export function GraphProvider({ children }: GraphProviderProps) {
    const [directed, setDirected] = useState(false);
    const [nodeCount, setNodeCount] = useState(0);
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

    const [edgeMode, setEdgeMode] = useState<'path' | 'complete'>('path');
    const [edgeCount, setEdgeCount] = useState(0);
    const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

    const nodes = useMemo(
        () => ({
            count: nodeCount,
            setCount: setNodeCount,
            selected: selectedNodes,
            setSelected: setSelectedNodes,
        }),
        [nodeCount, selectedNodes]
    );

    const edges = useMemo(
        () => ({
            count: edgeCount,
            setCount: setEdgeCount,
            selected: selectedEdges,
            setSelected: setSelectedEdges,
            edgeMode,
            setEdgeMode,
        }),
        [edgeCount, edgeMode, selectedEdges]
    );

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
                        `No listeners set found for the graph id`,
                        { context: { graphId: id } }
                    );
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

    const value = useMemo(
        () => ({ directed, setDirected, nodes, edges, registry }),
        [directed, edges, nodes, registry]
    );

    return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
}

type GraphProviderProps = {
    children: ReactNode;
};
