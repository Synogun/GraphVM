import { AiOutlineNodeIndex } from 'react-icons/ai';
import { BsNodePlus } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa6';
import { FiHelpCircle } from 'react-icons/fi';
import { GoTrash } from 'react-icons/go';
import { MdFilterCenterFocus, MdSettings } from 'react-icons/md';
import { PiFediverseLogo, PiGraph, PiLineSegments, PiShuffle } from 'react-icons/pi';
import { RiSave3Fill } from 'react-icons/ri';
import { TbReport } from 'react-icons/tb';
import { MdPalette } from 'react-icons/md';
import {
    TbLayoutSidebarLeftCollapseFilled,
    TbLayoutSidebarLeftExpandFilled,
    TbLayoutSidebarRightCollapseFilled,
    TbLayoutSidebarRightExpandFilled,
} from 'react-icons/tb';

export const AppIcons = {
    NewGraph: PiGraph,
    Algorithms: FaCode,
    ImportExport: RiSave3Fill,
    Arrange: PiShuffle,
    Center: MdFilterCenterFocus,
    AddNode: BsNodePlus,
    AddEdges: AiOutlineNodeIndex,
    PathEdgeMode: PiLineSegments,
    CompleteEdgeMode: PiFediverseLogo,
    DeleteElements: GoTrash,
    Settings: MdSettings,
    Help: FiHelpCircle,
    Github: FaGithub,
    DebugLogs: TbReport,
    ColorPalette: MdPalette,
    SidebarLeftCollapse: TbLayoutSidebarLeftCollapseFilled,
    SidebarLeftExpand: TbLayoutSidebarLeftExpandFilled,
    SidebarRightCollapse: TbLayoutSidebarRightCollapseFilled,
    SidebarRightExpand: TbLayoutSidebarRightExpandFilled,
};
