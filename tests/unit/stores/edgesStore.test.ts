import { describe, it, expect, beforeEach } from 'vitest';
import { useEdgesStore } from '@/stores/edgesStore';

describe('edgesStore', () => {
    beforeEach(() => {
        useEdgesStore.setState({
            labelStyle: 'hidden',
            weight: 1,
            color: '#cccccc',
            lineStyle: 'solid',
            curveStyle: 'bezier',
            arrowShape: 'triangle',
        });
    });

    it('initializes with default edge properties', () => {
        const state = useEdgesStore.getState();
        expect(state.labelStyle).toBe('hidden');
        expect(state.weight).toBe(1);
        expect(state.color).toBe('#cccccc');
        expect(state.lineStyle).toBe('solid');
        expect(state.curveStyle).toBe('bezier');
        expect(state.arrowShape).toBe('triangle');
    });

    it('setLabelStyle updates labelStyle', () => {
        useEdgesStore.getState().setLabelStyle('weight');
        expect(useEdgesStore.getState().labelStyle).toBe('weight');
    });

    it('setWeight updates weight', () => {
        useEdgesStore.getState().setWeight(5);
        expect(useEdgesStore.getState().weight).toBe(5);
    });

    it('setColor updates color', () => {
        useEdgesStore.getState().setColor('#ff0000');
        expect(useEdgesStore.getState().color).toBe('#ff0000');
    });

    it('setLineStyle updates lineStyle', () => {
        useEdgesStore.getState().setLineStyle('dashed');
        expect(useEdgesStore.getState().lineStyle).toBe('dashed');
    });

    it('setCurveStyle updates curveStyle', () => {
        useEdgesStore.getState().setCurveStyle('straight');
        expect(useEdgesStore.getState().curveStyle).toBe('straight');
    });

    it('setArrowShape updates arrowShape', () => {
        useEdgesStore.getState().setArrowShape('vee');
        expect(useEdgesStore.getState().arrowShape).toBe('vee');
    });

    it('updating one property does not affect others', () => {
        useEdgesStore.getState().setWeight(10);
        const state = useEdgesStore.getState();
        expect(state.labelStyle).toBe('hidden');
        expect(state.color).toBe('#cccccc');
        expect(state.lineStyle).toBe('solid');
    });
});
