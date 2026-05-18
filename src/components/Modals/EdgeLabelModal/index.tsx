import { useGetGraph } from '@/hooks';
import { updateEdges } from '@/services/graph';
import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { useModals, useToasts } from '@Contexts';
import { TextInput } from '@Inputs';
import { Modal } from '@Modals/Modal';
import { useLayoutEffect, useState } from 'react';

export function EdgeLabelModal() {
    const { isEdgeLabelModalOpen } = useModals();
    if (!isEdgeLabelModalOpen) return null;
    return <EdgeLabelModalContent />;
}

function EdgeLabelModalContent() {
    const { setIsEdgeLabelModalOpen } = useModals();
    const { addToast } = useToasts();
    const graphRef = useGetGraph('main-graph');
    const selectedEdges = useGraphSelectionStore((s) => s.selectedEdges);

    const [labelMap, setLabelMap] = useState<Record<string, string>>({});
    const [displayMap, setDisplayMap] = useState<Record<string, string>>({});
    const [tooltipMap, setTooltipMap] = useState<Record<string, string>>({});

    useLayoutEffect(() => {
        const core = graphRef.current;
        const labels: Record<string, string> = {};
        const display: Record<string, string> = {};
        const tooltips: Record<string, string> = {};

        for (const edgeId of selectedEdges) {
            if (core) {
                const edge = core.$id(edgeId);
                labels[edgeId] = edge.data('label') as string;
                const sourceId = edge.data('source') as string;
                const targetId = edge.data('target') as string;
                const sourceLabel = core.$id(sourceId).data('label') as string;
                const targetLabel = core.$id(targetId).data('label') as string;
                display[edgeId] = `${sourceLabel} → ${targetLabel}`;
                tooltips[edgeId] = `${sourceId} → ${targetId}`;
            } else {
                labels[edgeId] = '';
                display[edgeId] = edgeId;
            }
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLabelMap(labels);
        setDisplayMap(display);
        setTooltipMap(tooltips);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- mount initializer: reads Cytoscape once when modal opens; intentionally omits graphRef/selectedEdges
    }, []);

    const handleClose = () => {
        setIsEdgeLabelModalOpen(false);
    };

    const handleConfirm = () => {
        const core = graphRef.current;
        if (!core) {
            addToast({ type: 'error', message: 'Graph not available.' });
            return;
        }

        for (const [edgeId, newLabel] of Object.entries(labelMap)) {
            if (newLabel === '') {
                continue;
            }
            updateEdges(core, [edgeId], 'label', newLabel);
        }

        setIsEdgeLabelModalOpen(false);
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
            id="edge-label-modal"
            title="Edit Labels"
            subtitle="Edit the label of each selected edge individually."
            show={true}
            onClose={handleClose}
            actions={modalActions}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {selectedEdges.map((edgeId) => (
                    <TextInput
                        key={edgeId}
                        label={displayMap[edgeId] ?? edgeId}
                        value={labelMap[edgeId] ?? ''}
                        onChange={(e) => {
                            setLabelMap((prev) => ({
                                ...prev,
                                [edgeId]: e.target.value,
                            }));
                        }}
                        tooltip={
                            tooltipMap[edgeId]
                                ? { content: tooltipMap[edgeId] }
                                : undefined
                        }
                        allowClear={false}
                    />
                ))}
            </div>
        </Modal>
    );
}
