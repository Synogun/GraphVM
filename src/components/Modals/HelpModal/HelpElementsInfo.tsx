import { ActionBarButton } from '@/components/ActionBar/ActionBarButton';
import { ActionBarEdgeModeButton } from '@/components/ActionBar/ActionBarEdgeModeButton';
import { AppIcons } from '@/components/common/AppIcons';

export function HelpElementsInfo() {
    return (
        <>
            <p className="mb-2"></p>
            <ul className="list-disc list-inside ml-2 space-y-2">
                <li>
                    <strong>Adding Nodes:</strong>
                    <ul className="list-decimal list-inside ml-6 mt-1 text-sm text-base-content/80">
                        <li>
                            Click the{' '}
                            <ActionBarButton
                                label="Add Node"
                                icon={AppIcons.AddNode({ size: 16 })}
                                className="my-0 px-1 btn-xs"
                            />{' '}
                            button in the Action Bar.
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>Adding Edges:</strong>
                    <ul className="list-decimal list-inside ml-6 mt-1 text-sm text-base-content/80">
                        <li>Select two or more nodes by clicking them (or drag-selecting).</li>
                        <li>
                            Choose a edge insertion mode:
                            <ul className="list-disc list-inside ml-4">
                                <li>
                                    <strong>Path Mode</strong>: Connects nodes in the order they
                                    were selected (A→B→C) when in{' '}
                                    <ActionBarButton
                                        label="Path Mode"
                                        className="px-1 btn-xs"
                                        margin="my-0"
                                        icon={AppIcons.PathEdgeMode({ size: 16 })}
                                    />{' '}
                                    mode.
                                </li>
                                <li>
                                    <strong>Complete Mode</strong>: Connects every selected node to
                                    every other selected node when in{' '}
                                    <ActionBarEdgeModeButton
                                        isCompleteEdgeMode={true}
                                        iconSize={16}
                                        className="px-1 btn-xs my-0"
                                    />{' '}
                                    mode.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Click{' '}
                            <ActionBarButton
                                label="Add Edge(s)"
                                className="my-0 px-1 btn-xs"
                                icon={AppIcons.AddEdges({ size: 16 })}
                            />{' '}
                            button in the Action Bar.
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>Deleting Elements:</strong>
                    <ul className="list-decimal list-inside ml-6 mt-1 text-sm text-base-content/80">
                        <li>
                            Select one or more nodes or edges by clicking them (or drag-selecting).
                        </li>
                        <li>
                            Click the{' '}
                            <ActionBarButton
                                label="Delete Selected"
                                icon={AppIcons.DeleteElements({ size: 16 })}
                                className="my-0 px-1 btn-xs"
                                isDelete={true}
                            />{' '}
                            button in the Action Bar.
                        </li>
                    </ul>
                </li>
            </ul>
        </>
    );
}
