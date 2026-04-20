import { ActionBar } from '@/components/ActionBar';
import { PropertiesBar } from '@/components/PropertiesBar';
import { DefaultFallback, LoadingHero, ToastArea } from '@/components/feedback';
import { ElementInfoPanel, GraphWorkspace } from '@/components/graph';
import { useGraphShortcuts } from '@/hooks';
import {
    AlgorithmsModal,
    HelpModal,
    ImportExportModal,
    SettingsModal,
} from '@/lazy';
import { AppProviders } from '@/providers';
import { isDev } from '@/utils/general';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import { useSettings } from './contexts';

export function App() {
    const [loadingApp, setLoadingApp] = useState(true);

    const {
        ui: { disableElementsInfoPanel },
    } = useSettings();

    const iconStyle = useMemo(() => ({ style: { verticalAlign: 'middle' } }), []);

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
        <IconContext.Provider value={iconStyle}>
            <AppProviders>
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
                </Suspense>

                <ToastArea />
            </AppProviders>
        </IconContext.Provider>
    );
}

function GraphShortcutsBinding() {
    useGraphShortcuts();
    return null;
}
