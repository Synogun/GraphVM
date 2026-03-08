import type { ReactNode } from 'react';

export function Tabs<T extends string>({
    tabs,
    activeTab,
    onTabChange,
    className,
}: TabsProps<T>) {
    return (
        <div
            role="tablist"
            className={`tabs tabs-border border-b border-base-300 ${className ?? ''}`.trim()}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isDisabled = Boolean(tab.disabled);

                return (
                    <button
                        key={tab.id}
                        role="tab"
                        type="button"
                        aria-selected={isActive}
                        aria-disabled={isDisabled}
                        disabled={isDisabled}
                        className={[
                            'tab',
                            isActive ? 'tab-active' : '',
                            isDisabled ? 'tab-disabled' : '',
                            'gap-2',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        onClick={() => {
                            onTabChange(tab.id);
                        }}
                    >
                        {tab.icon ? (
                            <span className="inline-flex items-center">
                                {tab.icon}
                            </span>
                        ) : null}
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export type TabItem<T extends string> = {
    id: T;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
};

export type TabsProps<T extends string> = {
    tabs: TabItem<T>[];
    activeTab: T;
    onTabChange: (tab: T) => void;
    name: string;
    className?: string;
};
