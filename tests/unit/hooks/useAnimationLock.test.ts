import { beforeEach, describe, expect, it } from 'vitest';
import { useAnimationStore } from '@/stores/animationStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import type { BFSAnimation } from '@/types/algorithms/animationTypes';

const TAB = 'tab-1';

const mockAnimation: BFSAnimation = {
    algorithm: 'bfs',
    params: { algorithm: 'bfs', startNodeId: 'a', directed: false, onlySelected: false, graphNodeIds: ['a'] },
    steps: [
        { operation: 'enqueue', nodeId: 'a', currentNode: 'a', visited: [], frontier: ['a'], metrics: { depth: { a: 0 } } },
    ],
};

function getIsLocked(): boolean {
    const activeTabId = useGraphWorkspaceStore.getState().activeTabId;
    const status = useAnimationStore.getState().tabs[activeTabId]?.status ?? 'idle';
    return status !== 'idle';
}

describe('useAnimationLock logic', () => {
    beforeEach(() => {
        useAnimationStore.setState({ tabs: {} });
        useGraphWorkspaceStore.setState((s) => ({ ...s, activeTabId: TAB }));
    });

    it('is not locked when status is idle', () => {
        expect(getIsLocked()).toBe(false);
    });

    it('is locked when status is playing', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().play(TAB);
        expect(getIsLocked()).toBe(true);
    });

    it('is locked when status is paused', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().play(TAB);
        useAnimationStore.getState().pause(TAB);
        expect(getIsLocked()).toBe(true);
    });

    it('is locked when status is finished', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().stepForward(TAB);
        expect(getIsLocked()).toBe(true);
    });

    it('is not locked after stop', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().play(TAB);
        useAnimationStore.getState().stop(TAB);
        expect(getIsLocked()).toBe(false);
    });
});
