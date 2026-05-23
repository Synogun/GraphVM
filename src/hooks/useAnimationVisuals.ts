import type { RefObject } from 'react';
import { useEffect } from 'react';
import { useAnimationStore } from '@/stores/animationStore';
import type { GraphInstance } from '@/types/graph';

const ANIM_CLASSES = 'anim-current anim-in-frontier anim-visited anim-active-edge';

export function useAnimationVisuals(graphRef: RefObject<GraphInstance>, tabId: string | undefined): void {
    const status = useAnimationStore((s) => (tabId ? (s.tabs[tabId]?.status ?? 'idle') : 'idle'));
    const animation = useAnimationStore((s) => (tabId ? (s.tabs[tabId]?.animation ?? null) : null));
    const currentStepIndex = useAnimationStore((s) => (tabId ? (s.tabs[tabId]?.currentStepIndex ?? 0) : 0));

    useEffect(() => {
        const core = graphRef.current;
        if (!core) return;

        core.elements().removeClass(ANIM_CLASSES);

        if (!tabId || status === 'idle' || !animation) return;

        if (currentStepIndex < 0 || currentStepIndex >= animation.steps.length) return;
        const step = animation.steps[currentStepIndex];

        for (const nodeId of step.visited) {
            core.$id(nodeId).addClass('anim-visited');
        }
        for (const nodeId of step.frontier as string[]) {
            core.$id(nodeId).addClass('anim-in-frontier');
        }
        core.$id(step.currentNode).addClass('anim-current');
        if (step.edgeId) {
            core.$id(step.edgeId).addClass('anim-active-edge');
        }
    }, [graphRef, tabId, status, animation, currentStepIndex]);
}
