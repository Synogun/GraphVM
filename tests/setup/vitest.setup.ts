import { afterAll, beforeEach, vi } from 'vitest';

const localStorageMock: Storage = (() => {
    const store = new Map<string, string>();

    return {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
            store.set(key, value);
        },
        removeItem: (key: string) => {
            store.delete(key);
        },
        clear: () => {
            store.clear();
        },
        get length() {
            return store.size;
        },
        key: (index: number) => Array.from(store.keys())[index] ?? null,
    };
})();

vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
    localStorage.clear();
});

afterAll(() => {
    vi.unstubAllGlobals();
});
