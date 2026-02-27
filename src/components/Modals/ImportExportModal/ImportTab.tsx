import { ParsedError, ParsedErrorToast, parseError } from '@/config/parsedError';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { newGraph, setGraphDirected } from '@/services/graphService';
import { parseTextData, type FileType } from '@/services/importExportService';
import { arrangeGraph } from '@/services/layoutService';
import { isCytoscapeOptions, isStylesheetStyleArray } from '@/types/graphTypeGuards';
import {
    getDefaultEdgesData,
    getDefaultNodesData,
    transformStylesheet,
} from '@/utils/styleHelpers';
import { useLayoutProperties, useToasts } from '@Contexts';
import cytoscape, { type CytoscapeOptions } from 'cytoscape';
import {
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    type ChangeEvent,
    type Ref,
} from 'react';

export function ImportTab({
    ref,
    onImportSuccess,
    onReadyStateChange,
}: ImportTabProps) {
    const graphRef = useGetGraph('main-graph');

    const { current: currentLayout } = useLayoutProperties();

    const [importData, setImportData] = useState<CytoscapeOptions | null>(null);
    const [previewCy, setPreviewCy] = useState<cytoscape.Core | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { addToast } = useToasts();

    useEffect(() => {
        onReadyStateChange(!!importData);
    }, [importData, onReadyStateChange]);

    const cleanup = useCallback(() => {
        setImportData(null);

        previewCy?.destroy();
        setPreviewCy(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [previewCy]);

    const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        const validType =
            file?.type === 'application/json' || file?.type === 'text/plain';

        if (!file || !validType || file.size > maxSizeInBytes) {
            cleanup();
            addToast({
                type: 'error',
                message: `Invalid file. Please select a JSON or TXT file under 2MB.`,
            });
            return;
        }

        try {
            const content = await file.text().catch((error: unknown) => {
                throw new ParsedError('Error reading file. Please try again.', {
                    cause: parseError(error),
                });
            });

            handleDataPreview(content, file.type as FileType);
        } catch (error: unknown) {
            const parsedError = parseError(error);
            addToast({
                type: 'error',
                message: parsedError.message,
            });
            cleanup();
            return;
        }
    };

    const handleDataPreview = (data: string, fileType: FileType) => {
        if (!graphRef.current) {
            addToast(ParsedErrorToast.GraphNotFound);
            return;
        }

        let dataToImport: CytoscapeOptions;
        if (fileType === 'application/json') {
            try {
                const jsonData: unknown = JSON.parse(data);

                if (!isCytoscapeOptions(jsonData)) {
                    throw new ParsedError('Invalid Cytoscape JSON format');
                }

                if (isStylesheetStyleArray(jsonData.style)) {
                    jsonData.style = transformStylesheet(jsonData.style, 'sheet');
                }

                dataToImport = { ...jsonData };
            } catch (error) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
                return;
            }
        } else {
            const defaults = {
                nodes: getDefaultNodesData(graphRef.current),
                edges: getDefaultEdgesData(graphRef.current),
            };

            try {
                dataToImport = parseTextData(data, defaults);
            } catch (error: unknown) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
                return;
            }
        }

        try {
            const newPreviewCy = newGraph('data-preview-cy', {
                ...dataToImport,
                userPanningEnabled: false,
                userZoomingEnabled: false,
                boxSelectionEnabled: false,
                autounselectify: true,
                autoungrabify: true,
            });

            arrangeGraph(newPreviewCy, currentLayout);
            setPreviewCy(newPreviewCy);
            setImportData(dataToImport);
        } catch (error) {
            const parsedError = parseError(error);
            addToast({ type: 'error', message: parsedError.message });
            return;
        }
    };

    const handleImport = () => {
        if (!graphRef.current) {
            addToast(ParsedErrorToast.GraphNotFound);
            return;
        }

        if (!importData) {
            addToast({
                type: 'error',
                message: 'No data to import. Please select a valid file first.',
            });
            return;
        }

        graphRef.current.elements().remove();

        // @ts-expect-error - CytoscapeOptions is not fully compatible with the expected type for json(), but it contains all necessary data for import
        graphRef.current.json(importData);

        const directed = Boolean(importData.data?.directed);
        setGraphDirected(graphRef.current, directed);

        cleanup();
        onImportSuccess();
        addToast({ type: 'success', message: 'Graph imported successfully!' });
    };

    useImperativeHandle(ref, () => ({ handleImport, cleanup }));

    return (
        <div className="space-y-6">
            <fieldset className="fieldset">
                <label
                    className="text-sm font-medium text-base-content"
                    htmlFor="file-upload"
                >
                    Upload File
                </label>
                <input
                    ref={fileInputRef}
                    className={
                        'file-input w-full' +
                        (!importData ? '' : ' file-input-accent')
                    }
                    onChange={(e) => {
                        void handleFileSelect(e);
                    }}
                    type="file"
                />
                <label className="label">Max size 2MB</label>
            </fieldset>
            <h3 className="text-sm font-medium text-base-content">Data Preview</h3>
            <div className="relative p-2 text-center">
                <div className="absolute left-7 top-9 flex flex-col items-center gap-2 z-10 text-xs select-none">
                    <span id="preview-node-count">
                        Nodes: {previewCy?.nodes().length ?? 0}
                    </span>
                    <span id="preview-edge-count">
                        Edges: {previewCy?.edges().length ?? 0}
                    </span>
                </div>
                <div
                    className="mt-2 w-full rounded-lg bg-base-300 h-100"
                    id="data-preview-cy"
                />
            </div>
        </div>
    );
}

type ImportTabProps = {
    ref: Ref<{ handleImport: () => void }>;
    onImportSuccess: () => void;
    onReadyStateChange: (isReady: boolean) => void;
};
