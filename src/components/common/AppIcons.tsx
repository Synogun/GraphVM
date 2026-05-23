import type { IconBaseProps } from 'react-icons';
import { AiOutlineNodeIndex } from 'react-icons/ai';
import { BiExport, BiImport } from 'react-icons/bi';
import { FaCheck, FaGithub } from 'react-icons/fa';
import { FaCircleInfo, FaCode } from 'react-icons/fa6';
import { FiHelpCircle } from 'react-icons/fi';
import { GoPencil, GoTrash } from 'react-icons/go';
import { IoIosAdd } from 'react-icons/io';
import {
    IoAddCircleOutline,
    IoClose,
    IoCloseCircle,
    IoCopyOutline,
    IoPause,
    IoPlay,
    IoPlayBack,
    IoPlayForward,
    IoStop,
    IoWarningOutline,
} from 'react-icons/io5';
import {
    MdDeleteSweep,
    MdFilterCenterFocus,
    MdOutlineReplay,
    MdPalette,
    MdSettings,
} from 'react-icons/md';
import {
    PiFediverseLogo,
    PiGhost,
    PiGraph,
    PiLineSegments,
    PiShuffle,
} from 'react-icons/pi';
import { RiSave3Fill } from 'react-icons/ri';
import { TbReport } from 'react-icons/tb';
import {
    VscLayoutSidebarLeftDock,
    VscLayoutSidebarRightDock,
} from 'react-icons/vsc';

export const AppIcons = {
    NewGraph: (props: IconBaseProps) => <PiGraph {...props} />,
    Algorithms: (props: IconBaseProps) => <FaCode {...props} />,
    Save: (props: IconBaseProps) => <RiSave3Fill {...props} />,
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
        <VscLayoutSidebarLeftDock {...props} />
    ),
    SidebarLeftExpand: (props: IconBaseProps) => (
        <VscLayoutSidebarRightDock {...props} />
    ),
    SidebarRightCollapse: (props: IconBaseProps) => (
        <VscLayoutSidebarLeftDock
            {...props}
            className={`${props.className ?? ''} rotate-180`}
        />
    ),
    SidebarRightExpand: (props: IconBaseProps) => (
        <VscLayoutSidebarRightDock
            {...props}
            className={`${props.className ?? ''} rotate-180`}
        />
    ),
    Checkmark: (props: IconBaseProps) => <FaCheck {...props} />,
    Import: (props: IconBaseProps) => <BiImport {...props} />,
    Export: (props: IconBaseProps) => <BiExport {...props} />,
    Info: (props: IconBaseProps) => <FaCircleInfo {...props} />,
    Warning: (props: IconBaseProps) => <IoWarningOutline {...props} />,
    Add: (props: IconBaseProps) => <IoIosAdd {...props} />,
    Edit: (props: IconBaseProps) => <GoPencil {...props} />,
    Copy: (props: IconBaseProps) => <IoCopyOutline {...props} />,
    ClearAll: (props: IconBaseProps) => <MdDeleteSweep {...props} />,
    Ghost: (props: IconBaseProps) => <PiGhost {...props} />,
    AnimPlay: (props: IconBaseProps) => <IoPlay {...props} />,
    AnimPause: (props: IconBaseProps) => <IoPause {...props} />,
    AnimForward: (props: IconBaseProps) => <IoPlayForward {...props} />,
    AnimBackward: (props: IconBaseProps) => <IoPlayBack {...props} />,
    AnimStop: (props: IconBaseProps) => <IoStop {...props} />,
    AnimReplay: (props: IconBaseProps) => <MdOutlineReplay {...props} />,
};
