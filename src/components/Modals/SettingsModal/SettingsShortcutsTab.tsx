import { DefaultSettingsData } from '@/constants/settingsDefaults';
import type { SettingsData, ShortcutAction } from '@/types/settings';
import { useState, type KeyboardEvent } from 'react';

const SHORTCUT_FIELDS: {
    action: ShortcutAction;
    label: string;
    hint: string;
}[] = [
    {
        action: 'deleteSelected',
        label: 'Delete selected',
        hint: 'Remove currently selected elements.',
    },
    {
        action: 'deselectAll',
        label: 'Deselect all',
        hint: 'Clear active node and edge selections.',
    },
    {
        action: 'selectAll',
        label: 'Select all',
        hint: 'Select all nodes and edges in the current graph.',
    },
    {
        action: 'newGraph',
        label: 'New graph',
        hint: 'Reset and start with an empty graph.',
    },
    {
        action: 'addNode',
        label: 'Add node',
        hint: 'Insert a node using current defaults.',
    },
    {
        action: 'addEdges',
        label: 'Add edges',
        hint: 'Connect currently selected nodes.',
    },
];

export function SettingsShortcutsTab({
    shortcuts,
    setShortcuts,
}: SettingsShortcutsTabProps) {
    const [capturingAction, setCapturingAction] = useState<ShortcutAction | null>(
        null
    );

    const handleKeyCapture =
        (action: ShortcutAction) => (event: KeyboardEvent<HTMLButtonElement>) => {
            event.preventDefault();
            event.stopPropagation();

            const normalized = formatShortcut(event);

            if (normalized.length === 0) {
                return;
            }

            setShortcuts({
                ...shortcuts,
                [action]: normalized,
            });

            setCapturingAction(null);
            event.currentTarget.blur();
        };

    const handleResetShortcut = (action: ShortcutAction) => {
        setShortcuts({
            ...shortcuts,
            [action]: DefaultSettingsData.shortcuts[action],
        });

        if (capturingAction === action) {
            setCapturingAction(null);
        }
    };

    const handleCaptureStart = (action: ShortcutAction) => {
        setCapturingAction(action);
    };

    const handleCaptureEnd = (action: ShortcutAction) => {
        if (capturingAction === action) {
            setCapturingAction(null);
        }
    };

    const renderShortcutPreview = (value: string) => {
        const parts = value.split('+').filter(Boolean);

        return (
            <span className="flex flex-wrap items-center gap-1.5">
                {parts.map((part, index) => (
                    <kbd
                        key={`${value}-${part}-${index.toString()}`}
                        className="kbd kbd-sm"
                    >
                        {part}
                    </kbd>
                ))}
            </span>
        );
    };

    return (
        <section className="space-y-5 py-4">
            <p className="text-sm text-base-content/70">
                Click any shortcut input, then press the desired key combination.
                <br />
                The pressed combination is captured and formatted automatically.
            </p>

            <h4 className="text-xs font-semibold uppercase tracking-wide text-base-content/70">
                Current Bindings
            </h4>
            <section className="rounded-box border border-base-300 bg-base-200/40 p-3">
                <div className="flex flex-wrap gap-2">
                    {SHORTCUT_FIELDS.map(({ action, label }) => (
                        <div
                            key={`preview-${action}`}
                            className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-2.5 py-1.5"
                        >
                            <span className="text-xs font-medium text-base-content/80">
                                {label}
                            </span>
                            {renderShortcutPreview(shortcuts[action])}
                        </div>
                    ))}
                </div>
            </section>

            <h4 className="text-xs font-semibold uppercase tracking-wide text-base-content/70">
                Edit Bindings
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
                {SHORTCUT_FIELDS.map(({ action, label, hint }) => {
                    const isCapturing = capturingAction === action;

                    return (
                        <article
                            key={action}
                            className="rounded-box  border-base-300 bg-base-100 p-3"
                        >
                            <div className="mb-2 flex items-start justify-between gap-3">
                                <div>
                                    <h4 className="text-sm font-semibold">
                                        {label}
                                    </h4>
                                    <p className="text-xs text-base-content/70">
                                        {hint}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-ghost btn-xs"
                                    onClick={() => {
                                        handleResetShortcut(action);
                                    }}
                                >
                                    Reset
                                </button>
                            </div>

                            <button
                                type="button"
                                className={`input input-bordered w-full h-auto min-h-12 justify-between gap-3 px-3 py-2 text-left transition-colors ${
                                    isCapturing
                                        ? 'input-accent ring-2 ring-accent/30'
                                        : ''
                                }`}
                                onClick={() => {
                                    handleCaptureStart(action);
                                }}
                                onFocus={() => {
                                    handleCaptureStart(action);
                                }}
                                onBlur={() => {
                                    handleCaptureEnd(action);
                                }}
                                onKeyDown={handleKeyCapture(action)}
                            >
                                {renderShortcutPreview(shortcuts[action])}
                                {isCapturing ? (
                                    <span className="text-xs font-semibold text-accent">
                                        Listening...
                                    </span>
                                ) : (
                                    <span className="text-xs text-base-content/60">
                                        Click to capture
                                    </span>
                                )}
                            </button>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

function formatShortcut(event: KeyboardEvent<HTMLButtonElement>): string {
    const key = normalizeKey(event.key);

    // Keep listening while only modifier keys are pressed.
    if (isModifierOnlyKey(key)) {
        return '';
    }

    const parts: string[] = [];

    if (event.ctrlKey) {
        parts.push('Ctrl');
    }

    if (event.metaKey) {
        parts.push('Meta');
    }

    if (event.altKey) {
        parts.push('Alt');
    }

    if (event.shiftKey) {
        parts.push('Shift');
    }

    parts.push(key);

    return parts.join('+');
}

function normalizeKey(key: string): string {
    const keyMap: Record<string, string> = {
        ' ': 'Space',
        Escape: 'Escape',
        Esc: 'Escape',
        Enter: 'Enter',
        Tab: 'Tab',
        Backspace: 'Backspace',
        Delete: 'Delete',
        ArrowUp: 'ArrowUp',
        ArrowDown: 'ArrowDown',
        ArrowLeft: 'ArrowLeft',
        ArrowRight: 'ArrowRight',
    };

    if (key in keyMap) {
        return keyMap[key];
    }

    if (key.length === 1) {
        return key.toUpperCase();
    }

    return key.charAt(0).toUpperCase() + key.slice(1);
}

function isModifierOnlyKey(key: string): boolean {
    return key === 'Control' || key === 'Meta' || key === 'Alt' || key === 'Shift';
}

type SettingsShortcutsTabProps = {
    shortcuts: SettingsData['shortcuts'];
    setShortcuts: (shortcuts: SettingsData['shortcuts']) => void;
};
