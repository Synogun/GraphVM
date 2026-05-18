import { ActionBar } from '@/components/ActionBar';
import { PropertiesBar } from '@/components/PropertiesBar';
import { DefaultFallback, LoadingHero, ToastArea } from '@/components/feedback';
import { ElementInfoPanel, GraphWorkspace } from '@/components/graph';
import { useGraphShortcuts } from '@/hooks';
import {
    AlgorithmsModal,
    EdgeLabelModal,
    HelpModal,
    ImportExportModal,
    NodeLabelModal,
    SettingsModal,
} from '@/lazy';
import { isDev } from '@/utils/general';
import { Suspense, useEffect, useState } from 'react';
import { useSettings } from './contexts';

export function App() {
    const [loadingApp, setLoadingApp] = useState(true);

    const {
        ui: { disableElementsInfoPanel, theme },
    } = useSettings();

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        // Simulated loading time - Users thinks its more natural
        // https://uxmag.com/articles/let-your-users-wait
        // https://www.reddit.com/r/webdev/comments/ul3tij/does_anyone_add_artificial_loading_time_to_their/
        const timer = setTimeout(
            () => {
                setLoadingApp(false);
            },
            isDev() ? 0 : 700 + Math.random() * 300 // 700-1000ms
        );

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (loadingApp) {
        return <LoadingHero />;
    }

    return (
        <>
            <GraphShortcutsBinding />

            <PropertiesBar>
                <ActionBar>
                    <GraphWorkspace />
                    {!disableElementsInfoPanel && <ElementInfoPanel />}
                </ActionBar>
            </PropertiesBar>

            <Suspense fallback={<DefaultFallback />}>
                <AlgorithmsModal />
                <ImportExportModal />
                <SettingsModal />
                <HelpModal />
                <NodeLabelModal />
                <EdgeLabelModal />
            </Suspense>

            <ToastArea />
        </>
    );
}

function GraphShortcutsBinding() {
    useGraphShortcuts();
    return null;
}
