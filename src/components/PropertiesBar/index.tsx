import type { ReactNode } from 'react';
import { SideBar } from '../common/SideBar';
import { EdgesSection } from './EdgesSection';
import { GraphSection } from './GraphSection';
import { LayoutSection } from './LayoutSection';
import { NodesSection } from './NodesSection';

export function PropertiesBar({ children }: PropertiesBarProps) {

    // const [panelsDisplay, setPanelsDisplay] = useState({
    //     layout: true,
    //     nodes: false,
    //     edges: false,
    // });

    return (
        <SideBar
            id='properties-bar'
            inputId='properties-bar-input'
            side='right'
            sideClassName='select-none shadow-xl/45'
            width='w-70'
            sidebarChildren={ (
                <>
                    <GraphSection />

                    <LayoutSection
                        // visible={ panelsDisplay.layout }
                    />

                    <NodesSection
                        // visible={ panelsDisplay.nodes }
                    />

                    <EdgesSection
                        // visible={ panelsDisplay.edges }
                    />
                </>
            ) }
        >
            {children}
        </SideBar>
    );
}

type PropertiesBarProps = {
    children: ReactNode;
};
