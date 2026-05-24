import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import { DefaultLayoutOptions } from '@/constants/layoutDefaults';
import { useGetGraph, useGraphActions, useGraphMutation } from '@/hooks';
import { arrangeGraph } from '@/services/graph';
import {
    deserializeAndPaste,
    serializeSelection,
} from '@/services/graph/clipboardService';
import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { useLayoutStore } from '@/stores/layoutStore';
import type { ClipboardPayload } from '@/types/clipboard';
import { useSettings, useToasts } from '@Contexts';
import { useCallback } from 'react';

function isClipboardPayload(value: unknown): value is ClipboardPayload {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        v.graphvm === true &&
        v.version === 1 &&
        Array.isArray(v.nodes) &&
        Array.isArray(v.edges)
    );
}

export function useClipboardActions() {
    const graphRef = useGetGraph('main-graph');
    const { syncAll } = useGraphMutation('main-graph');
    const selectedNodes = useGraphSelectionStore((s) => s.selectedNodes);
    const selectedEdges = useGraphSelectionStore((s) => s.selectedEdges);
    const currentLayout = useLayoutStore((s) => s.current);
    const {
        graph: { limits, arrangeOn },
    } = useSettings();
    const { addToast } = useToasts();
    const { handleDeleteSelected } = useGraphActions();

    const handleCopy = useCallback(async () => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        if (selectedNodes.length === 0 && selectedEdges.length > 0) {
            addToast({ message: 'Copy requires at least one node selected.' });
            return;
        }

        if (selectedNodes.length === 0) {
            addToast({ message: 'Select elements to copy.' });
            return;
        }

        const payload = serializeSelection(graph, selectedNodes, selectedEdges);

        try {
            await navigator.clipboard.writeText(JSON.stringify(payload));
            const nodeLabel = payload.nodes.length === 1 ? 'node' : 'nodes';
            const edgeLabel = payload.edges.length === 1 ? 'edge' : 'edges';
            addToast({
                type: 'success',
                message: `${payload.nodes.length.toString()} ${nodeLabel} and ${payload.edges.length.toString()} ${edgeLabel} copied.`,
            });
        } catch {
            addToast({ type: 'error', message: 'Clipboard access denied.' });
        }
    }, [graphRef, selectedNodes, selectedEdges, addToast]);

    const handleCut = useCallback(async () => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        if (selectedNodes.length === 0 && selectedEdges.length > 0) {
            addToast({ message: 'Cut requires at least one node selected.' });
            return;
        }

        if (selectedNodes.length === 0) {
            addToast({ message: 'Select elements to cut.' });
            return;
        }

        const payload = serializeSelection(graph, selectedNodes, selectedEdges);

        try {
            await navigator.clipboard.writeText(JSON.stringify(payload));
            handleDeleteSelected();
        } catch {
            addToast({ type: 'error', message: 'Clipboard access denied.' });
        }
    }, [graphRef, selectedNodes, selectedEdges, addToast, handleDeleteSelected]);

    const handlePaste = useCallback(async () => {
        const graph = graphRef.current;
        if (!graph) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return;
        }

        let raw: string;
        try {
            raw = await navigator.clipboard.readText();
        } catch {
            addToast({ type: 'error', message: 'Clipboard access denied.' });
            return;
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(raw) as unknown;
        } catch {
            addToast({ message: 'Nothing to paste.' });
            return;
        }

        if (!isClipboardPayload(parsed)) {
            addToast({ message: 'Nothing to paste.' });
            return;
        }

        try {
            deserializeAndPaste(graph, parsed, limits);
        } catch (error: unknown) {
            const parsedError = parseError(error);
            addToast({ type: 'error', message: parsedError.message });
            return;
        }

        syncAll(graph);

        if (arrangeOn.import) {
            arrangeGraph(graph, currentLayout ?? DefaultLayoutOptions);
        }
    }, [graphRef, limits, arrangeOn.import, currentLayout, syncAll, addToast]);

    return { handleCopy, handleCut, handlePaste };
}
