import type { IconBaseProps } from 'react-icons';
import { AiOutlineNodeIndex } from 'react-icons/ai';
import { BiExport, BiImport } from 'react-icons/bi';
import { FaCheck, FaGithub } from 'react-icons/fa';
import { FaCircleInfo, FaCode } from 'react-icons/fa6';
import { FiHelpCircle } from 'react-icons/fi';
import { GoTrash } from 'react-icons/go';
import { IoAddCircleOutline, IoClose, IoCloseCircle } from 'react-icons/io5';
import { MdFilterCenterFocus, MdPalette, MdSettings } from 'react-icons/md';
import { PiFediverseLogo, PiGraph, PiLineSegments, PiShuffle } from 'react-icons/pi';
import { RiSave3Fill } from 'react-icons/ri';
import {
    TbLayoutSidebarLeftCollapseFilled,
    TbLayoutSidebarLeftExpandFilled,
    TbLayoutSidebarRightCollapseFilled,
    TbLayoutSidebarRightExpandFilled,
    TbReport,
} from 'react-icons/tb';

export const AppIcons = {
    NewGraph: (props: IconBaseProps) => <PiGraph {...props} />,
    Algorithms: (props: IconBaseProps) => <FaCode {...props} />,
    ImportExport: (props: IconBaseProps) => <RiSave3Fill {...props} />,
    Arrange: (props: IconBaseProps) => <PiShuffle {...props} />,
    Center: (props: IconBaseProps) => <MdFilterCenterFocus {...props} />,
    AddNode: (props: IconBaseProps) => <IoAddCircleOutline {...props} />,
    AddEdges: (props: IconBaseProps) => <AiOutlineNodeIndex {...props} />,
    PathEdgeMode: (props: IconBaseProps) => <PiLineSegments {...props} />,
    CompleteEdgeMode: (props: IconBaseProps) => <PiFediverseLogo {...props} />,
    DeleteElements: (props: IconBaseProps) => <GoTrash {...props} />,
    Settings: (props: IconBaseProps) => <MdSettings {...props} />,
    Help: (props: IconBaseProps) => <FiHelpCircle {...props} />,
    Close: (props: IconBaseProps) => <IoClose {...props} />,
    CloseCircle: (props: IconBaseProps) => <IoCloseCircle {...props} />,
    Github: (props: IconBaseProps) => <FaGithub {...props} />,
    DebugLogs: (props: IconBaseProps) => <TbReport {...props} />,
    ColorPalette: (props: IconBaseProps) => <MdPalette {...props} />,
    SidebarLeftCollapse: (props: IconBaseProps) => (
        <TbLayoutSidebarLeftCollapseFilled {...props} />
    ),
    SidebarLeftExpand: (props: IconBaseProps) => (
        <TbLayoutSidebarLeftExpandFilled {...props} />
    ),
    SidebarRightCollapse: (props: IconBaseProps) => (
        <TbLayoutSidebarRightCollapseFilled {...props} />
    ),
    SidebarRightExpand: (props: IconBaseProps) => (
        <TbLayoutSidebarRightExpandFilled {...props} />
    ),
    Checkmark: (props: IconBaseProps) => <FaCheck {...props} />,
    Import: (props: IconBaseProps) => <BiImport {...props} />,
    Export: (props: IconBaseProps) => <BiExport {...props} />,
    Info: (props: IconBaseProps) => <FaCircleInfo {...props} />,
};
