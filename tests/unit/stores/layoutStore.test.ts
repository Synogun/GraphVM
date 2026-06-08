import { useLayoutStore } from '@/stores/layoutStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('layoutStore', () => {
    beforeEach(() => {
        useLayoutStore.setState({
            current: undefined,
            type: 'fcose',
            radius: 100,
            rows: 3,
            cols: 3,
        });
    });

    it('initializes with default layout properties', () => {
        const state = useLayoutStore.getState();
        expect(state.current).toBeUndefined();
        expect(state.type).toBe('fcose');
        expect(state.radius).toBe(100);
        expect(state.rows).toBe(3);
        expect(state.cols).toBe(3);
    });

    it('setCurrent updates current with a value', () => {
        const layout = { name: 'circle' } as cytoscape.LayoutOptions;
        useLayoutStore.getState().setCurrent(layout);
        expect(useLayoutStore.getState().current).toEqual({ name: 'circle' });
    });

    it('setCurrent supports updater function', () => {
        const initial = { name: 'circle', radius: 50 } as cytoscape.LayoutOptions;
        useLayoutStore.setState({ current: initial });
        useLayoutStore.getState().setCurrent((prev) => ({ ...prev, radius: 200 }));
        expect(
            (useLayoutStore.getState().current as { radius: number }).radius
        ).toBe(200);
    });

    it('setType updates layout type', () => {
        useLayoutStore.getState().setType('grid');
        expect(useLayoutStore.getState().type).toBe('grid');
    });

    it('setRadius updates circle radius', () => {
        useLayoutStore.getState().setRadius(250);
        expect(useLayoutStore.getState().radius).toBe(250);
    });

    it('setRows updates grid rows', () => {
        useLayoutStore.getState().setRows(5);
        expect(useLayoutStore.getState().rows).toBe(5);
    });

    it('setCols updates grid cols', () => {
        useLayoutStore.getState().setCols(4);
        expect(useLayoutStore.getState().cols).toBe(4);
    });

    it('updating rows does not affect cols', () => {
        useLayoutStore.getState().setRows(6);
        expect(useLayoutStore.getState().cols).toBe(3);
    });
});
