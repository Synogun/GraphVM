import type { RefObject } from 'react';
import { useEffect } from 'react';
import { useAnimationStore } from '@/stores/animationStore';
import type { GraphInstance } from '@/types/graph';
import type { EdgeColoringStep, BFSStep } from '@/types';

const ANIM_CLASSES = 'anim-current anim-in-frontier anim-visited anim-active-edge anim-fan-vertex';

export function useAnimationVisuals(
    graphRef: RefObject<GraphInstance>,
    tabId: string | undefined
): void {
    const status = useAnimationStore((s) =>
        tabId ? (s.tabs[tabId]?.status ?? 'idle') : 'idle'
    );
    const animation = useAnimationStore((s) =>
        tabId ? (s.tabs[tabId]?.animation ?? null) : null
    );
    const currentStepIndex = useAnimationStore((s) =>
        tabId ? (s.tabs[tabId]?.currentStepIndex ?? 0) : 0
    );

    useEffect(() => {
        const core = graphRef.current;
        if (!core) return;

        core.elements().removeClass(ANIM_CLASSES);
        core.edges().removeData('animColor');

        if (!tabId || status === 'idle' || !animation) return;

        if (currentStepIndex < 0 || currentStepIndex >= animation.steps.length)
            return;
        const step = animation.steps[currentStepIndex];

        if (animation.algorithm === 'misra-gries' || animation.algorithm === 'hlp-edge-coloring') {
            const colorStep = step as EdgeColoringStep;
            for (const [eid, colorIdx] of Object.entries(colorStep.colorAssignments)) {
                const hex = animation.palette[colorIdx];
                if (hex) core.$id(eid).data('animColor', hex);
            }
            if (colorStep.edgeId) core.$id(colorStep.edgeId).addClass('anim-active-edge');
            for (const vid of colorStep.fanVertexIds) {
                core.$id(vid).addClass('anim-fan-vertex');
            }
        } else {
            // Existing traversal logic
            const traversalStep = step as BFSStep;
            for (const nodeId of traversalStep.visited) {
                core.$id(nodeId).addClass('anim-visited');
            }
            for (const nodeId of traversalStep.frontier as string[]) {
                core.$id(nodeId).addClass('anim-in-frontier');
            }
            core.$id(traversalStep.currentNode).addClass('anim-current');
            if (traversalStep.edgeId) {
                core.$id(traversalStep.edgeId).addClass('anim-active-edge');
            }
        }
    }, [graphRef, tabId, status, animation, currentStepIndex]);
}
