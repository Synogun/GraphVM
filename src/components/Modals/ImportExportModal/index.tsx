import { AppIcons } from '@/components/common/AppIcons';
import { Tabs, type TabItem } from '@/components/common/tabs';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { arrangeGraph } from '@/services/layoutService';
import { useLayoutProperties, useModals } from '@Contexts';
import { Modal } from '@Modals';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ExportTab } from './ExportTab';
import { ImportTab } from './ImportTab';

type ImportTabRef = {
    handleImport: () => void;
    cleanup: () => void;
};

type ExportTabRef = {
    handleExport: () => void;
    cleanup: () => void;
};

type ImportExportTabId = 'import' | 'export';

export function ImportExportModal() {
    const modals = useModals();
    const graphRef = useGetGraph('main-graph');
    const { current: currentLayout } = useLayoutProperties();

    const [activeTab, setActiveTab] = useState<ImportExportTabId>('import');
    const [isActionReady, setIsActionReady] = useState(false);

    const exportTabRef = useRef<ExportTabRef>(null);
    const importTabRef = useRef<ImportTabRef>(null);

    const tabConfig = useMemo<TabItem<ImportExportTabId>[]>(
        () => [
            { id: 'import', label: 'Import', icon: <AppIcons.Import size={16} /> },
            { id: 'export', label: 'Export', icon: <AppIcons.Export size={16} /> },
        ],
        []
    );

    const handleClose = () => {
        if (activeTab === 'import') {
            importTabRef.current?.cleanup();
        } else {
            exportTabRef.current?.cleanup();
        }
        setActiveTab('import');
        modals.setIsImportExportModalOpen(false);

        if (!graphRef.current) {
            return;
        }

        arrangeGraph(graphRef.current, currentLayout);
    };

    const handleAction = () => {
        if (activeTab === 'import') {
            importTabRef.current?.handleImport();
        } else {
            exportTabRef.current?.handleExport();
        }
    };

    const handleReadyStateChange = useCallback((isReady: boolean) => {
        setIsActionReady(isReady);
    }, []);

    return (
        <Modal
            id="import-export-modal"
            onClose={handleClose}
            show={modals.isImportExportModalOpen}
            title="Import / Export Graph"
            actions={
                <>
                    <button
                        className="btn btn-ghost"
                        onClick={handleClose}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-accent"
                        disabled={!isActionReady}
                        onClick={handleAction}
                        type="button"
                    >
                        {activeTab === 'import' ? 'Import' : 'Export'}
                    </button>
                </>
            }
        >
            <p className="text-base-content/70">
                Manage your graph data by importing or exporting in various formats.
            </p>
            <main className="grow pt-3">
                <Tabs
                    tabs={tabConfig}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    name="import-export-modal-tabs"
                />
                <div className="pt-6 pb-4">
                    {activeTab === 'import' && (
                        <ImportTab
                            ref={importTabRef}
                            onImportSuccess={handleClose}
                            onReadyStateChange={handleReadyStateChange}
                        />
                    )}
                    {activeTab === 'export' && (
                        <ExportTab
                            ref={exportTabRef}
                            onExportSuccess={handleClose}
                            onReadyStateChange={handleReadyStateChange}
                        />
                    )}
                </div>
            </main>
        </Modal>
    );
}
