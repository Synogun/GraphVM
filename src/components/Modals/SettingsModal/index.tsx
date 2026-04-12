import { AppIcons } from '@/components/common/AppIcons';
import { Tabs, type TabItem } from '@/components/common/tabs';
import { DefaultSettingsData } from '@/constants/settingsDefaults';
import { useModals, useSettings } from '@Contexts';
import { Modal } from '@Modals';
import { useMemo, useState } from 'react';
import { SettingsGraphTab } from './SettingsGraphTab';
import { SettingsInterfaceTab } from './SettingsInterfaceTab';
import { SettingsShortcutsTab } from './SettingsShortcutsTab';

type SettingsTabId = 'interface' | 'graph' | 'shortcuts';

export function SettingsModal() {
    const modals = useModals();
    const [activeTab, setActiveTab] = useState<SettingsTabId>('interface');

    const {
        ui: { setToast, setDisableElementsInfoPanel },
        graph: { setArrangeOn, setLimits },
        setShortcuts,
    } = useSettings();

    const tabConfig = useMemo<TabItem<SettingsTabId>[]>(
        () => [
            {
                id: 'interface',
                label: 'Interface',
                icon: <AppIcons.Info size={16} />,
            },
            {
                id: 'graph',
                label: 'Graph',
                icon: <AppIcons.Arrange size={16} />,
            },
            {
                id: 'shortcuts',
                label: 'Shortcuts',
                icon: <AppIcons.Settings size={16} />,
            },
        ],
        []
    );

    const handleClose = () => {
        setActiveTab('interface');
        modals.setIsSettingsModalOpen(false);
    };

    const handleResetAll = () => {
        setDisableElementsInfoPanel(DefaultSettingsData.ui.disableElementsInfoPanel);
        setToast(DefaultSettingsData.ui.toast);
        setArrangeOn(DefaultSettingsData.graph.arrangeOn);
        setLimits(DefaultSettingsData.graph.limits);
        setShortcuts(DefaultSettingsData.shortcuts);
    };

    const modalActions = (
        <>
            <button className="btn btn-ghost" type="button" onClick={handleResetAll}>
                Reset all
            </button>
            <button className="btn btn-accent" type="button" onClick={handleClose}>
                Close
            </button>
        </>
    );

    return (
        <Modal
            id="settings-modal"
            title="Settings"
            subtitle="Tune feedback, graph behavior, and keyboard bindings."
            show={modals.isSettingsModalOpen}
            onClose={handleClose}
            actions={modalActions}
            boxClassName="w-[min(92vw,64rem)] max-w-[64rem]"
        >
            <main className="grow pt-3">
                <Tabs
                    tabs={tabConfig}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    name="settings-modal-tabs"
                />

                {activeTab === 'interface' && <SettingsInterfaceTab />}
                {activeTab === 'graph' && <SettingsGraphTab />}
                {activeTab === 'shortcuts' && <SettingsShortcutsTab />}
            </main>
        </Modal>
    );
}
