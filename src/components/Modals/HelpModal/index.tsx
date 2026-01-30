import { useModals } from '@/contexts/ModalsContext';
import { Modal } from '@Modals';
import { ControlsInfo } from './ControlsInfo';
import { HelpElementsInfo } from './HelpElementsInfo';

export function HelpModal() {
    const modals = useModals();

    const handleClose = () => {
        modals.setIsHelpModalOpen(false);
    };

    return (
        <Modal
            id="help-modal"
            onClose={handleClose}
            show={modals.isHelpModalOpen}
            title="Help"
        >
            <p className="text-base-content/70">
                Need assistance? Here's how to get started with using the
                application.
            </p>
            <main className="grow pt-3">
                <div className="border-b border-base-300 mb-4" />
                <div className="space-y-2">
                    <div className="collapse collapse-arrow bg-base-100 border border-base-300 hover:border-accent has-[input[type='radio']:checked]:border-accent">
                        <input
                            defaultChecked={true}
                            name="help-accordion"
                            type="radio"
                        />
                        <div className="collapse-title text-lg font-semibold">
                            Introduction
                        </div>
                        <div className="collapse-content">
                            <p>
                                GraphVM allows you to create, visualize, and
                                manipulate graphs. The interface consists of
                                three main areas:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>
                                    <strong className="text-primary">
                                        Action Bar (Left)
                                    </strong>
                                    : Tools for creating, removing and
                                    organizing the graph and its elements. Also
                                    contains access to menus like Settings and
                                    Help.
                                </li>
                                <li>
                                    <strong>Canvas (Center)</strong>: The
                                    interactive space where you view and edit
                                    your graph.
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
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300 hover:border-accent has-[input[type='radio']:checked]:border-accent">
                        <input name="help-accordion" type="radio" />
                        <div className="collapse-title text-lg font-semibold">
                            Creating and Removing Elements
                        </div>
                        <div className="collapse-content">
                            <HelpElementsInfo />
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300 hover:border-accent has-[input[type='radio']:checked]:border-accent">
                        <input name="help-accordion" type="radio" />
                        <div className="collapse-title text-lg font-semibold">
                            Controls and Interaction
                        </div>
                        <div className="collapse-content">
                            <ControlsInfo />
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300 hover:border-accent has-[input[type='radio']:checked]:border-accent">
                        <input name="help-accordion" type="radio" />
                        <div className="collapse-title text-lg font-semibold">
                            Customization
                        </div>
                        <div className="collapse-content">
                            <p className="mb-2">
                                Use the <strong>Properties Bar</strong> on the
                                right to style your graph.
                            </p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>
                                    <strong>Layout</strong>: Organize the graph
                                    automatically (Circle, Grid, Breadthfirst,
                                    etc.).
                                </li>
                                <li>
                                    <strong>Nodes</strong>: Change shape and
                                    color of selected nodes.
                                </li>
                                <li>
                                    <strong>Edges</strong>: Adjust line style
                                    (solid, dotted), curvature, weight, and
                                    color.
                                </li>
                            </ul>
                            <p className="text-sm mt-2 italic text-base-content/60">
                                Note: If nothing is selected, the properties
                                panel allows you to set default styles for new
                                elements.
                            </p>
                        </div>
                    </div>

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300 hover:border-accent has-[input[type='radio']:checked]:border-accent">
                        <input name="help-accordion" type="radio" />
                        <div className="collapse-title text-lg font-semibold">
                            Other Tools
                        </div>
                        <div className="collapse-content">
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>
                                    <strong>Algorithms</strong>: Run graph
                                    algorithms (DFS, BFS, Dijkstra, etc.) from
                                    the Action Bar.
                                </li>
                                <li>
                                    <strong>Import/Export</strong>: Save your
                                    work as a file or load an existing one.
                                </li>
                                <li>
                                    <strong>Arrange</strong>: Re-applies the
                                    selected layout algorithm to organize the
                                    nodes.
                                </li>
                                <li>
                                    <strong>Center</strong>: Finds the selected
                                    elements (or the whole graph) and centers
                                    the view on them.
                                </li>
                                <li>
                                    <strong>Settings</strong>: Access
                                    application settings like theme and
                                    preference options.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </Modal>
    );
}
