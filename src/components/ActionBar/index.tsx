import { useActionBarLogic } from '@/hooks';
import { isDev } from '@/utils/general';
import { Logger } from '@Logger';
import { type ReactNode } from 'react';
import { version } from '../../../package.json';
import { AppIcons } from '../common/AppIcons';
import { SideBar } from '../common/SideBar';
import {
    ActionBarButton,
    ActionBarButtonStyle,
    ActionBarTooltipClassName,
} from './ActionBarButton';
import { ActionBarEdgeModeButton } from './ActionBarEdgeModeButton';

const ICON_SIZE = '1.5em';

export function ActionBar({ children }: Readonly<ActionBarProps>) {
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

    const DrawerContent = (
        <>
            <div className="divider mt-2">
                <h1 className="text-xl font-bold text-center">GraphVM</h1>
            </div>

            <ActionBarButton
                id="new-graph-btn"
                icon={<AppIcons.NewGraph size={ICON_SIZE} />}
                label="New Graph"
                className="my-1"
                onClick={handleNewGraph}
            />

            <ActionBarButton
                id="import-export-btn"
                icon={<AppIcons.Import size={ICON_SIZE} />}
                label="Import / Export"
                className="my-1"
                onClick={handleImportExport}
            />

            <ActionBarButton
                id="algorithms-btn"
                icon={<AppIcons.Algorithms size={ICON_SIZE} />}
                label="Algorithms"
                className="my-1"
                onClick={handleAlgorithms}
            />

            <div className="lg:hidden w-full">
                <div className="divider my-3">
                    <h1 className="text-base font-bold text-center">Elements</h1>
                </div>

                <ActionBarButton
                    id="add-node-btn-mobile"
                    icon={<AppIcons.AddNode size={ICON_SIZE} />}
                    className="my-1"
                    label="Add Node"
                    onClick={handleAddNode}
                />

                <ActionBarButton
                    id="add-edge-btn-mobile"
                    icon={<AppIcons.AddEdges size={ICON_SIZE} />}
                    className="my-1"
                    label="Add Edge(s)"
                    onClick={handleAddEdges}
                />

                <ActionBarEdgeModeButton
                    id="edge-mode-btn-mobile"
                    isCompleteEdgeMode={isCompleteEdgeMode}
                    handleToggleEdgeMode={handleToggleEdgeMode}
                    iconSize={ICON_SIZE}
                    disabled={isEdgeModeLocked}
                />

                <ActionBarButton
                    id="delete-selected-btn-mobile"
                    disabled={isDeleteBtnDisabled}
                    className="my-1"
                    icon={<AppIcons.DeleteElements size={ICON_SIZE} />}
                    isDelete={true}
                    label="Delete Selected"
                    onClick={handleDeleteSelected}
                />

                <div className="divider my-3">
                    <h1 className="text-base font-bold text-center">Organize</h1>
                </div>

                <ActionBarButton
                    id="arrange-graph-btn"
                    icon={<AppIcons.Arrange size={ICON_SIZE} />}
                    label="Arrange"
                    className="my-1"
                    onClick={handleArrangeGraph}
                />

                <ActionBarButton
                    id="center-graph-btn"
                    icon={<AppIcons.Center size={ICON_SIZE} />}
                    label="Center"
                    className="my-1"
                    onClick={handleCenterGraph}
                />
            </div>

            <div className="divider mt-auto mb-3">
                <h1 className="text-base font-bold text-center">Misc</h1>
            </div>

            <ActionBarButton
                id="settings-btn"
                icon={<AppIcons.Settings size={ICON_SIZE} />}
                label="Settings"
                className="my-1"
                onClick={handleSettings}
            />

            <ActionBarButton
                id="help-btn"
                icon={<AppIcons.Help size={ICON_SIZE} />}
                label="Help"
                className="my-1"
                onClick={handleHelp}
            />

            {isDev() && (
                <ActionBarButton
                    id="download-logs-btn"
                    icon={<AppIcons.DebugLogs size={ICON_SIZE} />}
                    label="Download Logs"
                    className="my-1"
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
                <span>{`v${version}`}</span>

                {isDev() && (
                    <span className="text-xs text-red-600" id="is-dev">
                        NOT PRODUCTION
                    </span>
                )}
            </div>
        </>
    );

    return (
        <>
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-14 flex-col bg-base-200 z-10 select-none text-center p-2 shadow-xl/45">
                <ActionBarButton
                    id="add-node-btn"
                    icon={<AppIcons.AddNode size={ICON_SIZE} />}
                    label="Add Node"
                    className="my-1"
                    condensed
                    onClick={handleAddNode}
                />

                <ActionBarButton
                    id="add-edge-btn"
                    icon={<AppIcons.AddEdges size={ICON_SIZE} />}
                    className="my-1"
                    label="Add Edge(s)"
                    condensed
                    onClick={handleAddEdges}
                />

                <ActionBarEdgeModeButton
                    id="edge-mode-btn"
                    isCompleteEdgeMode={isCompleteEdgeMode}
                    handleToggleEdgeMode={handleToggleEdgeMode}
                    iconSize={ICON_SIZE}
                    disabled={isEdgeModeLocked}
                    condensed
                />

                <ActionBarButton
                    id="delete-selected-btn"
                    disabled={isDeleteBtnDisabled}
                    className="my-1"
                    icon={<AppIcons.DeleteElements size={ICON_SIZE} />}
                    isDelete={true}
                    label="Delete Selected"
                    condensed
                    onClick={handleDeleteSelected}
                />

                <div className="mt-auto">
                    <div
                        className={ActionBarTooltipClassName}
                        data-tip="Open Sidebar"
                    >
                        <label
                            htmlFor="actions-bar-input"
                            className={`btn w-full ${ActionBarButtonStyle} my-1`}
                            aria-label="open sidebar"
                        >
                            <AppIcons.SidebarLeftExpand style={{ scale: 3 }} />
                        </label>
                    </div>
                </div>
            </aside>

            <SideBar
                className="select-none text-center"
                id="actions-bar"
                inputId="actions-bar-input"
                openOnLarge={false}
                sideClassName="select-none shadow-xl/45"
                width="w-50"
                sidebarChildren={DrawerContent}
            >
                <div className="lg:pl-14 flex flex-col h-full">{children}</div>
            </SideBar>
        </>
    );
}

// ---------- Type Definitions ----------

type ActionBarProps = {
    children: ReactNode;
};
