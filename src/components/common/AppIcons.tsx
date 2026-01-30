import { AiOutlineNodeIndex } from 'react-icons/ai';
import { FaGithub } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa6';
import { FiHelpCircle } from 'react-icons/fi';
import { GoTrash } from 'react-icons/go';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdFilterCenterFocus, MdPalette, MdSettings } from 'react-icons/md';
import {
    PiFediverseLogo,
    PiGraph,
    PiLineSegments,
    PiShuffle,
} from 'react-icons/pi';
import { RiSave3Fill } from 'react-icons/ri';
import {
    TbLayoutSidebarLeftCollapseFilled,
    TbLayoutSidebarLeftExpandFilled,
    TbLayoutSidebarRightCollapseFilled,
    TbLayoutSidebarRightExpandFilled,
    TbReport,
} from 'react-icons/tb';

export const AppIcons = {
    NewGraph: ({ size, className }: AppIconPropsParams) => (
        <PiGraph size={size} className={className} />
    ),
    Algorithms: ({ size, className }: AppIconPropsParams) => (
        <FaCode size={size} className={className} />
    ),
    ImportExport: ({ size, className }: AppIconPropsParams) => (
        <RiSave3Fill size={size} className={className} />
    ),
    Arrange: ({ size, className }: AppIconPropsParams) => (
        <PiShuffle size={size} className={className} />
    ),
    Center: ({ size, className }: AppIconPropsParams) => (
        <MdFilterCenterFocus size={size} className={className} />
    ),
    AddNode: ({ size, className }: AppIconPropsParams) => (
        <IoAddCircleOutline size={size} className={className} />
    ),
    AddEdges: ({ size, className }: AppIconPropsParams) => (
        <AiOutlineNodeIndex size={size} className={className} />
    ),
    PathEdgeMode: ({ size, className }: AppIconPropsParams) => (
        <PiLineSegments size={size} className={className} />
    ),
    CompleteEdgeMode: ({ size, className }: AppIconPropsParams) => (
        <PiFediverseLogo size={size} className={className} />
    ),
    DeleteElements: ({ size, className }: AppIconPropsParams) => (
        <GoTrash size={size} className={className} />
    ),
    Settings: ({ size, className }: AppIconPropsParams) => (
        <MdSettings size={size} className={className} />
    ),
    Help: ({ size, className }: AppIconPropsParams) => (
        <FiHelpCircle size={size} className={className} />
    ),
    Github: ({ size, className }: AppIconPropsParams) => (
        <FaGithub size={size} className={className} />
    ),
    DebugLogs: ({ size, className }: AppIconPropsParams) => (
        <TbReport size={size} className={className} />
    ),
    ColorPalette: ({ size, className }: AppIconPropsParams) => (
        <MdPalette size={size} className={className} />
    ),
    SidebarLeftCollapse: ({ size, className }: AppIconPropsParams) => (
        <TbLayoutSidebarLeftCollapseFilled size={size} className={className} />
    ),
    SidebarLeftExpand: ({ size, className }: AppIconPropsParams) => (
        <TbLayoutSidebarLeftExpandFilled size={size} className={className} />
    ),
    SidebarRightCollapse: ({ size, className }: AppIconPropsParams) => (
        <TbLayoutSidebarRightCollapseFilled size={size} className={className} />
    ),
    SidebarRightExpand: ({ size, className }: AppIconPropsParams) => (
        <TbLayoutSidebarRightExpandFilled size={size} className={className} />
    ),
};

type AppIconPropsParams = {
    size?: number | string;
    className?: string;
};
