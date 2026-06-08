import type { ReactNode } from 'react';
import { AnimationSidebar } from '@/components/graph/AnimationSidebar';
import { useAnimationStore } from '@/stores/animationStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { SideBar } from '../common/SideBar';
import { EdgesSection } from './EdgesSection';
import { GraphSection } from './GraphSection';
import { LayoutSection } from './LayoutSection';
import { NodesSection } from './NodesSection';

function PropertiesSidebarContent() {
    const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
    const animStatus = useAnimationStore((s) =>
        activeTabId ? (s.tabs[activeTabId]?.status ?? 'idle') : 'idle'
    );

    if (activeTabId && animStatus !== 'idle') {
        return <AnimationSidebar tabId={activeTabId} />;
    }

    return (
        <>
            <GraphSection />
            <LayoutSection />
            <NodesSection />
            <EdgesSection />
        </>
    );
}

export function PropertiesBar({ children }: Readonly<PropertiesBarProps>) {
    return (
        <SideBar
            id="properties-bar"
            inputId="properties-bar-input"
            side="right"
            sideClassName="select-none shadow-xl/45"
            width="w-70"
            sidebarChildren={<PropertiesSidebarContent />}
        >
            {children}
        </SideBar>
    );
}

type PropertiesBarProps = {
    children: ReactNode;
};
