import { type ReactNode } from 'react';
import { AppIcons } from './AppIcons';

const ICON_SIZE = '1.5em';

export function SideBar({
    id,
    inputId,
    children,
    sidebarChildren,
    side = 'left',
    width = 'w-60',
    className,
    sideClassName,
}: SideBarProps) {
    const sidebarWidth = width;

    const openButton = {
        side: side === 'left' ? 'left-4' : 'right-4',
        icon:
            side === 'left'
                ? { open: iconHandlers.left.open, close: iconHandlers.left.close }
                : { open: iconHandlers.right.open, close: iconHandlers.right.close },
    };

    return (
        <div
            id={id}
            className={
                'drawer ' +
                (side === 'left' ? '' : 'drawer-end ') +
                'lg:drawer-open ' +
                (className ?? '')
            }
        >
            <input className="drawer-toggle" id={inputId} type="checkbox" />

            <div className="drawer-content flex flex-col h-screen">
                {children}

                <div className={`fixed top-4 ${openButton.side}`}>
                    <label
                        aria-label="toggle sidebar"
                        className="swap swap-rotate"
                        htmlFor={inputId}
                        id={'toggle-sidebar-' + side}
                        title="Open sidebar"
                    >
                        <input type="checkbox" />
                        {openButton.icon.open}
                        {openButton.icon.close}
                    </label>
                </div>
            </div>

            <div className={`drawer-side z-20 ${sideClassName ?? ''}`}>
                <label aria-label="close sidebar" className="drawer-overlay" htmlFor={inputId} />
                <ul className={`menu bg-base-200 text-base-content min-h-full ${sidebarWidth} p-4`}>
                    {sidebarChildren}
                </ul>
            </div>
        </div>
    );
}

const iconHandlers = {
    left: {
        open: (
            <>
                <AppIcons.SidebarLeftExpand className="swap-off h-10 w-10" size={ICON_SIZE} />
            </>
        ),
        close: (
            <>
                <AppIcons.SidebarLeftCollapse className="swap-on h-10 w-10" size={ICON_SIZE} />
            </>
        ),
    },
    right: {
        open: (
            <>
                <AppIcons.SidebarRightExpand
                    className="swap-off h-10 w-10 fill-current"
                    size={ICON_SIZE}
                />
            </>
        ),
        close: (
            <>
                <AppIcons.SidebarRightCollapse
                    className="swap-on h-10 w-10 fill-current"
                    size={ICON_SIZE}
                />
            </>
        ),
    },
};

type SideBarProps = {
    id?: string;
    inputId: string;
    className?: string;
    sideClassName?: string;
    children?: ReactNode;
    side?: 'left' | 'right';
    width?: string;
    sidebarChildren?: ReactNode;
    open?: boolean;
    condensed?: boolean;
};
