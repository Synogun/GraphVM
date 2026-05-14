import { DefaultEdgesData } from '@/constants/graphDefaults';
import type { EdgesContextProperties } from '@/types/elements/edges';
import { create } from 'zustand';

type EdgesStore = EdgesContextProperties & {
    setLabelStyle: EdgesContextProperties['setLabelStyle'];
    setWeight: EdgesContextProperties['setWeight'];
    setColor: EdgesContextProperties['setColor'];
    setLineStyle: EdgesContextProperties['setLineStyle'];
    setCurveStyle: EdgesContextProperties['setCurveStyle'];
    setArrowShape: EdgesContextProperties['setArrowShape'];
};

export const useEdgesStore = create<EdgesStore>()((set) => ({
    labelStyle: DefaultEdgesData.label,
    weight: DefaultEdgesData.weight,
    color: DefaultEdgesData.color,
    lineStyle: DefaultEdgesData.style,
    curveStyle: DefaultEdgesData.curve,
    arrowShape: DefaultEdgesData.arrowShape,
    setLabelStyle: (labelStyle) => {
        set({ labelStyle });
    },
    setWeight: (weight) => {
        set({ weight });
    },
    setColor: (color) => {
        set({ color });
    },
    setLineStyle: (lineStyle) => {
        set({ lineStyle });
    },
    setCurveStyle: (curveStyle) => {
        set({ curveStyle });
    },
    setArrowShape: (arrowShape) => {
        set({ arrowShape });
    },
}));
