import { ParsedErrorToast, parseError } from '@/config/parsedError';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { mapElementsToText } from '@/services/importExportService';
import { isCytoscapeOptions, isStylesheetStyleArray } from '@/types/graphTypeGuards';
import { makeBlobAndDownload } from '@/utils/general';
import { transformStylesheet } from '@/utils/styleHelpers';
import { useGraphProperties, useToasts } from '@Contexts';
import type cytoscape from 'cytoscape';
import {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type Ref,
} from 'react';

export function ExportTab({
    ref,
    onExportSuccess,
    onReadyStateChange,
}: ExportTabProps) {
    const graphRef = useGetGraph('main-graph');
    const [exportFormat, setExportFormat] = useState<
        'text' | 'json' | 'png' | 'jpg'
    >('text');
    const [exportOptions, setExportOptions] = useState<
        cytoscape.ExportStringOptions & cytoscape.ExportJpgStringOptions
    >({});

    const {
        nodes: { count: nodeCount },
    } = useGraphProperties();

    const { addToast } = useToasts();

    const isGraphReadyToExport = useMemo(() => nodeCount > 0, [nodeCount]);

    const exportFormatSelectRef = useRef<HTMLSelectElement>(null);
    const exportFilenameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        onReadyStateChange(isGraphReadyToExport);
    }, [isGraphReadyToExport, onReadyStateChange]);

    const cleanup = () => {
        if (exportFormatSelectRef.current) {
            exportFormatSelectRef.current.value = 'text';
        }
        if (exportFilenameInputRef.current) {
            exportFilenameInputRef.current.value = '';
        }
    };

    const handleFormatChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setExportFormat(e.target.value as 'text' | 'json' | 'png' | 'jpg');
        setExportOptions({});
    }, []);

    const handleExport = () => {
        if (!graphRef.current) {
            addToast(ParsedErrorToast.GraphNotFound);
            return;
        }

        if (!exportFilenameInputRef.current) {
            addToast({
                type: 'error',
                message: 'Filename input not found. Please try again.',
            });
            return;
        }

        if (!isGraphReadyToExport) {
            addToast({
                type: 'error',
                message:
                    'The graph is empty. Please add some nodes or edges to export.',
            });
            return;
        }

        let fileName = `${Date.now().toString()}-graphvm-export`;

        if (exportFilenameInputRef.current.value) {
            fileName = exportFilenameInputRef.current.value
                .replace('{TIMESTAMP}', Date.now().toString())
                .replace('{NODE_COUNT}', nodeCount.toString())
                .replace('{EDGE_COUNT}', graphRef.current.edges().length.toString())
                .replace(/[^a-zA-Z0-9-_]/g, '-');
        }

        let dataStr = '';
        let fileNameWithExt = '';
        let fileType = '';

        if (exportFormat === 'json') {
            graphRef.current.elements().unselect();

            const json = graphRef.current.json();

            if (!isCytoscapeOptions(json)) {
                addToast({
                    type: 'error',
                    message: 'Failed to export graph. Invalid graph data.',
                });
                return;
            }

            if (isStylesheetStyleArray(json.style)) {
                json.style = transformStylesheet(json.style, 'json');
            }

            try {
                dataStr = JSON.stringify(json);
            } catch (error) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
                return;
            }

            fileNameWithExt = `${fileName}.json`;
            fileType = 'application/json';
        } else if (exportFormat === 'png' || exportFormat === 'jpg') {
            let options: cytoscape.ExportStringOptions &
                cytoscape.ExportJpgStringOptions = {
                full: exportOptions.full ?? true,
                bg: exportOptions.bg,
            };

            if (exportFormat === 'jpg') {
                options = { ...options, bg: exportOptions.bg, quality: 1 };
            }

            dataStr =
                exportFormat === 'png'
                    ? graphRef.current.png(options)
                    : graphRef.current.jpg(options);
            fileNameWithExt = `${fileName}.${exportFormat}`;
            fileType = `image/${exportFormat}`;
        } else {
            dataStr = mapElementsToText(graphRef.current);
            fileNameWithExt = `${fileName}.txt`;
            fileType = 'text/plain';
        }

        makeBlobAndDownload(dataStr, fileNameWithExt, fileType);
        onExportSuccess();
        addToast({
            type: 'success',
            message: 'Graph exported successfully.',
        });
    };

    useImperativeHandle(ref, () => ({ handleExport, cleanup }));

    return (
        <div className="space-y-6">
            <fieldset className="fieldset">
                <label
                    className="text-sm font-medium text-base-content"
                    htmlFor="file-name"
                >
                    File Name
                </label>
                <input
                    ref={exportFilenameInputRef}
                    className="input input-bordered w-full"
                    id="file-name"
                    name="file-name"
                    placeholder="{TIMESTAMP}-graphvm-export"
                    type="text"
                />
            </fieldset>

            <fieldset className="fieldset">
                <label
                    className="text-sm font-medium text-base-content"
                    htmlFor="export-format"
                >
                    Export Format
                </label>
                <select
                    ref={exportFormatSelectRef}
                    className="select select-bordered w-full"
                    defaultValue="text"
                    id="export-format"
                    name="export-format"
                    onChange={handleFormatChange}
                >
                    <option value="text">TEXT</option>
                    <option value="json">JSON</option>
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                </select>
            </fieldset>

            {exportFormat !== 'text' && exportFormat !== 'json' && (
                <fieldset className="fieldset">
                    <label
                        className="text-sm font-medium text-base-content"
                        htmlFor="export-options"
                    >
                        Export Options
                    </label>
                    <>
                        <div
                            className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-2"
                            id="export-options"
                        >
                            <label className="label cursor-pointer justify-start gap-3 rounded-lg border border-base-300 p-3 hover:border-accent">
                                <input
                                    className="toggle toggle-accent"
                                    defaultChecked={!exportOptions.full}
                                    id="option-fit-graph"
                                    onChange={(e) => {
                                        setExportOptions((prev) => ({
                                            ...prev,
                                            full: e.target.checked,
                                        }));
                                    }}
                                    type="checkbox"
                                />
                                <div className="flex flex-col items-start">
                                    <span className="label-text">Fit Graph</span>
                                    <span className="font-thin">
                                        Center before exporting
                                    </span>
                                </div>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3 rounded-lg border border-base-300 p-3 hover:border-accent">
                                <input
                                    className="p-2 border-0 rounded bg-transparent"
                                    defaultValue={undefined}
                                    id="option-bg-color"
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setExportOptions((prev) => ({
                                            ...prev,
                                            bg: e.target.value,
                                        }));
                                    }}
                                    type="color"
                                />
                                <div className="flex flex-col items-start">
                                    <span className="label-text">
                                        Background Color
                                    </span>
                                    <span className="font-thin">
                                        Defaults to transparent
                                    </span>
                                </div>
                            </label>
                        </div>
                    </>
                </fieldset>
                // .421-64
            )}
            {!nodeCount && (
                <p>
                    The graph has no elemens to export. <br />
                    Try adding some!
                </p>
            )}
        </div>
    );
}

type ExportTabProps = {
    ref: Ref<{ handleExport: () => void }>;
    onExportSuccess: () => void;
    onReadyStateChange: (isReady: boolean) => void;
};
