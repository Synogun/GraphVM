import { Tabs, type TabItem } from '@/components/common/tabs';
import { useModals } from '@Contexts';
import { Modal } from '@Modals';
import { useMemo, useState } from 'react';
import { ControlsInfo } from './ControlsInfo';
import { HelpElementsInfo } from './HelpElementsInfo';

export function HelpModal() {
    const modals = useModals();
    const [activeTab, setActiveTab] = useState<HelpTabId>('intro');

    const tabConfig = useMemo<TabItem<HelpTabId>[]>(
        () => [
            { id: 'intro', label: 'Introduction' },
            { id: 'create', label: 'Creating / Removing' },
            { id: 'controls', label: 'Controls' },
            { id: 'customization', label: 'Customization' },
            { id: 'tools', label: 'Other Tools' },
        ],
        []
    );

    const handleClose = () => {
        modals.setIsHelpModalOpen(false);
    };

    return (
        <Modal
            id="help-modal"
            onClose={handleClose}
            show={modals.isHelpModalOpen}
            title="Help"
            subtitle="Need assistance? Here's how to get started with using the application."
        >
            <main className="grow pt-3">
                <Tabs
                    tabs={tabConfig}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    name="help-modal-tabs"
                />
                <div className="mt-4 space-y-4">
                    {activeTab === 'intro' && (
                        <section>
                            {/* <h3 className="text-lg font-semibold mb-2">Introduction</h3> */}
                            <p>
                                GraphVM allows you to create, visualize, and
                                manipulate graphs. The interface consists of three
                                main areas:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>
                                    <strong className="text-primary">
                                        Action Bar (Left)
                                    </strong>
                                    : Tools for creating, removing and organizing the
                                    graph and its elements. Also contains access to
                                    menus like Settings and Help.
                                </li>
                                <li>
                                    <strong>Canvas (Center)</strong>: The interactive
                                    space where you view and edit your graph.
                                </li>
                                <li>
                                    <strong className="text-secondary">
                                        Properties Bar (Right)
                                    </strong>
                                    : Through this panel, you can view some
                                    information and customize the appearance and
                                    behavior of nodes and edges in the graph.
                                </li>
                            </ul>
                        </section>
                    )}

                    {activeTab === 'create' && (
                        <section>
                            {/* <h3 className="text-lg font-semibold mb-2">
                                Creating and Removing Elements
                            </h3> */}
                            <HelpElementsInfo />
                        </section>
                    )}

                    {activeTab === 'controls' && (
                        <section>
                            {/* <h3 className="text-lg font-semibold mb-2">
                                Controls and Interaction
                            </h3> */}
                            <ControlsInfo />
                        </section>
                    )}

                    {activeTab === 'customization' && (
                        <section>
                            {/* <h3 className="text-lg font-semibold mb-2">
                                Customization
                            </h3> */}
                            <p className="mb-2">
                                Use the <strong>Properties Bar</strong> on the right
                                to style your graph.
                            </p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>
                                    <strong>Layout</strong>: Organize the graph
                                    automatically (Circle, Grid, Breadthfirst, etc.).
                                </li>
                                <li>
                                    <strong>Nodes</strong>: Change shape and color of
                                    selected nodes.
                                </li>
                                <li>
                                    <strong>Edges</strong>: Adjust line style (solid,
                                    dotted), curvature, weight, and color.
                                </li>
                            </ul>
                            <p className="text-sm mt-2 italic text-base-content/60">
                                Note: If nothing is selected, the properties panel
                                allows you to set default styles for new elements.
                            </p>
                        </section>
                    )}

                    {activeTab === 'tools' && (
                        <section>
                            {/* <h3 className="text-lg font-semibold mb-2">
                                Other Tools
                            </h3> */}
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>
                                    <strong>Algorithms</strong>: Create graph from
                                    families or run graph algorithms (DFS, BFS,
                                    Dijkstra, etc.) from the Action Bar.
                                </li>
                                <li>
                                    <strong>Import/Export</strong>: Save your work as
                                    a file or load an existing one.
                                </li>
                                <li>
                                    <strong>Arrange</strong>: Re-applies the selected
                                    layout algorithm to organize the nodes.
                                </li>
                                <li>
                                    <strong>Center</strong>: Finds the selected
                                    elements (or the whole graph) and centers the
                                    view on them.
                                </li>
                                <li>
                                    <strong>Settings</strong>: Access application
                                    settings like theme and preference options.
                                </li>
                            </ul>
                        </section>
                    )}
                </div>
            </main>
        </Modal>
    );
}

type HelpTabId = 'intro' | 'create' | 'controls' | 'customization' | 'tools';
