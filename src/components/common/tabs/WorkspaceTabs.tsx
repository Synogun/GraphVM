import { AppIcons } from '@/components/common/AppIcons';
import { useCallback, useEffect, useRef, useState } from 'react';

export function WorkspaceTabs<T extends string>({
    tabs,
    activeTab,
    onTabChange,
    onTabClose,
    onTabRename,
    className,
}: Readonly<WorkspaceTabsProps<T>>) {
    const [editingTabId, setEditingTabId] = useState<T | null>(null);
    const [draftLabel, setDraftLabel] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const cancelEditing = useCallback(() => {
        setEditingTabId(null);
        setDraftLabel('');
    }, []);

    const confirmEditing = useCallback(
        (tabId: T, nextLabel: string) => {
            onTabRename(tabId, nextLabel);
            setEditingTabId(null);
            setDraftLabel('');
        },
        [onTabRename]
    );

    useEffect(() => {
        if (!editingTabId) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            const input = inputRef.current;

            if (!input || input.contains(event.target as Node)) {
                return;
            }

            confirmEditing(editingTabId, draftLabel);
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [confirmEditing, draftLabel, editingTabId]);

    useEffect(() => {
        if (!editingTabId || !inputRef.current) {
            return;
        }

        inputRef.current.focus();
        inputRef.current.select();
    }, [editingTabId]);

    return (
        <div className="min-w-0 flex-1 overflow-x-auto">
            <div
                role="tablist"
                className={`tabs tabs-border min-w-max border-b border-base-300 ${className ?? ''}`.trim()}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const isDisabled = Boolean(tab.disabled);
                    const isEditing = editingTabId === tab.id;
                    const textMask =
                        isEditing || isDisabled
                            ? undefined
                            : 'linear-gradient(to right, black calc(100% - 3rem), transparent)';

                    return (
                        <div
                            key={tab.id}
                            role="tab"
                            aria-selected={isActive}
                            aria-disabled={isDisabled}
                            tabIndex={isDisabled ? -1 : 0}
                            className={[
                                'tab group relative w-40 shrink-0 justify-start px-3',
                                isActive ? 'tab-active' : '',
                                isDisabled ? 'tab-disabled' : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            onClick={() => {
                                if (!isDisabled && !isEditing) {
                                    onTabChange(tab.id);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (
                                    !isDisabled &&
                                    !isEditing &&
                                    (event.key === 'Enter' || event.key === ' ')
                                ) {
                                    event.preventDefault();
                                    onTabChange(tab.id);
                                }
                            }}
                        >
                            {isEditing ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={draftLabel}
                                    title={
                                        'Rename tab\n' +
                                        "(Press 'Enter' to confirm, 'Escape' to cancel)"
                                    }
                                    className="input input-ghost input-sm h-7 w-full px-2 focus:outline-none"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                    onChange={(event) => {
                                        setDraftLabel(event.target.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape') {
                                            event.preventDefault();
                                            cancelEditing();
                                            return;
                                        }

                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            confirmEditing(tab.id, draftLabel);
                                        }
                                    }}
                                />
                            ) : (
                                <>
                                    <button
                                        title={
                                            `${tab.label}\n` +
                                            '(Double-click to rename)'
                                        }
                                        className={
                                            'block min-w-0 flex-1 px-2 ' +
                                            'overflow-hidden whitespace-nowrap ' +
                                            'text-left text-ellipsis'
                                        }
                                        onDoubleClick={(event) => {
                                            event.stopPropagation();
                                            setEditingTabId(tab.id);
                                            setDraftLabel(tab.label);
                                        }}
                                        style={
                                            textMask
                                                ? { maskImage: textMask }
                                                : undefined
                                        }
                                    >
                                        {tab.label}
                                    </button>

                                    <button
                                        type="button"
                                        aria-label={`Close tab`}
                                        title="Close tab"
                                        className={
                                            'btn btn-ghost btn-xs hover:btn-accent ' +
                                            'absolute top-1/2 right-4 -translate-y-1/2 ' +
                                            'border-none transition-opacity opacity-0 ' +
                                            'group-hover:opacity-100 group-focus-within:opacity-100'
                                        }
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onTabClose(tab.id);
                                        }}
                                    >
                                        {AppIcons.Close({ size: 12 })}
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export type WorkspaceTabItem<T extends string> = {
    id: T;
    label: string;
    disabled?: boolean;
};

type WorkspaceTabsProps<T extends string> = {
    tabs: WorkspaceTabItem<T>[];
    activeTab: T;
    onTabChange: (tab: T) => void;
    onTabClose: (tab: T) => void;
    onTabRename: (tab: T, name: string) => void;
    className?: string;
};
