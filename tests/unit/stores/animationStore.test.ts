import { beforeEach, describe, expect, it } from 'vitest';
import { useAnimationStore } from '@/stores/animationStore';
import type { BFSAnimation } from '@/types/algorithms/animationTypes';

const TAB = 'graph-tab-1';

const mockAnimation: BFSAnimation = {
    algorithm: 'bfs',
    params: { algorithm: 'bfs', startNodeId: 'a', directed: false, onlySelected: false, graphNodeIds: ['a', 'b'] },
    steps: [
        { operation: 'enqueue', nodeId: 'a', currentNode: 'a', visited: [], frontier: ['a'], metrics: { depth: { a: 0 } } },
        { operation: 'dequeue', nodeId: 'a', currentNode: 'a', visited: [], frontier: [], metrics: { depth: { a: 0 } } },
        { operation: 'visit',   nodeId: 'a', currentNode: 'a', visited: ['a'], frontier: [], metrics: { depth: { a: 0 } } },
    ],
};

describe('animationStore', () => {
    beforeEach(() => {
        useAnimationStore.setState({ tabs: {} });
    });

    it('initAnimation creates tab with idle status and animation set', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        const tab = useAnimationStore.getState().tabs[TAB]!;
        expect(tab.status).toBe('idle');
        expect(tab.animation).toEqual(mockAnimation);
        expect(tab.currentStepIndex).toBe(0);
    });

    it('play sets status to playing', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().play(TAB);
        expect(useAnimationStore.getState().tabs[TAB]!.status).toBe('playing');
    });

    it('pause sets status to paused', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().play(TAB);
        useAnimationStore.getState().pause(TAB);
        expect(useAnimationStore.getState().tabs[TAB]!.status).toBe('paused');
    });

    it('stop resets tab to idle with no animation', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().play(TAB);
        useAnimationStore.getState().stop(TAB);
        const tab = useAnimationStore.getState().tabs[TAB]!;
        expect(tab.status).toBe('idle');
        expect(tab.animation).toBeNull();
        expect(tab.currentStepIndex).toBe(0);
    });

    it('stepForward increments currentStepIndex', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().stepForward(TAB);
        expect(useAnimationStore.getState().tabs[TAB]!.currentStepIndex).toBe(1);
    });

    it('stepForward at last step sets status to finished', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().stepForward(TAB); // index 1
        useAnimationStore.getState().stepForward(TAB); // index 2 (last)
        useAnimationStore.getState().stepForward(TAB); // should not exceed
        const tab = useAnimationStore.getState().tabs[TAB]!;
        expect(tab.status).toBe('finished');
        expect(tab.currentStepIndex).toBe(2);
    });

    it('stepBackward decrements currentStepIndex', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().stepForward(TAB);
        useAnimationStore.getState().stepBackward(TAB);
        expect(useAnimationStore.getState().tabs[TAB]!.currentStepIndex).toBe(0);
    });

    it('stepBackward does not go below 0', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().stepBackward(TAB);
        expect(useAnimationStore.getState().tabs[TAB]!.currentStepIndex).toBe(0);
    });

    it('setSpeed updates speed for tab', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().setSpeed(TAB, 2);
        expect(useAnimationStore.getState().tabs[TAB]!.speed).toBe(2);
    });

    it('cleanupTab removes the tab', () => {
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().cleanupTab(TAB);
        expect(useAnimationStore.getState().tabs[TAB]).toBeUndefined();
    });

    it('multiple tabs are isolated', () => {
        const TAB2 = 'graph-tab-2';
        useAnimationStore.getState().initAnimation(TAB, mockAnimation);
        useAnimationStore.getState().initAnimation(TAB2, mockAnimation);
        useAnimationStore.getState().play(TAB);
        expect(useAnimationStore.getState().tabs[TAB]!.status).toBe('playing');
        expect(useAnimationStore.getState().tabs[TAB2]!.status).toBe('idle');
    });
});
