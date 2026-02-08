import { AppIcons } from '@/components/common/AppIcons';
import { useModals } from '@/contexts/ModalsContext';
import { Modal } from '@Modals';
import { useRef, useState } from 'react';
import { GenerationTab, type GenerationTabRef } from './GenerationTab';

type Tabs = 'generative' | 'traversal'; // TODO: Add more tabs like pathfinding, optimization, etc. in the future

export function AlgorithmsModal() {
    const { isAlgorithmsModalOpen, setIsAlgorithmsModalOpen } = useModals();
    const [activeTab, setActiveTab] = useState<Tabs>('generative');
    const generationTabRef = useRef<GenerationTabRef>(null);

    const isActiveTab = (tab: Tabs) => (activeTab === tab ? 'tab-active' : '');

    const handleClose = () => {
        setIsAlgorithmsModalOpen(false);
    };

    const handleRun = () => {
        if (activeTab === 'generative') {
            generationTabRef.current?.handleRun();
        }
        // handleClose(); // Optional: Close on run or wait for success?
        // Usually better to let the operation close it or show feedback, but for now we follow ImportExport pattern
        handleClose();
    };

    return (
        <Modal
            id="algorithms-modal"
            title="Algorithms"
            show={isAlgorithmsModalOpen}
            onClose={handleClose}
            actions={
                <>
                    <button className="btn btn-ghost" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleRun}>
                        Run
                    </button>
                </>
            }
        >
            <p className="text-base-content/70">
                Generate common graph families or run algorithms on your graph.
            </p>

            <div
                role="tablist"
                className="tabs tabs-border border-b border-base-300"
            >
                {/* Generative Tab */}
                <label className={`tab ${isActiveTab('generative')}`}>
                    <input
                        type="radio"
                        name="algorithms-modal-tabs"
                        checked={activeTab === 'generative'}
                        onChange={() => {
                            setActiveTab('generative');
                        }}
                        className="hidden" // Hiding input to style label via tab class
                    />
                    <AppIcons.NewGraph size={16} className="mr-2" />
                    Generative
                </label>
                {/* Placeholder for future tabs */}
                <label className={`tab ${isActiveTab('traversal')}`}>
                    <input type="radio" name="algorithms-modal-tabs" disabled />
                    <AppIcons.PathEdgeMode size={16} className="mr-2" />
                    Traversal (Soon)
                </label>
            </div>

            <div className="mt-4">
                {activeTab === 'generative' && (
                    <GenerationTab ref={generationTabRef} />
                )}
                {/* {activeTab === 'traversal' && ( 
                    <TraversalTab ref={traversalTabRef} />
                )} */}
            </div>
        </Modal>
    );
}
