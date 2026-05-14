import { beforeEach, describe, expect, it } from 'vitest';
import { useGraphMetaStore } from '@/stores/graphMetaStore';

describe('graphMetaStore', () => {
    beforeEach(() => {
        useGraphMetaStore.setState({
            directed: false,
            families: [],
            nodeCount: 0,
            edgeCount: 0,
            edgeMode: 'path',
        });
    });

    it('initializes with default graph meta', () => {
        const state = useGraphMetaStore.getState();
        expect(state.directed).toBe(false);
        expect(state.families).toEqual([]);
        expect(state.nodeCount).toBe(0);
        expect(state.edgeCount).toBe(0);
        expect(state.edgeMode).toBe('path');
    });

    it('setDirected updates directed', () => {
        useGraphMetaStore.getState().setDirected(true);
        expect(useGraphMetaStore.getState().directed).toBe(true);
    });

    it('setFamilies updates families', () => {
        useGraphMetaStore.getState().setFamilies(['hlp']);
        expect(useGraphMetaStore.getState().families).toEqual(['hlp']);
    });

    it('setNodeCount updates nodeCount', () => {
        useGraphMetaStore.getState().setNodeCount(5);
        expect(useGraphMetaStore.getState().nodeCount).toBe(5);
    });

    it('setEdgeCount updates edgeCount', () => {
        useGraphMetaStore.getState().setEdgeCount(3);
        expect(useGraphMetaStore.getState().edgeCount).toBe(3);
    });

    it('setEdgeMode updates edgeMode', () => {
        useGraphMetaStore.getState().setEdgeMode('complete');
        expect(useGraphMetaStore.getState().edgeMode).toBe('complete');
    });

    it('updating one field does not affect others', () => {
        useGraphMetaStore.getState().setNodeCount(10);
        const state = useGraphMetaStore.getState();
        expect(state.directed).toBe(false);
        expect(state.edgeCount).toBe(0);
        expect(state.edgeMode).toBe('path');
    });
});
