import type { ReactNode } from 'react';
import { SideBar } from '../common/SideBar';
import { EdgesSection } from './EdgesSection';
import { GraphSection } from './GraphSection';
import { LayoutSection } from './LayoutSection';
import { NodesSection } from './NodesSection';

export function PropertiesBar({ children }: Readonly<PropertiesBarProps>) {
    return (
        <SideBar
            id="properties-bar"
            inputId="properties-bar-input"
            side="right"
            sideClassName="select-none shadow-xl/45"
            width="w-70"
            sidebarChildren={
                <>
                    <GraphSection />
                    <LayoutSection />
                    <NodesSection />
                    <EdgesSection />
                </>
            }
        >
            {children}
        </SideBar>
    );
}

type PropertiesBarProps = {
    children: ReactNode;
};
