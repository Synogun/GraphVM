import { useEffect } from 'react';
import { useAnimationStore } from '@/stores/animationStore';

export function useAnimationPlayback(tabId: string | undefined): void {
    const status = useAnimationStore((s) =>
        tabId ? (s.tabs[tabId]?.status ?? 'idle') : 'idle'
    );
    const speed = useAnimationStore((s) =>
        tabId ? (s.tabs[tabId]?.speed ?? 1) : 1
    );
    const hasAnimation = useAnimationStore((s) =>
        tabId ? Boolean(s.tabs[tabId]?.animation) : false
    );

    useEffect(() => {
        if (!tabId || status !== 'playing' || !hasAnimation) return;

        const intervalMs = Math.round(1000 / speed);
        const interval = setInterval(() => {
            const store = useAnimationStore.getState();
            if (store.tabs[tabId]?.status === 'playing') {
                store.stepForward(tabId);
            }
        }, intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [tabId, status, speed, hasAnimation]);
}
