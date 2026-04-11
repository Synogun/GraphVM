import { lazy } from 'react';

export const AlgorithmsModal = lazy(() =>
    import('@Modals/AlgorithmsModal').then((module) => ({
        default: module.AlgorithmsModal,
    }))
);

export const ImportExportModal = lazy(() =>
    import('@Modals/ImportExportModal').then((module) => ({
        default: module.ImportExportModal,
    }))
);

export const SettingsModal = lazy(() =>
    import('@Modals/SettingsModal').then((module) => ({
        default: module.SettingsModal,
    }))
);

export const HelpModal = lazy(() =>
    import('@Modals/HelpModal').then((module) => ({
        default: module.HelpModal,
    }))
);
