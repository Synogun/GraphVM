import { useEdgesProperties } from '@/contexts/EdgesContext';
import { useGraphProperties } from '@/contexts/GraphContext';
import { useLayoutProperties } from '@/contexts/LayoutContext';
import { useModals } from '@/contexts/ModalsContext';
import { useGetGraph } from '@/hooks/useGraphRegistry';
import { addEdges, removeEdges } from '@/services/EdgesServices';
import { arrangeGraph, centerGraph } from '@/services/LayoutService';
import { addNode, removeNodes } from '@/services/NodesService';
import { isArrayOfStrings } from '@/types/typeGuards';
import { isDev } from '@/utils';
import type { ChangeEvent, ReactNode } from 'react';
import { AiOutlineNodeIndex } from 'react-icons/ai';
import { BsNodePlus } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa6';
import { FiHelpCircle } from 'react-icons/fi';
import { GoTrash } from 'react-icons/go';
import { MdFilterCenterFocus, MdSettings } from 'react-icons/md';
import { PiFediverseLogo, PiGraph, PiLineSegments, PiShuffle } from 'react-icons/pi';
import { RiSave3Fill } from 'react-icons/ri';
import { SideBar } from '../common/SideBar';

export function ActionBar({ children }: ActionBarProps) {
    const {
        nodes: { setCount: setNodeCount, selected: selectedNodes, setSelected: setSelectedNodes },
        edges: {
            edgeMode,
            setEdgeMode,
            selected: selectedEdges,
            setSelected: setSelectedEdges,
            setCount: setEdgeCount,
        },
    } = useGraphProperties();

    const { weight, color, lineStyle, curveStyle } = useEdgesProperties();

    const {
        setIsAlgorithmsModalOpen,
        setIsHelpModalOpen,
        setIsSettingsModalOpen,
        setIsImportExportModalOpen,
    } = useModals();

    const { current: currentLayout } = useLayoutProperties();
    const graphRef = useGetGraph('main-graph');
    const edgeModeStyle = edgeMode === 'path' ? 'btn-outline' : 'btn-accent';
    const pathMode = edgeMode === 'complete';
    const isDeleteBtnDisabled = selectedNodes.length === 0 && selectedEdges.length === 0;

    const handleNewGraph = () => {
        location.reload();
    };

    const handleAlgorithms = () => {
        setIsAlgorithmsModalOpen(true);
    };

    const handleImportExport = () => {
        setIsImportExportModalOpen(true);
    };

    const handleArrangeGraph = () => {
        if (!graphRef.current) {
            return;
        }

        arrangeGraph(graphRef.current, currentLayout ?? { name: 'circle' });
    };

    const handleSettings = () => {
        setIsSettingsModalOpen(true);
    };

    const handleHelp = () => {
        setIsHelpModalOpen(true);
    };

    const handleCenterGraph = () => {
        if (!graphRef.current) {
            return;
        }

        const currentSelected = graphRef.current.elements(':selected');
        centerGraph(graphRef.current, currentSelected, 30);
    };

    const handleAddNode = () => {
        if (!graphRef.current) {
            return;
        }

        addNode(graphRef.current);

        const currentNodeCount = graphRef.current.nodes().length;
        setNodeCount(currentNodeCount);
        handleArrangeGraph();
    };

    const handleAddEdges = () => {
        if (!graphRef.current) {
            return;
        }

        const currentSelectedNodes: unknown = graphRef.current.data('nodeSelectionOrder');

        if (!isArrayOfStrings(currentSelectedNodes)) {
            return;
        }

        if (currentSelectedNodes.length < 2) {
            console.warn('Select at least two nodes to create an edge.');
            // TODO: Show user feedback
            return;
        }

        const edgeData = { weight, color, style: lineStyle, curve: curveStyle };

        addEdges(graphRef.current, edgeData, edgeMode, currentSelectedNodes);

        const currentEdgeCount = graphRef.current.edges().length;
        setEdgeCount(currentEdgeCount);
        handleArrangeGraph();
    };

    const handleToggleEdgeMode = (e: ChangeEvent<HTMLInputElement>) => {
        setEdgeMode(e.target.checked ? 'complete' : 'path');
    };

    const handleDeleteSelected = () => {
        if (!graphRef.current) {
            return;
        }

        let selectedElements = graphRef.current.elements(':selected');
        if (selectedElements.length === 0) {
            return;
        }

        const nodesToRemove = selectedElements.filter('node');
        if (nodesToRemove.length > 0) {
            removeNodes(graphRef.current, nodesToRemove);

            setSelectedNodes([]);
            setNodeCount(graphRef.current.nodes().length - nodesToRemove.length);
            graphRef.current.data('nodeSelectionOrder', []);
        }

        selectedElements = graphRef.current.elements(':selected');
        const edgesToRemove = selectedElements.filter('edge');
        if (edgesToRemove.length > 0) {
            removeEdges(graphRef.current, edgesToRemove);

            setSelectedEdges([]);
            setEdgeCount(graphRef.current.edges().length - edgesToRemove.length);
            graphRef.current.data('edgeSelectionOrder', []);
        }
    };

    return (
        <SideBar
            className="select-none text-center"
            id="actions-bar"
            inputId="actions-bar-input"
            sideClassName="select-none shadow-xl/45"
            width="w-50"
            sidebarChildren={
                <>
                    <div className="divider mt-2">
                        <h1 className="text-xl font-bold text-center">GraphVM</h1>
                    </div>

                    <ActionButton
                        icon={actionIcons.newGraph}
                        label="New Graph"
                        margin="my-1"
                        onClick={handleNewGraph}
                    />

                    <ActionButton
                        icon={actionIcons.algorithms}
                        label="Algorithms"
                        margin="my-1"
                        onClick={handleAlgorithms}
                    />

                    <ActionButton
                        icon={actionIcons.importExport}
                        label="Import / Export"
                        margin="my-1"
                        onClick={handleImportExport}
                    />

                    <div className="divider my-3">
                        <h1 className="text-base font-bold text-center">Organize</h1>
                    </div>

                    <ActionButton
                        icon={actionIcons.arrange}
                        label="Arrange"
                        margin="my-1"
                        onClick={handleArrangeGraph}
                    />

                    <ActionButton
                        icon={actionIcons.center}
                        label="Center"
                        margin="my-1"
                        onClick={handleCenterGraph}
                    />

                    <div className="divider my-3">
                        <h1 className="text-base font-bold text-center">Elements</h1>
                    </div>

                    <ActionButton
                        icon={actionIcons.addNode}
                        label="Add node"
                        margin="my-1"
                        onClick={handleAddNode}
                    />

                    <ActionButton
                        icon={actionIcons.addEdges}
                        label="Add Edges(s)"
                        margin="my-1"
                        onClick={handleAddEdges}
                    />

                    <label
                        className={`btn ${edgeModeStyle} hover:btn-accent swap hover:swap-rotate my-1`}
                    >
                        <input checked={pathMode} onChange={handleToggleEdgeMode} type="checkbox" />
                        <div className="swap-off flex items-center text-center gap-5">
                            {actionIcons.pathEdgeMode} Path Mode
                        </div>
                        <div className="swap-on flex items-center text-center gap-2">
                            {actionIcons.completeEdgeMode} Complete Mode
                        </div>
                    </label>

                    <ActionButton
                        disabled={isDeleteBtnDisabled}
                        icon={actionIcons.deleteElements}
                        isDelete={true}
                        label="Delete Selected"
                        margin="my-1"
                        onClick={handleDeleteSelected}
                    />

                    <div className="divider mt-auto mb-3">
                        <h1 className="text-base font-bold text-center">Misc</h1>
                    </div>

                    <ActionButton
                        icon={actionIcons.settings}
                        label="Settings"
                        margin="my-1"
                        onClick={handleSettings}
                    />

                    <ActionButton
                        icon={actionIcons.help}
                        label="Help"
                        margin="my-1"
                        onClick={handleHelp}
                    />

                    {/* <a
                        className='btn btn-outline hover:btn-accent'
                        href='https://github.com/Synogun/GraphVM'
                        rel='noopener noreferrer'
                        role='button'
                        target='_blank'
                    >
                        <span>{actionIcons.github}</span> GH Repository
                    </a> */}

                    <div className="divider mt-1 mb-0" />

                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500" id="credits">
                            @Synogun
                        </span>

                        {isDev() && (
                            <span className="text-xs text-red-600" id="is-dev">
                                NOT PRODUCTION
                            </span>
                        )}
                    </div>
                </>
            }
        >
            {children}
        </SideBar>
    );
}

function ActionButton({
    label,
    icon,
    onClick,
    condensed = false,
    margin = 'my-1',
    disabled = false,
    isDelete = false,
}: ActionButtonProps) {
    const classStyle = isDelete ? 'btn-error' : 'btn-outline hover:btn-accent focus:btn-accent';

    return (
        <button className={`btn ${classStyle} ${margin}`} disabled={disabled} onClick={onClick}>
            {icon ? <span>{icon}</span> : null}
            {!condensed ? label : null}
        </button>
    );
}

const actionIcons = {
    newGraph: <PiGraph size="1.5em" />,
    algorithms: <FaCode size="1.5em" />,
    importExport: <RiSave3Fill size="1.5em" />,
    arrange: <PiShuffle size="1.5em" />,
    center: <MdFilterCenterFocus size="1.5em" />,
    addNode: <BsNodePlus size="1.5em" />,
    addEdges: <AiOutlineNodeIndex size="1.5em" />,
    pathEdgeMode: <PiLineSegments size="1.5em" />,
    completeEdgeMode: <PiFediverseLogo size="1.5em" />,
    deleteElements: <GoTrash size="1.5em" />,
    settings: <MdSettings size="1.5em" />,
    help: <FiHelpCircle size="1.5em" />,
    github: <FaGithub size="1.5em" />,
};

// ---------- Type Definitions ----------

type ActionBarProps = {
    children: ReactNode;
};

type ActionButtonProps = {
    label: string;
    isDelete?: boolean;
    icon?: ReactNode;
    onClick?: () => void;
    margin?: string;
    condensed?: boolean;
    disabled?: boolean;
};
