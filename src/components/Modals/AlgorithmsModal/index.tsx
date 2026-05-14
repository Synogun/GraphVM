import { AppIcons } from '@/components/common/AppIcons';
import { Tabs, type TabItem } from '@/components/common/tabs';
import { useModals } from '@Contexts';
import { Logger } from '@Logger';
import { Modal } from '@Modals/Modal';
import { useMemo, useRef, useState } from 'react';
import { GenerationTab, type GenerationTabRef } from './GenerationTab';
import { TraversalTab, type TraversalTabRef } from './TraversalTab';

const logger = Logger.createContextLogger('AlgorithmsModal');

type AlgorithmTabId = 'generative' | 'traversal';
// TODO: Add more tabs like pathfinding, optimization, etc. in the future

export function AlgorithmsModal() {
    const { isAlgorithmsModalOpen, setIsAlgorithmsModalOpen } = useModals();
    const [activeTab, setActiveTab] = useState<AlgorithmTabId>('generative');
    const generationTabRef = useRef<GenerationTabRef>(null);
    const traversalTabRef = useRef<TraversalTabRef>(null);

    const tabConfig = useMemo<TabItem<AlgorithmTabId>[]>(
        () => [
            {
                id: 'generative',
                label: 'Generative',
                icon: <AppIcons.NewGraph size={16} />, // spacing handled by Tabs component
            },
            {
                id: 'traversal',
                label: 'Traversal',
                icon: <AppIcons.PathEdgeMode size={16} />,
            },
        ],
        []
    );

    const handleClose = () => {
        setIsAlgorithmsModalOpen(false);
    };

    const handleRun = () => {
        switch (activeTab) {
            case 'generative':
                generationTabRef.current?.handleRun();
                break;
            case 'traversal':
                traversalTabRef.current?.handleRun();
                break;
            default:
                logger.warn('Unknown active tab:', activeTab);
        }

        handleClose();
    };

    const modalActions = (
        <>
            <button className="btn btn-ghost" onClick={handleClose}>
                Cancel
            </button>
            <button className="btn btn-accent" onClick={handleRun}>
                Run
            </button>
        </>
    );
    return (
        <Modal
            id="algorithms-modal"
            title="Algorithms"
            subtitle="Generate common graph families or run algorithms on your graph."
            show={isAlgorithmsModalOpen}
            onClose={handleClose}
            actions={modalActions}
        >
            <main className="grow">
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
                    {activeTab === 'traversal' && (
                        <TraversalTab ref={traversalTabRef} />
                    )}
                </div>
            </main>
        </Modal>
    );
}
