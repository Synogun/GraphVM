import { type ReactNode } from 'react';
import { AppIcons } from './AppIcons';

const ICON_SIZE = '1.5em';

export function SideBar({
    id,
    inputId,
    children,
    sidebarChildren,
    openOnLarge = true,
    side = 'left',
    width = 'w-60',
    className,
    sideClassName,
}: Readonly<SideBarProps>) {
    return (
        <div
            id={id}
            className={
                'drawer ' +
                (side === 'left' ? '' : 'drawer-end ') +
                (openOnLarge ? 'lg:drawer-open ' : '') +
                (className ?? '')
            }
        >
            <input className="drawer-toggle" id={inputId} type="checkbox" />

            <div className="drawer-content flex flex-col h-screen">
                {children}

                <div
                    className={[
                        'fixed top-16',
                        side === 'left' ? 'left-4' : 'right-4',
                        ...(openOnLarge ? [] : ['lg:hidden']),
                    ].join(' ')}
                >
                    <label
                        aria-label="toggle sidebar"
                        htmlFor={inputId}
                        id={['toggle-sidebar', side, inputId].join('-')}
                        title="Open sidebar"
                    >
                        {side === 'left' ? (
                            <AppIcons.SidebarLeftExpand size={ICON_SIZE} />
                        ) : (
                            <AppIcons.SidebarRightExpand size={ICON_SIZE} />
                        )}
                    </label>
                </div>
            </div>

            <div className={`drawer-side z-20 ${sideClassName ?? ''}`}>
                <label
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    htmlFor={inputId}
                />
                <ul
                    className={`menu bg-base-200 text-base-content min-h-full ${width} p-4`}
                >
                    {sidebarChildren}
                </ul>
            </div>
        </div>
    );
}

type SideBarProps = {
    id?: string;
    inputId: string;
    className?: string;
    sideClassName?: string;
    children?: ReactNode;
    side?: 'left' | 'right';
    width?: string;
    sidebarChildren?: ReactNode;
    openOnLarge?: boolean;
    open?: boolean;
    condensed?: boolean;
};
