import { create } from 'zustand';
import type {
    AlgorithmAnimation,
    PlaybackStatus,
} from '@/types/algorithms/animationTypes';
import { lzLoad, lzSave } from '@/utils/lzStorage';

export type TabAnimationState = {
    status: PlaybackStatus;
    animation: AlgorithmAnimation | null;
    currentStepIndex: number;
    speed: number;
};

type AnimationStore = {
    tabs: Partial<Record<string, TabAnimationState>>;
    initAnimation: (tabId: string, animation: AlgorithmAnimation) => void;
    play: (tabId: string) => void;
    pause: (tabId: string) => void;
    stop: (tabId: string) => void;
    replay: (tabId: string) => void;
    stepForward: (tabId: string) => void;
    stepBackward: (tabId: string) => void;
    seekTo: (tabId: string, stepIndex: number) => void;
    setSpeed: (tabId: string, speed: number) => void;
    cleanupTab: (tabId: string) => void;
};

const ANIMATION_STORAGE_KEY = 'graphvm.animation.v1';

function defaultTabState(): TabAnimationState {
    return { status: 'idle', animation: null, currentStepIndex: 0, speed: 1 };
}

function loadInitialTabs(): Record<string, TabAnimationState> {
    const saved = lzLoad(ANIMATION_STORAGE_KEY) as {
        tabs: Record<string, TabAnimationState>;
    } | null;
    if (!saved?.tabs) return {};
    return Object.fromEntries(
        Object.entries(saved.tabs).map(([tabId, tab]) => [
            tabId,
            {
                ...tab,
                status:
                    tab.status === 'playing' || tab.status === 'finished'
                        ? 'paused'
                        : tab.status,
            },
        ])
    );
}

export const useAnimationStore = create<AnimationStore>()((set) => ({
    tabs: loadInitialTabs(),

    initAnimation: (tabId, animation) => {
        set((s) => ({
            tabs: { ...s.tabs, [tabId]: { ...defaultTabState(), animation } },
        }));
    },

    play: (tabId) => {
        set((s) => {
            const tab = s.tabs[tabId];
            if (!tab?.animation) return s;
            return { tabs: { ...s.tabs, [tabId]: { ...tab, status: 'playing' } } };
        });
    },

    pause: (tabId) => {
        set((s) => {
            const tab = s.tabs[tabId];
            if (!tab) return s;
            return { tabs: { ...s.tabs, [tabId]: { ...tab, status: 'paused' } } };
        });
    },

    stop: (tabId) => {
        set((s) => {
            if (!s.tabs[tabId]) return s;
            return { tabs: { ...s.tabs, [tabId]: defaultTabState() } };
        });
    },

    replay: (tabId) => {
        set((s) => {
            const tab = s.tabs[tabId];
            if (!tab?.animation) return s;
            return {
                tabs: {
                    ...s.tabs,
                    [tabId]: { ...tab, currentStepIndex: 0, status: 'playing' },
                },
            };
        });
    },

    stepForward: (tabId) => {
        set((s) => {
            const tab = s.tabs[tabId];
            if (!tab?.animation || tab.animation.steps.length === 0) return s;
            const lastIndex = tab.animation.steps.length - 1;
            if (tab.currentStepIndex >= lastIndex) {
                return {
                    tabs: {
                        ...s.tabs,
                        [tabId]: {
                            ...tab,
                            status: 'finished',
                            currentStepIndex: lastIndex,
                        },
                    },
                };
            }
            const nextIndex = tab.currentStepIndex + 1;
            const status = nextIndex >= lastIndex ? 'finished' : tab.status;
            return {
                tabs: {
                    ...s.tabs,
                    [tabId]: { ...tab, currentStepIndex: nextIndex, status },
                },
            };
        });
    },

    stepBackward: (tabId) => {
        set((s) => {
            const tab = s.tabs[tabId];
            if (!tab) return s;
            const prevIndex = Math.max(0, tab.currentStepIndex - 1);
            const status = tab.status === 'finished' ? 'paused' : tab.status;
            return {
                tabs: {
                    ...s.tabs,
                    [tabId]: { ...tab, currentStepIndex: prevIndex, status },
                },
            };
        });
    },

    seekTo: (tabId, stepIndex) => {
        set((s) => {
            const tab = s.tabs[tabId];
            if (!tab?.animation || tab.animation.steps.length === 0) return s;
            const lastIndex = tab.animation.steps.length - 1;
            const clamped = Math.max(0, Math.min(lastIndex, stepIndex));
            const isLast = clamped >= lastIndex;
            let status: PlaybackStatus;
            if (isLast) {
                status = 'finished';
            } else if (tab.status === 'finished') {
                status = 'paused';
            } else {
                status = tab.status;
            }
            return {
                tabs: {
                    ...s.tabs,
                    [tabId]: { ...tab, currentStepIndex: clamped, status },
                },
            };
        });
    },

    setSpeed: (tabId, speed) => {
        set((s) => {
            const tab = s.tabs[tabId];
            if (!tab) return s;
            return { tabs: { ...s.tabs, [tabId]: { ...tab, speed } } };
        });
    },

    cleanupTab: (tabId) => {
        set((s) => ({
            tabs: Object.fromEntries(
                Object.entries(s.tabs).filter(([id]) => id !== tabId)
            ),
        }));
    },
}));

let persistTimeout: ReturnType<typeof setTimeout> | null = null;
useAnimationStore.subscribe((state) => {
    if (persistTimeout) clearTimeout(persistTimeout);
    persistTimeout = setTimeout(() => {
        lzSave(ANIMATION_STORAGE_KEY, { tabs: state.tabs });
    }, 300);
});
