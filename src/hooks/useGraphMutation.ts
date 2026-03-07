import { ParsedErrorToasts, parseError } from '@/config/parsedError';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { useGraphMeta, useGraphSelection, useToasts } from '@Contexts';
import { useCallback } from 'react';

type GraphMutationAction<TResult> = (core: cytoscape.Core) => TResult;

export function useGraphMutation(graphId = 'main-graph') {
    const graphRef = useGetGraph(graphId);

    const {
        setDirected,
        nodes: { setCount: setNodeCount },
        edges: { setCount: setEdgeCount },
    } = useGraphMeta();

    const {
        nodes: { setSelected: setSelectedNodes },
        edges: { setSelected: setSelectedEdges },
    } = useGraphSelection();

    const { addToast } = useToasts();

    const getGraph = useCallback(() => {
        const core = graphRef.current;

        if (!core) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return null;
        }

        return core;
    }, [graphRef, addToast]);

    const syncMeta = useCallback(
        (core?: cytoscape.Core) => {
            const target = core ?? getGraph();
            if (!target) {
                return false;
            }

            setNodeCount(target.nodes().length);
            setEdgeCount(target.edges().length);
            setDirected(Boolean(target.data('directed')));
            return true;
        },
        [getGraph, setNodeCount, setEdgeCount, setDirected]
    );

    const syncSelection = useCallback(
        (core?: cytoscape.Core) => {
            const target = core ?? getGraph();
            if (!target) {
                return false;
            }

            setSelectedNodes(target.nodes(':selected').map((node) => node.id()));
            setSelectedEdges(target.edges(':selected').map((edge) => edge.id()));
            return true;
        },
        [getGraph, setSelectedNodes, setSelectedEdges]
    );

    const syncAll = useCallback(
        (core?: cytoscape.Core) => {
            const target = core ?? getGraph();
            if (!target) {
                return false;
            }

            syncMeta(target);
            syncSelection(target);
            return true;
        },
        [getGraph, syncMeta, syncSelection]
    );

    const withGraph = useCallback(
        <TResult>(action: GraphMutationAction<TResult>) => {
            const core = getGraph();
            if (!core) {
                return null;
            }

            try {
                const result = action(core);
                syncAll(core);
                return result;
            } catch (error: unknown) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
                return null;
            }
        },
        [getGraph, syncAll, addToast]
    );

    return {
        withGraph,
        syncMeta,
        syncSelection,
        syncAll,
    };
}
