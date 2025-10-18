import { useModals } from '@/contexts/ModalsContext';
import { useMemo, useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import Modal from './common/Modal';

export function ImportExportModal() {
    const modals = useModals();
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');

    return (
        <Modal
            id='import-export-modal'
            onClose={ () => { modals.setIsImportExportModalOpen(false); } }
            show={ modals.isImportExportModalOpen }
            title='Import / Export Graph'
            actions={ (<>
                <button
                    className='btn btn-ghost'
                    onClick={ () => { modals.setIsImportExportModalOpen(false); } }
                    type='button'
                >
                    Cancel
                </button>
                <button
                    className='btn btn-accent'
                    type='button'
                >
                    { activeTab === 'import' ? 'Import' : 'Export' }
                </button>
            </>) }
        >
            <p className='text-base-content/70'>Manage your graph data by importing or exporting in various formats.</p>
            <main className='flex-grow pt-3'>
                <div className='border-b border-base-300'>
                    <nav aria-label='Tabs' className='flex space-x-5'>
                        <TabBtn
                            activeTab={ activeTab }
                            setActiveTab={ setActiveTab }
                            type='import'
                        />
                        <TabBtn
                            activeTab={ activeTab }
                            setActiveTab={ setActiveTab }
                            type='export'
                        />
                    </nav>
                </div>
                <div className='py-6'>
                    { activeTab === 'import' && (
                        <div className='space-y-6'>
                            {/* TODO: Implement file upload */}
                            <div>
                                <label className='block text-sm font-medium text-base-content' htmlFor='file-upload'>Upload File</label>
                                <div className='flex justify-center mt-2 rounded-xl border-2 border-dashed border-base-300 px-6 py-5'>
                                    <div className='text-center text-sm'>
                                        <MdOutlineFileUpload className='mx-auto text-4xl text-base-content/50' />
                                        <div className='mt-4 flex items-center justify-center'>
                                            <label className='flex rounded-md font-medium text-accent cursor-pointer focus-within:outline-none focus-within:ring-5 hover:text-accent/80' htmlFor='file-upload'>
                                                <span>Upload a file</span>
                                                <input className='sr-only' id='file-upload' name='file-upload' type='file' />
                                            </label>
                                            <p className='pl-1 text-base-content/80'>or drag and drop</p>
                                        </div>
                                        <p className='mt-1 text-xs text-base-content/50'>Up to 3MB</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-base-content'>Data Preview</h3>
                                <div className='mt-2 w-full rounded-lg bg-base-200 p-4 h-32 flex items-center justify-center'>
                                    <p className='text-sm text-base-content/60'>No data to preview. Please select a file to import.</p>
                                </div>
                            </div>
                        </div>
                    ) }
                    { activeTab === 'export' && (
                        <div>
                            {/* Export content goes here */ }
                            <p>Export options will be here.</p>
                        </div>
                    ) }
                </div>
            </main>
            <footer className='flex justify-end items-center gap-3 pt-4' />
        </Modal>
    );
}

function TabBtn({ type, activeTab, setActiveTab }: TabBtnProps) {
    const hoverStyle = useMemo(() =>
        activeTab === type
            ? 'border-accent-content text-accent-content'
            : 'border-transparent text-base-content hover:border-accent hover:text-accent',
    [activeTab, type]);

    return (
        <a
            aria-current={ activeTab === type ? 'page' : undefined }
            className={ `shrink-0 border-b-2 px-1 pb-3 text-sm font-medium ${hoverStyle}` }
            onClick={ () => { setActiveTab(type); } }
        >
            { type.charAt(0).toUpperCase() + type.slice(1) }
        </a>
    );
}

type TabBtnProps = {
    type: 'import' | 'export';
    activeTab: 'import' | 'export';
    setActiveTab: (tab: 'import' | 'export') => void;
};
