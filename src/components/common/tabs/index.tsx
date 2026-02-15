import { type ReactNode } from 'react';

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

export function Tabs<T extends string>({
    tabs,
    activeTab,
    onTabChange,
    name,
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

                const labelClasses = [
                    'tab',
                    isActive ? 'tab-active' : '',
                    isDisabled ? 'opacity-50 cursor-not-allowed' : '',
                    'select-none',
                ]
                    .filter(Boolean)
                    .join(' ');

                return (
                    <label
                        key={tab.id}
                        className={labelClasses}
                        aria-disabled={isDisabled}
                    >
                        <input
                            type="radio"
                            name={name}
                            checked={isActive}
                            onChange={() => {
                                if (!isDisabled) {
                                    onTabChange(tab.id);
                                }
                            }}
                            disabled={isDisabled}
                            className="hidden"
                        />
                        {tab.icon ? (
                            <span className="mr-2 inline-flex items-center">
                                {tab.icon}
                            </span>
                        ) : null}
                        {tab.label}
                    </label>
                );
            })}
        </div>
    );
}
