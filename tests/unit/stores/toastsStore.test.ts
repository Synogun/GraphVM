import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastsStore } from '@/stores/toastsStore';

describe('toastsStore', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useToastsStore.setState({
            pool: [],
            _timeouts: new Map(),
            _activeKeys: new Set(),
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with empty pool', () => {
        expect(useToastsStore.getState().pool).toEqual([]);
    });

    it('addToast adds toast to pool', () => {
        useToastsStore.getState().addToast({ message: 'hello' });
        expect(useToastsStore.getState().pool).toHaveLength(1);
        expect(useToastsStore.getState().pool[0].message).toBe('hello');
    });

    it('addToast assigns unique id', () => {
        useToastsStore.getState().addToast({ message: 'a' });
        useToastsStore.getState().addToast({ message: 'b' });
        const ids = useToastsStore.getState().pool.map((t) => t.id);
        expect(ids[0]).not.toBe(ids[1]);
    });

    it('addToast deduplicates same message and type while active', () => {
        useToastsStore.getState().addToast({ message: 'dup', type: 'info' });
        useToastsStore.getState().addToast({ message: 'dup', type: 'info' });
        expect(useToastsStore.getState().pool).toHaveLength(1);
    });

    it('removeToast removes toast by id', () => {
        useToastsStore.getState().addToast({ message: 'bye' });
        const id = useToastsStore.getState().pool[0].id;
        useToastsStore.getState().removeToast(id);
        expect(useToastsStore.getState().pool).toHaveLength(0);
    });

    it('toast auto-removes after duration', () => {
        useToastsStore.getState().addToast({ message: 'temp', duration: 1000 });
        expect(useToastsStore.getState().pool).toHaveLength(1);
        vi.advanceTimersByTime(1000);
        expect(useToastsStore.getState().pool).toHaveLength(0);
    });

    it('same message can be added again after auto-removal', () => {
        useToastsStore.getState().addToast({ message: 'repeat', duration: 500 });
        vi.advanceTimersByTime(500);
        useToastsStore.getState().addToast({ message: 'repeat', duration: 500 });
        expect(useToastsStore.getState().pool).toHaveLength(1);
    });

    it('removeToast cancels auto-removal timeout', () => {
        useToastsStore.getState().addToast({ message: 'cancel-me', duration: 1000 });
        const id = useToastsStore.getState().pool[0].id;
        useToastsStore.getState().removeToast(id);
        vi.advanceTimersByTime(1000);
        expect(useToastsStore.getState().pool).toHaveLength(0);
    });
});
