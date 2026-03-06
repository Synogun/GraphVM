import { useActionBarLogic } from '@/hooks/useActionBarLogic';
import { isDev } from '@/utils/general';
import { Logger } from '@Logger';
import { type ReactNode } from 'react';
import pkg from '../../../package.json';
import { AppIcons } from '../common/AppIcons';
import { SideBar } from '../common/SideBar';
import { ActionBarButton } from './ActionBarButton';
import { ActionBarEdgeModeButton } from './ActionBarEdgeModeButton';

const ICON_SIZE = '1.5em';

export function ActionBar({ children }: ActionBarProps) {
    const {
        handleNewGraph,
        handleAlgorithms,
        handleImportExport,
        handleArrangeGraph,
        handleCenterGraph,
        handleAddNode,
        handleAddEdges,
        handleToggleEdgeMode,
        handleDeleteSelected,
        handleSettings,
        handleHelp,
        isDeleteBtnDisabled,
        isCompleteEdgeMode,
        isEdgeModeLocked,
    } = useActionBarLogic();

    const SidebarChildren = (
        <>
            <div className="divider mt-2">
                <h1 className="text-xl font-bold text-center">GraphVM</h1>
            </div>

            <ActionBarButton
                icon={AppIcons.NewGraph({ size: ICON_SIZE })}
                label="New Graph"
                margin="my-1"
                onClick={handleNewGraph}
            />

            <ActionBarButton
                icon={AppIcons.Algorithms({ size: ICON_SIZE })}
                label="Algorithms"
                margin="my-1"
                onClick={handleAlgorithms}
            />

            <ActionBarButton
                icon={AppIcons.ImportExport({ size: ICON_SIZE })}
                label="Import / Export"
                margin="my-1"
                onClick={handleImportExport}
            />

            <div className="divider my-3">
                <h1 className="text-base font-bold text-center">Organize</h1>
            </div>

            <ActionBarButton
                icon={AppIcons.Arrange({ size: ICON_SIZE })}
                label="Arrange"
                margin="my-1"
                onClick={handleArrangeGraph}
            />

            <ActionBarButton
                icon={AppIcons.Center({ size: ICON_SIZE })}
                label="Center"
                margin="my-1"
                onClick={handleCenterGraph}
            />

            <div className="divider my-3">
                <h1 className="text-base font-bold text-center">Elements</h1>
            </div>

            <ActionBarButton
                icon={AppIcons.AddNode({ size: ICON_SIZE })}
                label="Add node"
                margin="my-1"
                onClick={handleAddNode}
            />

            <ActionBarButton
                icon={AppIcons.AddEdges({ size: ICON_SIZE })}
                label="Add Edges(s)"
                margin="my-1"
                onClick={handleAddEdges}
            />

            <ActionBarEdgeModeButton
                isCompleteEdgeMode={isCompleteEdgeMode}
                handleToggleEdgeMode={handleToggleEdgeMode}
                iconSize={ICON_SIZE}
                disabled={isEdgeModeLocked}
            />

            <ActionBarButton
                disabled={isDeleteBtnDisabled}
                icon={AppIcons.DeleteElements({ size: ICON_SIZE })}
                isDelete={true}
                label="Delete Selected"
                margin="my-1"
                onClick={handleDeleteSelected}
            />

            <div className="divider mt-auto mb-3">
                <h1 className="text-base font-bold text-center">Misc</h1>
            </div>

            <ActionBarButton
                icon={AppIcons.Settings({ size: ICON_SIZE })}
                label="Settings"
                margin="my-1"
                onClick={handleSettings}
            />

            <ActionBarButton
                icon={AppIcons.Help({ size: ICON_SIZE })}
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

            {isDev() && (
                <ActionBarButton
                    icon={AppIcons.DebugLogs({ size: ICON_SIZE })}
                    label="Download Logs"
                    margin="my-1"
                    onClick={() => {
                        Logger.downloadLogs();
                    }}
                />
            )}

            <div className="divider mt-1 mb-0" />

            <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500" id="credits">
                    @Synogun
                </span>
                <span>{`v${pkg.version}`}</span>

                {isDev() && (
                    <span className="text-xs text-red-600" id="is-dev">
                        NOT PRODUCTION
                    </span>
                )}
            </div>
        </>
    );

    return (
        <SideBar
            className="select-none text-center"
            id="actions-bar"
            inputId="actions-bar-input"
            sideClassName="select-none shadow-xl/45"
            width="w-50"
            sidebarChildren={SidebarChildren}
        >
            {children}
        </SideBar>
    );
}

// ---------- Type Definitions ----------

type ActionBarProps = {
    children: ReactNode;
};
