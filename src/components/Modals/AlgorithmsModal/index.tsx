import { AppIcons } from '@/components/common/AppIcons';
import { Tabs, type TabItem } from '@/components/common/tabs';
import { useModals } from '@Contexts';
import { Modal } from '@Modals';
import { useMemo, useRef, useState } from 'react';
import { GenerationTab, type GenerationTabRef } from './GenerationTab';

type AlgorithmTabId = 'generative' | 'traversal'; // TODO: Add more tabs like pathfinding, optimization, etc. in the future

export function AlgorithmsModal() {
    const { isAlgorithmsModalOpen, setIsAlgorithmsModalOpen } = useModals();
    const [activeTab, setActiveTab] = useState<AlgorithmTabId>('generative');
    const generationTabRef = useRef<GenerationTabRef>(null);

    const tabConfig = useMemo<TabItem<AlgorithmTabId>[]>(
        () => [
            {
                id: 'generative',
                label: 'Generative',
                icon: <AppIcons.NewGraph size={16} />, // spacing handled by Tabs component
            },
            {
                id: 'traversal',
                label: 'Traversal (Soon)',
                icon: <AppIcons.PathEdgeMode size={16} />,
                disabled: true,
            },
        ],
        []
    );

    const handleClose = () => {
        setIsAlgorithmsModalOpen(false);
    };

    const handleRun = () => {
        if (activeTab === 'generative') {
            generationTabRef.current?.handleRun();
        }

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

            <Tabs
                tabs={tabConfig}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                name="algorithms-modal-tabs"
            />

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
