import { beforeEach, describe, expect, it } from 'vitest';
import { useModalsStore } from '@/stores/modalsStore';

describe('modalsStore', () => {
    beforeEach(() => {
        useModalsStore.setState({
            isAlgorithmsModalOpen: false,
            isHelpModalOpen: false,
            isSettingsModalOpen: false,
            isImportExportModalOpen: false,
        });
    });

    it('initializes with all modals closed', () => {
        const state = useModalsStore.getState();
        expect(state.isAlgorithmsModalOpen).toBe(false);
        expect(state.isHelpModalOpen).toBe(false);
        expect(state.isSettingsModalOpen).toBe(false);
        expect(state.isImportExportModalOpen).toBe(false);
    });

    it('setIsAlgorithmsModalOpen opens algorithms modal', () => {
        useModalsStore.getState().setIsAlgorithmsModalOpen(true);
        expect(useModalsStore.getState().isAlgorithmsModalOpen).toBe(true);
    });

    it('setIsHelpModalOpen opens help modal', () => {
        useModalsStore.getState().setIsHelpModalOpen(true);
        expect(useModalsStore.getState().isHelpModalOpen).toBe(true);
    });

    it('setIsSettingsModalOpen opens settings modal', () => {
        useModalsStore.getState().setIsSettingsModalOpen(true);
        expect(useModalsStore.getState().isSettingsModalOpen).toBe(true);
    });

    it('setIsImportExportModalOpen opens import/export modal', () => {
        useModalsStore.getState().setIsImportExportModalOpen(true);
        expect(useModalsStore.getState().isImportExportModalOpen).toBe(true);
    });

    it('opening one modal does not affect others', () => {
        useModalsStore.getState().setIsAlgorithmsModalOpen(true);
        const state = useModalsStore.getState();
        expect(state.isHelpModalOpen).toBe(false);
        expect(state.isSettingsModalOpen).toBe(false);
        expect(state.isImportExportModalOpen).toBe(false);
    });
});
