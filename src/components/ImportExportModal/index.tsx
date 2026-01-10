import { useModals } from '@/contexts/ModalsContext';
import { useCallback, useRef, useState } from 'react';
import Modal from '../common/Modal';
import { ExportTab } from './ExportTab';
import { ImportTab } from './ImportTab';
import { TabBtn } from './TabBtn';
import { useGetGraph } from '@/hooks/useGraphRegistry';

type ImportTabRef = {
    handleImport: () => void;
    cleanup: () => void;
};

type ExportTabRef = {
    handleExport: () => void;
    cleanup: () => void;
};

export function ImportExportModal() {
    const modals = useModals();
    const graph = useGetGraph('main-graph');

    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
    const [isActionReady, setIsActionReady] = useState(
        activeTab === 'export' && graph !== null && graph.nodes().length > 0
    );

    const exportTabRef = useRef<ExportTabRef>(null);
    const importTabRef = useRef<ImportTabRef>(null);

    const handleClose = () => {
        if (activeTab === 'import') {
            importTabRef.current?.cleanup();
        } else {
            exportTabRef.current?.cleanup();
        }
        setActiveTab('import');
        modals.setIsImportExportModalOpen(false);
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
                    <button className="btn btn-ghost" onClick={handleClose} type="button">
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
            <main className="flex-grow pt-3">
                <div className="border-b border-base-300">
                    <nav aria-label="Tabs" className="flex space-x-5">
                        <TabBtn activeTab={activeTab} setActiveTab={setActiveTab} type="import" />
                        <TabBtn activeTab={activeTab} setActiveTab={setActiveTab} type="export" />
                    </nav>
                </div>
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
