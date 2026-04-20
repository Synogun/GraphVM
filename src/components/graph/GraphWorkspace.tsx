import { AppIcons } from '@/components/common/AppIcons';
import { WorkspaceTabs } from '@/components/common/tabs';
import { useGetGraph, useTabActivationSync, useWorkspaceAutosave } from '@/hooks';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';
import { useGraphRegistry, useGraphWorkspace } from '@Contexts';
import { ConfirmModal } from '@Modals';
import { useCallback, useMemo, useState } from 'react';
import { GraphCanvas } from './GraphCanvas';

const MAIN_GRAPH_ID = 'main-graph';

export function GraphWorkspace() {
    const { tabs, activeTabId, setActiveTab, createTab, closeTab, renameTab } =
        useGraphWorkspace();
    const registry = useGraphRegistry();
    useTabActivationSync(MAIN_GRAPH_ID);
    useWorkspaceAutosave(MAIN_GRAPH_ID);

    const graphRef = useGetGraph(MAIN_GRAPH_ID);
    const [tabIdToClose, setTabIdToClose] = useState<string | null>(null);

    const pendingCloseTabName = useMemo(() => {
        if (!tabIdToClose) {
            return 'This tab';
        }

        return tabs.find((tab) => tab.id === tabIdToClose)?.name ?? 'This tab';
    }, [tabIdToClose, tabs]);

    const handleCloseTab = useCallback(
        (tabId: string) => {
            const scopedGraphId = makeScopedGraphRegistryId(MAIN_GRAPH_ID, tabId);
            const activeGraph = graphRef.current;
            const tabGraph =
                registry.get(scopedGraphId) ??
                (tabId === activeTabId ? activeGraph : null);
            const hasGraphData = Boolean(
                tabGraph &&
                (tabGraph.nodes().length > 0 || tabGraph.edges().length > 0)
            );

            if (hasGraphData) {
                setTabIdToClose(tabId);
                return;
            }

            closeTab(tabId);
        },
        [registry, graphRef, activeTabId, closeTab]
    );

    const handleCancelCloseTab = useCallback(() => {
        setTabIdToClose(null);
    }, []);

    const handleConfirmCloseTab = useCallback(() => {
        if (tabIdToClose) {
            closeTab(tabIdToClose);
        }

        setTabIdToClose(null);
    }, [tabIdToClose, closeTab]);

    return (
        <div className="flex h-full flex-col">
            <ConfirmModal
                id="confirm-close-tab-modal"
                title="Close tab"
                message={
                    `"${pendingCloseTabName}" contains graph data.\n\n` +
                    'Are you sure you want to close it?\n' +
                    'This action cannot be undone.'
                }
                show={Boolean(tabIdToClose)}
                onCancel={handleCancelCloseTab}
                onConfirm={handleConfirmCloseTab}
                confirmLabel="Close Tab"
                confirmButtonClassName="btn-error"
            />

            <div className="border-base-300 bg-base-200 border-b px-4 pt-2">
                <div className="flex items-start gap-3">
                    <WorkspaceTabs
                        tabs={tabs.map((tab) => ({
                            id: tab.id,
                            label: tab.name,
                        }))}
                        activeTab={activeTabId}
                        onTabChange={setActiveTab}
                        onTabClose={handleCloseTab}
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
