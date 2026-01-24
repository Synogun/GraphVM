import { ActionBar } from '@/components/Sidebar/ActionBar';
import { GraphCanvas } from '@/components/GraphCanvas';
import { LoadingHero } from '@/components/LoadingHero';
import { PropertiesBar } from '@/components/PropertiesBar';
import { PropertiesProvider } from '@/providers/PropertiesProvider';
import { isDev } from '@/utils/general';
import { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import { ImportExportModal } from '@/components/Sidebar/ImportExportModal';
import { useModals } from '@/contexts/ModalsContext';

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
                        <Modal
                            id="algorithms-modal"
                            onClose={() => {
                                modals.setIsAlgorithmsModalOpen(false);
                            }}
                            show={modals.isAlgorithmsModalOpen}
                            title="Algorithms"
                        />
                        <ImportExportModal />
                        <Modal
                            id="settings-modal"
                            onClose={() => {
                                modals.setIsSettingsModalOpen(false);
                            }}
                            show={modals.isSettingsModalOpen}
                            title="Settings"
                        />
                        <Modal
                            id="help-modal"
                            onClose={() => {
                                modals.setIsHelpModalOpen(false);
                            }}
                            show={modals.isHelpModalOpen}
                            title="Help"
                        />
                        <GraphCanvas containerId="main-graph" />
                    </ActionBar>
                </PropertiesBar>
            </PropertiesProvider>
        </>
    );
}
