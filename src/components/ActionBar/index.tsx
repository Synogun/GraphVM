import { isArrayOfStrings } from '@/types/typeGuards';
import { isDev } from '@/utils';
import { useEdgesProperties } from '@contexts/EdgesContext';
import { useGraphProperties } from '@contexts/GraphContext';
import { useLayoutProperties } from '@contexts/LayoutContext';
import { useGetGraph } from '@hooks/useGraphRegistry';
import type cytoscape from 'cytoscape';
import type { ChangeEvent, ReactNode } from 'react';
import { AiOutlineNodeIndex } from 'react-icons/ai';
import { BsNodePlus } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { MdFilterCenterFocus, MdSettings } from 'react-icons/md';
import { PiFediverseLogo, PiGraph, PiLineSegments, PiShuffle } from 'react-icons/pi';
import { RiSave3Fill } from 'react-icons/ri';
import { SideBar } from '../common/SideBar';
import ActionButton from './ActionButton';

export function ActionBar({ children }: ActionBarProps) {
    const {
        nodes: {
            setCount: setNodeCount,
            selected: selectedNodes,
            setSelected: setSelectedNodes,
        },
        edges: {
            edgeMode,
            setEdgeMode,
            selected: selectedEdges,
            setSelected: setSelectedEdges,
            setCount: setEdgeCount
        },
    } = useGraphProperties();

    const {
        weight,
        color,
        lineStyle,
        curveStyle
    } = useEdgesProperties();

    const { current: currentLayout } = useLayoutProperties();
    const graph = useGetGraph('main-graph');
    const edgeModeStyle = edgeMode === 'path' ? 'btn-outline' : 'btn-accent';
    const pathMode = edgeMode === 'complete';
    const deleteDisabled = isDisabled(selectedNodes, selectedEdges);

    const handleArrangeGraph = () => {
        if (!graph) { return; }
        
        graph.arrangeGraph(currentLayout ?? { name: 'circle' });
    };

    const handleNewGraph = () => {
        location.reload();
    };

    const handleCenterGraph = () => {
        if (!graph) { return; }

        const currentSelected = graph.getSelectedElements();
        graph.centerGraph(currentSelected, 30);
    };

    const handleAddNode = () => {
        if (!graph) { return; }

        graph.addNode();

        const currentNodeCount = graph.getNodeCount();
        setNodeCount(currentNodeCount);
        handleArrangeGraph();
    };

    const handleAddEdges = () => {
        if (!graph) { return; }

        const currentSelectedNodes = graph.getData('nodeSelectionOrder');

        if (!isArrayOfStrings(currentSelectedNodes)) { return; }

        if (currentSelectedNodes.length < 2) {
            console.warn('Select at least two nodes to create an edge.');
            // TODO: Show user feedback
            return;
        }

        graph.addEdges(
            edgeMode,
            currentSelectedNodes,
            { weight, color, style: lineStyle, curve: curveStyle }
        );

        const currentEdgeCount = graph.getEdgeCount();
        setEdgeCount(currentEdgeCount);
        handleArrangeGraph();
    };

    const handleToggleEdgeMode = (e: ChangeEvent<HTMLInputElement>) => {
        setEdgeMode(e.target.checked ? 'complete' : 'path');
    };

    const handleDeleteSelected = () => {
        if (!graph) { return; }

        const core = graph.getCore();
        let selectedElements = graph.getSelectedElements();

        if (selectedElements.length === 0) { return; }

        const nodesToRemove = selectedElements.filter('node');
        if (nodesToRemove.length > 0) {
            graph.removeNodes(nodesToRemove);

            const empty = graph.getSelectedNodes();
            setSelectedNodes(empty);
            setNodeCount(graph.getNodeCount() - nodesToRemove.length);
            core.data('nodeSelectionOrder', []);
        }

        selectedElements = graph.getSelectedElements();
        const edgesToRemove = selectedElements.filter('edge');
        if (edgesToRemove.length > 0) {
            graph.removeEdges(edgesToRemove);

            const empty = graph.getSelectedEdges();
            setSelectedEdges(empty);
            setEdgeCount(graph.getEdgeCount() - edgesToRemove.length);
            core.data('edgeSelectionOrder', []);
        }
    };

    return (
        <SideBar
            className='select-none text-center'
            id='actions-bar'
            inputId='actions-bar-input'
            sideClassName='select-none shadow-xl/45'
            width='w-50'
            sidebarChildren={ (
                <>
                    <div className='divider mt-2'>
                        <h1 className='text-xl font-bold text-center'>GraphVM</h1>
                    </div>

                    <ActionButton
                        icon={ actionIcons.newGraph }
                        label='New Graph'
                        margin='my-1'
                        onClick={ handleNewGraph }
                    />

                    <ActionButton
                        icon={ actionIcons.importExport }
                        label='Import / Export'
                        margin='my-1'
                        onClick={ handleImportExport }
                    />

                    <div className='divider my-3'>
                        <h1 className='text-base font-bold text-center'>Organize</h1>
                    </div>

                    <ActionButton
                        icon={ actionIcons.arrange }
                        label='Arrange'
                        margin='my-1'
                        onClick={ handleArrangeGraph }
                    />

                    <ActionButton
                        icon={ actionIcons.center }
                        label='Center'
                        margin='my-1'
                        onClick={ handleCenterGraph }
                    />

                    <div className='divider my-3'>
                        <h1 className='text-base font-bold text-center'>Elements</h1>
                    </div>

                    <ActionButton
                        icon={ actionIcons.addNode }
                        label='Add node'
                        margin='my-1'
                        onClick={ handleAddNode }
                    />

                    <ActionButton
                        icon={ actionIcons.addEdges }
                        label='Add Edges(s)'
                        margin='my-1'
                        onClick={ handleAddEdges }
                    />

                    <label className={ `btn ${edgeModeStyle} hover:btn-accent swap hover:swap-rotate my-1` }>
                        <input checked={ pathMode } onChange={ handleToggleEdgeMode } type='checkbox' />
                        <div className='swap-off flex items-center text-center gap-5'>{actionIcons.pathEdgeMode} Path Mode</div>
                        <div className='swap-on flex items-center text-center gap-2'>{actionIcons.completeEdgeMode} Complete Mode</div>
                    </label>

                    <ActionButton
                        disabled={ deleteDisabled }
                        icon={ actionIcons.deleteElements }
                        isDelete={ true }
                        label='Delete Selected'
                        margin='my-1'
                        onClick={ handleDeleteSelected }
                    />


                    <div className='divider mt-auto mb-3'>
                        <h1 className='text-base font-bold text-center'>Misc</h1>
                    </div>

                    <ActionButton
                        icon={ actionIcons.settings }
                        label='Settings'
                        margin='my-1'
                        onClick={ handleSettings }
                    />

                    <a
                        className='btn btn-outline hover:btn-accent'
                        href='https://github.com/Synogun/GraphVM'
                        rel='noopener noreferrer'
                        role='button'
                        target='_blank'
                    >
                        <span>{actionIcons.github}</span> GH Repository
                    </a>

                    <div className='divider mt-1 mb-0' />

                    <div className='flex flex-col items-center'>
                        <span
                            className='text-xs text-gray-500'
                            id='credits'>
                            @Synogun
                        </span>

                        {isDev() && (
                            <span
                                className='text-xs text-red-600'
                                id='is-dev'>
                                NOT PRODUCTION
                            </span>
                        )}
                    </div>
                </>
            ) }
        >
            {children}
        </SideBar>
    );
}

const actionIcons = {
    newGraph: <PiGraph size='1.5em' />,
    importExport: <RiSave3Fill size='1.5em' />,
    arrange: <PiShuffle size='1.5em' />,
    center: <MdFilterCenterFocus size='1.5em' />,
    addNode: <BsNodePlus size='1.5em' />,
    addEdges: <AiOutlineNodeIndex size='1.5em' />,
    pathEdgeMode: <PiLineSegments size='1.5em' />,
    completeEdgeMode: <PiFediverseLogo size='1.5em' />,
    deleteElements: <GoTrash size='1.5em' />,
    settings: <MdSettings size='1.5em' />,
    github: <FaGithub size='1.5em' />,
};

const handleImportExport = () => { console.log('Import/Export clicked'); };
const handleSettings = () => { console.log('Settings clicked'); };

// ---------- Type Definitions ----------

type ActionBarProps = {
    children: ReactNode;
};

function isDisabled(selectedNodes: cytoscape.NodeCollection | null, selectedEdges: cytoscape.EdgeCollection | null) {
    return (
        (selectedNodes === null || selectedNodes.length === 0) &&
        (selectedEdges === null || selectedEdges.length === 0)
    );
}
