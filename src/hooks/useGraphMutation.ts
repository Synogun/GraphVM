import { parseError } from '@/config/parsedError';
import { useGetGraph } from '@/hooks';
import { useGraphMeta, useGraphSelection } from '@Contexts';
import { Logger } from '@Logger';
import { useCallback } from 'react';

const logger = Logger.createContextLogger('useGraphMutation');

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

    const getGraph = useCallback(() => {
        const core = graphRef.current;

        if (!core) {
            return null;
        }

        return core;
    }, [graphRef]);

    const syncMeta = useCallback(
        (core?: cytoscape.Core) => {
            const target = core ?? getGraph();
            if (!target) {
                return false;
            }

            setNodeCount(target.nodes('[!isGhost]').length);
            setEdgeCount(target.edges('[!isGhost]').length);
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
                logger.error('Graph action failed', parsedError);
                return null;
            }
        },
        [getGraph, syncAll]
    );

    return {
        withGraph,
        syncMeta,
        syncSelection,
        syncAll,
    };
}
