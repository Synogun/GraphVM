import { ActionBar } from '@/components/ActionBar';
import { GraphWorkspace } from '@/components/GraphWorkspace';
import { LoadingHero } from '@/components/LoadingHero';
import { PropertiesBar } from '@/components/PropertiesBar';
import { ToastArea } from '@/components/ToastArea';
import { useGraphShortcuts } from '@/hooks/useGraphShortcuts';
import { PropertiesProvider } from '@/providers/PropertiesProvider';
import { isDev } from '@/utils/general';
import {
    AlgorithmsModal,
    HelpModal,
    ImportExportModal,
    SettingsModal,
} from '@Modals';
import { useEffect, useState } from 'react';
import { ElementInfoPanel } from './components';
import { useSettings } from './contexts';

export function App() {
    const [loadingApp, setLoadingApp] = useState(true);

    const {
        ui: { disableElementsInfoPanel },
    } = useSettings();

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
        <PropertiesProvider>
            <GraphShortcutsBinding />

            <PropertiesBar>
                <ActionBar>
                    <GraphWorkspace />
                    {!disableElementsInfoPanel && <ElementInfoPanel />}
                </ActionBar>
            </PropertiesBar>

            <AlgorithmsModal />
            <ImportExportModal />
            <SettingsModal />
            <HelpModal />

            <ToastArea />
        </PropertiesProvider>
    );
}

function GraphShortcutsBinding() {
    useGraphShortcuts();
    return null;
}
