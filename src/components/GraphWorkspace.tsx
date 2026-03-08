import { AppIcons } from '@/components/common/AppIcons';
import { WorkspaceTabs } from '@/components/common/tabs';
import { useGraphMutation } from '@/hooks/useGraphMutation';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { useGraphWorkspace } from '@Contexts';
import { useEffect } from 'react';
import { GraphCanvas } from './GraphCanvas';

const MAIN_GRAPH_ID = 'main-graph';

export function GraphWorkspace() {
    const { tabs, activeTabId, setActiveTab, createTab, closeTab, renameTab } =
        useGraphWorkspace();
    const graphRef = useGetGraph(MAIN_GRAPH_ID);
    const { syncAll } = useGraphMutation(MAIN_GRAPH_ID);

    useEffect(() => {
        const core = graphRef.current;

        if (!core) {
            return;
        }

        syncAll(core);
    }, [activeTabId, graphRef, syncAll]);

    return (
        <div className="flex h-full flex-col">
            <div className="border-base-300 bg-base-200 border-b px-4 pt-2">
                <div className="flex items-start gap-3">
                    <WorkspaceTabs
                        tabs={tabs.map((tab) => ({ id: tab.id, label: tab.name }))}
                        activeTab={activeTabId}
                        onTabChange={setActiveTab}
                        onTabClose={closeTab}
                        onTabRename={renameTab}
                    />

                    <button
                        aria-label="Create new graph tab"
                        className="btn btn-outline btn-sm shrink-0 hover:btn-accent"
                        onClick={() => {
                            createTab();
                        }}
                        title="Create new graph tab"
                        type="button"
                    >
                        <span className="inline-flex items-center gap-1">
                            {AppIcons.NewGraph({ size: 14 })}
                            New Tab
                        </span>
                    </button>
                </div>
            </div>

            <div className="relative min-h-0 flex-1">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTabId;

                    return (
                        <div
                            key={tab.id}
                            className={`${isActive ? 'block' : 'hidden'} h-full w-full`}
                        >
                            <GraphCanvas
                                graphId={MAIN_GRAPH_ID}
                                containerId={`graph-canvas-${tab.id}`}
                                tabId={tab.id}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
