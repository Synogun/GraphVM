import { useGraphProperties } from '@/contexts/GraphContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { sheetToPlain } from '@/services/DefaultStyleService';
import type { EdgesData } from '@/types/edges';
import { makeBlobAndDownload } from '@/utils/general';
import type { StylesheetCSS } from 'cytoscape';
import {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
    type ChangeEvent,
    type Ref,
} from 'react';

type CytoscapeJson = {
    style?: StylesheetCSS[];
    [key: string]: unknown;
};

type ExportTabProps = {
    ref: Ref<{ handleExport: () => void }>;
    onExportSuccess: () => void;
    onReadyStateChange: (isReady: boolean) => void;
};

export function ExportTab({ ref, onExportSuccess, onReadyStateChange }: ExportTabProps) {
    const graphRef = useGetGraph('main-graph');
    const [exportFormat, setExportFormat] = useState<'text' | 'json' | 'png' | 'jpg'>('text');
    const [exportOptions, setExportOptions] = useState<Record<string, string | boolean>>({});

    const {
        nodes: { count: nodeCount },
    } = useGraphProperties();

    const isGraphReadyToExport = useMemo(() => nodeCount > 0, [nodeCount]);

    useEffect(() => {
        onReadyStateChange(isGraphReadyToExport);
    }, [isGraphReadyToExport, onReadyStateChange]);

    const cleanup = () => {
        const filenameInput = document.getElementById('file-name') as HTMLInputElement;
        filenameInput.value = '';

        const select = document.getElementById('export-format') as HTMLSelectElement;
        select.value = 'text';
    };

    const handleFormatChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setExportFormat(e.target.value as 'text' | 'json' | 'png' | 'jpg');
        setExportOptions({});
    }, []);

    const handleExport = () => {
        if (!isGraphReadyToExport || !graphRef.current) {
            return;
        }

        const fileNameInput = document.getElementById('file-name') as HTMLInputElement;
        let fileName = `${Date.now().toString()}-graphvm-export`;

        if (fileNameInput.value) {
            fileName = fileNameInput.value
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

            const json = graphRef.current.json() as CytoscapeJson;
            if (json.style) {
                try {
                    const plainStylesheet = sheetToPlain(json.style);
                    json.style = plainStylesheet;
                } catch (error) {
                    console.error('Error converting stylesheet to plain format:', error);
                }
            }

            dataStr = JSON.stringify(json);
            fileNameWithExt = `${fileName}.json`;
            fileType = 'application/json';
        } else if (exportFormat === 'png' || exportFormat === 'jpg') {
            let options: { full: boolean; bg: string; quality?: number } = {
                full: true,
                bg: '#ffffff',
            };

            if (exportFormat === 'jpg') {
                options = { ...options, quality: 1 };
            }

            dataStr =
                exportFormat === 'png'
                    ? graphRef.current.png(options)
                    : graphRef.current.jpg(options);
            fileNameWithExt = `${fileName}.${exportFormat}`;
            fileType = `image/${exportFormat}`;
        } else {
            dataStr = graphRef.current
                .edges()
                .map((edge) => {
                    if (!graphRef.current) return '';

                    const {
                        source: sourceId = '',
                        target: targetId = '',
                        weight = 1,
                    } = edge.data() as EdgesData;

                    const sourceLabel = graphRef.current.$id(sourceId).data('label') as string;
                    const targetLabel = graphRef.current.$id(targetId).data('label') as string;

                    const weightStr = weight !== 1 ? ' ' + weight.toString() : '';

                    return `${sourceLabel} ${targetLabel}${weightStr}`;
                })
                .join('\n');
            fileNameWithExt = `${fileName}.txt`;
            fileType = 'text/plain';
        }

        makeBlobAndDownload(dataStr, fileNameWithExt, fileType);
        onExportSuccess();
        // TODO: Show notification of successful export
    };

    useImperativeHandle(ref, () => ({ handleExport, cleanup }));

    return (
        <div className="space-y-6">
            <fieldset className="fieldset">
                <label className="text-sm font-medium text-base-content" htmlFor="file-name">
                    File Name
                </label>
                <input
                    className="input input-bordered w-full"
                    id="file-name"
                    name="file-name"
                    placeholder="{TIMESTAMP}-graphvm-export"
                    type="text"
                />
            </fieldset>

            <fieldset className="fieldset">
                <label className="text-sm font-medium text-base-content" htmlFor="export-format">
                    Export Format
                </label>
                <select
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
                                    defaultChecked={!exportOptions.fitGraph}
                                    id="option-fit-graph"
                                    onChange={(e) => {
                                        setExportOptions({
                                            ...exportOptions,
                                            fitGraph: e.target.checked,
                                        });
                                    }}
                                    type="checkbox"
                                />
                                <div className="flex flex-col items-start">
                                    <span className="label-text">Fit Graph</span>
                                    <span className="font-thin">Center before exporting</span>
                                </div>
                            </label>
                            <label className="label cursor-pointer justify-start gap-3 rounded-lg border border-base-300 p-3 hover:border-accent">
                                <input
                                    className="p-2 border-0 rounded bg-transparent"
                                    defaultValue={undefined}
                                    id="option-bg-color"
                                    onChange={(e) => {
                                        setExportOptions({
                                            ...exportOptions,
                                            bgColor: e.target.value,
                                        });
                                    }}
                                    type="color"
                                />
                                <div className="flex flex-col items-start">
                                    <span className="label-text">Background Color</span>
                                    <span className="font-thin">Defaults to transparent</span>
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
