import { useAnimationStore } from '@/stores/animationStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';

export function useAnimationLock() {
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const status = useAnimationStore((s) => s.tabs[activeTabId]?.status ?? 'idle');
    const isLocked = status !== 'idle';
    return {
        isLocked,
        lockTooltip: isLocked ? 'Stop animation to edit the graph' : undefined,
    } as const;
}
