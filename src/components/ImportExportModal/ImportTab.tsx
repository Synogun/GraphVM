import { useGetGraph } from '@/hooks/useGraphRegistry';
// import { ConfigService } from '@/services/ConfigService';
import { newGraph } from '@/services/GraphService';
import { isFileValid, parseTextData, type FileType } from '@/services/ImportExportService';
// import { assignDefaultElementData } from '@/utils';
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

type ImportTabProps = {
    ref: Ref<{ handleImport: () => void }>;
    onImportSuccess: () => void;
    onReadyStateChange: (isReady: boolean) => void;
};

export function ImportTab({ ref, onImportSuccess, onReadyStateChange }: ImportTabProps) {
    const graph = useGetGraph('main-graph');
    // const ConfigManager = ConfigService.getInstance();

    const [importData, setImportData] = useState<CytoscapeOptions | null>(null);
    const [previewCy, setPreviewCy] = useState<cytoscape.Core | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

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

        console.log('all file:', event.target.files);
        console.log('Selected file:', file);

        const invalidFile = (a?: string) => {
            cleanup();
            // TODO: Display error to user
            alert(`Invalid file. ${a ?? ''} Please select a JSON, CSV, or TXT file under 2MB.`);
        };

        if (!file || !isFileValid(file)) {
            invalidFile();
            return;
        }

        const content = await file.text().catch((error: unknown) => {
            console.error('Error reading file:', error);
            throw error;
        });

        const success = handleDataPreview(content, file.type as FileType);
        if (!success) {
            invalidFile('ccccccccccccccccccccccc');
        }
    };

    const handleDataPreview = (data: string, fileType: FileType) => {
        const previewOptions: Partial<CytoscapeOptions> = {
            userPanningEnabled: false,
            userZoomingEnabled: false,
            boxSelectionEnabled: false,
            autounselectify: true,
            autoungrabify: true,
        };

        let dataToImport: CytoscapeOptions;
        try {
            if (fileType === 'application/json') {
                // FUTURE: Validate JSON structure
                dataToImport = JSON.parse(data) as CytoscapeOptions;
            } else {
                const elements = parseTextData(data, fileType);
                if (elements === false) {
                    throw new SyntaxError('Invalid text data format');
                }

                dataToImport = { elements };
            }
        } catch (error) {
            console.error(`Invalid ${fileType} file\n`, error);
            return false;
        }

        let newPreviewCy: cytoscape.Core;
        try {
            newPreviewCy = newGraph('data-preview-cy', {
                ...dataToImport,
                ...previewOptions,
            });

            setPreviewCy(newPreviewCy);
        } catch (error) {
            console.error('Error initializing Cytoscape with imported data:', error);
            return false;
        }

        setImportData(dataToImport);

        console.log(
            'Cytoscape initialized with imported data:',
            newPreviewCy.elements(),
            'elements'
        );

        return true;
    };

    const handleImport = () => {
        if (!importData || !graph) {
            return;
        }

        graph.elements().remove();
        graph.json(importData as { elements: cytoscape.ElementDefinition[] });
        graph.fit();

        cleanup();
        onImportSuccess();
    };

    useImperativeHandle(ref, () => ({ handleImport, cleanup }));

    const handleFileSelectWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(event).catch((error: unknown) => {
            console.error('Error handling file select:', error);
        });
    };

    return (
        <div className="space-y-6">
            <fieldset className="fieldset">
                <label className="text-sm font-medium text-base-content" htmlFor="file-upload">
                    Upload File
                </label>
                <input
                    ref={fileInputRef}
                    className={'file-input w-full' + (!importData ? '' : ' file-input-accent')}
                    onChange={handleFileSelectWrapper}
                    type="file"
                />
                <label className="label">Max size 2MB</label>
            </fieldset>
            <h3 className="text-sm font-medium text-base-content">Data Preview</h3>
            <div className="relative p-2 text-center">
                <div className="absolute left-7 top-9 flex flex-col items-center gap-2 z-10 text-xs select-none">
                    <span id="preview-node-count">Nodes: {previewCy?.nodes().length ?? 0}</span>
                    <span id="preview-edge-count">Edges: {previewCy?.edges().length ?? 0}</span>
                </div>
                <div className="mt-2 w-full rounded-lg bg-base-300 h-100" id="data-preview-cy" />
            </div>
        </div>
    );
}
