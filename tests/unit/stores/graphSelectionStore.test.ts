import { useGraphSelectionStore } from '@/stores/graphSelectionStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('graphSelectionStore', () => {
    beforeEach(() => {
        useGraphSelectionStore.setState({
            selectedNodes: [],
            selectedEdges: [],
            selectionInfo: { group: 'none' },
        });
    });

    it('initializes with empty selection', () => {
        const state = useGraphSelectionStore.getState();
        expect(state.selectedNodes).toEqual([]);
        expect(state.selectedEdges).toEqual([]);
        expect(state.selectionInfo).toEqual({ group: 'none' });
    });

    it('setSelectedNodes updates selected nodes', () => {
        useGraphSelectionStore.getState().setSelectedNodes(['n-1', 'n-2']);
        expect(useGraphSelectionStore.getState().selectedNodes).toEqual([
            'n-1',
            'n-2',
        ]);
    });

    it('setSelectedEdges updates selected edges', () => {
        useGraphSelectionStore.getState().setSelectedEdges(['e-1']);
        expect(useGraphSelectionStore.getState().selectedEdges).toEqual(['e-1']);
    });

    it('setSelectionInfo updates selection info', () => {
        useGraphSelectionStore.getState().setSelectionInfo({
            group: 'node',
            label: 'A',
            isGhost: false,
        });
        expect(useGraphSelectionStore.getState().selectionInfo).toEqual({
            group: 'node',
            label: 'A',
            isGhost: false,
        });
    });

    it('setting nodes does not affect edges state', () => {
        useGraphSelectionStore.getState().setSelectedEdges(['e-1']);
        useGraphSelectionStore.getState().setSelectedNodes(['n-1']);
        expect(useGraphSelectionStore.getState().selectedEdges).toEqual(['e-1']);
    });

    it('setting edges does not affect nodes state', () => {
        useGraphSelectionStore.getState().setSelectedNodes(['n-1']);
        useGraphSelectionStore.getState().setSelectedEdges(['e-1']);
        expect(useGraphSelectionStore.getState().selectedNodes).toEqual(['n-1']);
    });

    it('clears selection by setting empty arrays', () => {
        useGraphSelectionStore.getState().setSelectedNodes(['n-1']);
        useGraphSelectionStore.getState().setSelectedEdges(['e-1']);
        useGraphSelectionStore.getState().setSelectedNodes([]);
        useGraphSelectionStore.getState().setSelectedEdges([]);
        const state = useGraphSelectionStore.getState();
        expect(state.selectedNodes).toEqual([]);
        expect(state.selectedEdges).toEqual([]);
    });
});
