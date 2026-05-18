import { useGetGraph } from '@/hooks';
import { updateNodes } from '@/services/graph';
import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { useModals, useToasts } from '@Contexts';
import { TextInput } from '@Inputs';
import { Modal } from '@Modals/Modal';
import { useLayoutEffect, useState } from 'react';

export function NodeLabelModal() {
    const { isNodeLabelModalOpen } = useModals();
    if (!isNodeLabelModalOpen) return null;
    return <NodeLabelModalContent />;
}

function NodeLabelModalContent() {
    const { setIsNodeLabelModalOpen } = useModals();
    const { addToast } = useToasts();
    const graphRef = useGetGraph('main-graph');
    const selectedNodes = useGraphSelectionStore((s) => s.selectedNodes);

    const [labelMap, setLabelMap] = useState<Record<string, string>>({});

    useLayoutEffect(() => {
        const core = graphRef.current;
        setLabelMap(
            Object.fromEntries(
                selectedNodes.map((nodeId) => [
                    nodeId,
                    core ? (core.$id(nodeId).data('label') as string) : '',
                ])
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps -- mount initializer: reads Cytoscape once when modal opens; intentionally omits graphRef/selectedNodes
    }, []);

    const handleClose = () => {
        setIsNodeLabelModalOpen(false);
    };

    const handleConfirm = () => {
        const core = graphRef.current;
        if (!core) {
            addToast({ type: 'error', message: 'Graph not available.' });
            return;
        }

        for (const [nodeId, newLabel] of Object.entries(labelMap)) {
            if (newLabel === '') {
                continue;
            }
            updateNodes(core, [nodeId], 'label', newLabel);
        }

        setIsNodeLabelModalOpen(false);
    };

    const modalActions = (
        <>
            <button className="btn btn-ghost" onClick={handleClose}>
                Cancel
            </button>
            <button className="btn btn-accent" onClick={handleConfirm}>
                Confirm
            </button>
        </>
    );

    return (
        <Modal
            id="node-label-modal"
            title="Edit Labels"
            subtitle="Edit the label of each selected node individually."
            show={true}
            onClose={handleClose}
            actions={modalActions}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {selectedNodes.map((nodeId) => (
                    <TextInput
                        key={nodeId}
                        label={`Node ${nodeId}`}
                        value={labelMap[nodeId] ?? ''}
                        onChange={(e) => {
                            setLabelMap((prev) => ({
                                ...prev,
                                [nodeId]: e.target.value,
                            }));
                        }}
                        allowClear={false}
                    />
                ))}
            </div>
        </Modal>
    );
}
