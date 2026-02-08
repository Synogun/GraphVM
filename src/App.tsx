import { ActionBar } from '@/components/ActionBar';
import { GraphCanvas } from '@/components/GraphCanvas';
import { LoadingHero } from '@/components/LoadingHero';
import { PropertiesBar } from '@/components/PropertiesBar';
import { useModals } from '@/contexts/ModalsContext';
import { PropertiesProvider } from '@/providers/PropertiesProvider';
import { isDev } from '@/utils/general';
import { AlgorithmsModal, HelpModal, ImportExportModal, Modal } from '@Modals';
import { useEffect, useState } from 'react';

export function App() {
    const [loadingApp, setLoadingApp] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(
            () => {
                setLoadingApp(false);
            },
            !isDev() ? 5.0 * 1000 : 10
        );

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const modals = useModals();

    return loadingApp ? (
        <LoadingHero />
    ) : (
        <>
            <PropertiesProvider>
                <PropertiesBar>
                    <ActionBar>
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
                        <GraphCanvas containerId="main-graph" />
                    </ActionBar>
                </PropertiesBar>
            </PropertiesProvider>
        </>
    );
}
