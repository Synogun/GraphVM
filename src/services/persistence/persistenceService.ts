type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type PersistenceVersionCheck<TState> = {
    expectedVersion: number;
    getVersion: (state: TState) => number;
};

export type LoadPersistedStateOptions<TState> = {
    storageKey: string;
    fallbackState: TState;
    isValidState: (value: unknown) => value is TState;
    versionCheck?: PersistenceVersionCheck<TState>;
};

export type SavePersistedStateOptions<TState> = {
    storageKey: string;
    state: TState;
};

function getValidStorage(storageKey: string): BrowserStorage | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const storage = window.localStorage;

    if (storageKey.trim().length <= 0) {
        return null;
    }

    return storage;
}

export function hasPersistedState(storageKey: string): boolean {
    const storage = getValidStorage(storageKey);

    if (!storage) {
        return false;
    }

    try {
        return storage.getItem(storageKey) !== null;
    } catch {
        return false;
    }
}

export function loadPersistedState<TState>({
    storageKey,
    fallbackState,
    isValidState,
    versionCheck,
}: LoadPersistedStateOptions<TState>): TState {
    const storage = getValidStorage(storageKey);

    if (!storage) {
        return fallbackState;
    }

    try {
        const raw = storage.getItem(storageKey);

        if (!raw) {
            return fallbackState;
        }

        const parsed: unknown = JSON.parse(raw);

        if (!isValidState(parsed)) {
            return fallbackState;
        }

        if (versionCheck) {
            const currentVersion = versionCheck.getVersion(parsed);

            if (currentVersion !== versionCheck.expectedVersion) {
                return fallbackState;
            }
        }

        return parsed;
    } catch {
        return fallbackState;
    }
}

export function savePersistedState<TState>({
    storageKey,
    state,
}: SavePersistedStateOptions<TState>): boolean {
    const storage = getValidStorage(storageKey);

    if (!storage) {
        return false;
    }

    try {
        const serialized = JSON.stringify(state);
        storage.setItem(storageKey, serialized);
        return true;
    } catch {
        return false;
    }
}

export function clearPersistedState(storageKey: string): boolean {
    const storage = getValidStorage(storageKey);

    if (!storage) {
        return false;
    }

    try {
        storage.removeItem(storageKey);
        return true;
    } catch {
        return false;
    }
}
