import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import type { GraphInstance } from '@/types/graph';
import { findPropertyValueMode } from '@/utils/elements';
import { useToasts } from '@Contexts';
import { useCallback, type RefObject } from 'react';

type EditorCollection = cytoscape.NodeCollection | cytoscape.EdgeCollection;

type UsePropertyEditorParams<TDefaults extends Record<string, unknown>> = {
    graphRef: RefObject<GraphInstance>;
    selectedIds: string[];
    getDefaults: (core: cytoscape.Core) => TDefaults;
    setDefaults: (core: cytoscape.Core, data: Partial<TDefaults>) => void;
    getElements: (core: cytoscape.Core) => EditorCollection;
    updateElements: <K extends Extract<keyof TDefaults, string>>(
        core: cytoscape.Core,
        selectedIds: string[],
        property: K,
        value: TDefaults[K]
    ) => void;
};

export function usePropertyEditor<TDefaults extends Record<string, unknown>>({
    graphRef,
    selectedIds,
    getDefaults,
    setDefaults,
    getElements,
    updateElements,
}: UsePropertyEditorParams<TDefaults>) {
    const { addToast } = useToasts();

    const getCore = useCallback(() => {
        const core = graphRef.current;

        if (!core) {
            addToast(ParsedErrorToasts.GraphNotFound);
            return null;
        }

        return core;
    }, [graphRef, addToast]);

    const resolveDefaults = useCallback(() => {
        const core = getCore();
        if (!core) {
            return null;
        }

        return getDefaults(core);
    }, [getCore, getDefaults]);

    const resolveSelectedCollection = useCallback(() => {
        const core = getCore();
        if (!core) {
            return null;
        }

        const collection = getElements(core).filter(
            (element: cytoscape.NodeSingular | cytoscape.EdgeSingular) =>
                selectedIds.includes(element.id())
        );

        return collection;
    }, [getCore, getElements, selectedIds]);

    const getModeValue = useCallback(
        <K extends Extract<keyof TDefaults, string>>(property: K) => {
            const defaults = resolveDefaults();
            if (!defaults) {
                return null;
            }

            if (selectedIds.length === 0) {
                return defaults[property];
            }

            const selectedCollection = resolveSelectedCollection();
            if (!selectedCollection) {
                return null;
            }

            const modeValue = findPropertyValueMode(selectedCollection, property);
            return modeValue ?? defaults[property];
        },
        [resolveDefaults, selectedIds, resolveSelectedCollection]
    );

    const applyValue = useCallback(
        <K extends Extract<keyof TDefaults, string>>(
            property: K,
            value: TDefaults[K]
        ) => {
            const core = getCore();
            if (!core) {
                return false;
            }

            if (selectedIds.length === 0) {
                const defaultPatch = {
                    [property]: value,
                } as unknown as Partial<TDefaults>;
                setDefaults(core, defaultPatch);
                return true;
            }

            try {
                updateElements(core, selectedIds, property, value);
                return true;
            } catch (error: unknown) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
                return false;
            }
        },
        [getCore, selectedIds, setDefaults, updateElements, addToast]
    );

    return {
        getCore,
        resolveDefaults,
        resolveSelectedCollection,
        getModeValue,
        applyValue,
    };
}
