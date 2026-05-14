import { describe, it, expect, beforeEach } from 'vitest';
import { useNodesStore } from '@/stores/nodesStore';

describe('nodesStore', () => {
    beforeEach(() => {
        useNodesStore.setState({ color: '#999999', shape: 'ellipse' });
    });

    it('initializes with default node color and shape', () => {
        const state = useNodesStore.getState();
        expect(state.color).toBe('#999999');
        expect(state.shape).toBe('ellipse');
    });

    it('setColor updates color', () => {
        useNodesStore.getState().setColor('#ff0000');
        expect(useNodesStore.getState().color).toBe('#ff0000');
    });

    it('setShape updates shape', () => {
        useNodesStore.getState().setShape('rectangle');
        expect(useNodesStore.getState().shape).toBe('rectangle');
    });

    it('setting color does not affect shape', () => {
        useNodesStore.getState().setShape('diamond');
        useNodesStore.getState().setColor('#00ff00');
        expect(useNodesStore.getState().shape).toBe('diamond');
    });
});
