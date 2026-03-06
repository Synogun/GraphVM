import { ActionBar } from '@/components/ActionBar';
import { GraphCanvas } from '@/components/GraphCanvas';
import { LoadingHero } from '@/components/LoadingHero';
import { PropertiesBar } from '@/components/PropertiesBar';
import { ToastArea } from '@/components/ToastArea';
import { PropertiesProvider } from '@/providers/PropertiesProvider';
import { isDev } from '@/utils/general';
import { useModals } from '@Contexts';
import { AlgorithmsModal, HelpModal, ImportExportModal, Modal } from '@Modals';
import { useEffect, useState } from 'react';

export function App() {
    const [loadingApp, setLoadingApp] = useState(true);
    const modals = useModals();

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

    return loadingApp ? (
        <LoadingHero />
    ) : (
        <>
            <PropertiesProvider>
                <PropertiesBar>
                    <ActionBar>
                        <GraphCanvas containerId="main-graph" />
                    </ActionBar>
                </PropertiesBar>

                <AlgorithmsModal />
                <ImportExportModal />
                <Modal
                    id="settings-modal"
                    onClose={() => {
                        modals.setIsSettingsModalOpen(false);
                    }}
                    show={modals.isSettingsModalOpen}
                    title="Settings"
                >
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-base-content/80">
                            Settings will be added in a future update.
                        </p>
                    </div>
                </Modal>
                <HelpModal />

                <ToastArea />
            </PropertiesProvider>
        </>
    );
}
