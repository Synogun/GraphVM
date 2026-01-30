const nonSelectedStyle =
    'border-transparent text-base-content hover:border-accent hover:text-accent';

export function TabBtn({ type, activeTab, setActiveTab }: TabBtnProps) {
    const hoverStyle =
        activeTab === type
            ? 'border-accent-content text-accent-content'
            : nonSelectedStyle;

    return (
        <a
            aria-current={activeTab === type ? 'page' : undefined}
            className={`border-b-2 px-1 pb-3 text-sm font-medium ${hoverStyle}`}
            onClick={() => {
                setActiveTab(type);
            }}
        >
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </a>
    );
}

type TabBtnProps = {
    type: 'import' | 'export';
    activeTab: 'import' | 'export';
    setActiveTab: (tab: 'import' | 'export') => void;
};
