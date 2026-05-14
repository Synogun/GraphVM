import { DefaultLayoutOptions } from '@/constants/layoutDefaults';
import type { LayoutType } from '@/types/ui/layout';
import { isLayoutType } from '@/types/ui/layout/typeGuards';
import type cytoscape from 'cytoscape';
import { create } from 'zustand';

type LayoutStore = {
    current: cytoscape.LayoutOptions | undefined;
    type: LayoutType;
    radius: number;
    rows: number;
    cols: number;
    setCurrent: (
        layout:
            | cytoscape.LayoutOptions
            | ((
                  prev: cytoscape.LayoutOptions | undefined
              ) => cytoscape.LayoutOptions)
    ) => void;
    setType: (type: LayoutType) => void;
    setRadius: (radius: number) => void;
    setRows: (rows: number) => void;
    setCols: (cols: number) => void;
};

export const useLayoutStore = create<LayoutStore>()((set) => ({
    current: undefined,
    type: isLayoutType(DefaultLayoutOptions.name)
        ? DefaultLayoutOptions.name
        : 'circle',
    radius: DefaultLayoutOptions.radius,
    rows: DefaultLayoutOptions.rows,
    cols: DefaultLayoutOptions.cols,
    setCurrent: (layout) => {
        set((state) => ({
            current: typeof layout === 'function' ? layout(state.current) : layout,
        }));
    },
    setType: (type) => {
        set({ type });
    },
    setRadius: (radius) => {
        set({ radius });
    },
    setRows: (rows) => {
        set({ rows });
    },
    setCols: (cols) => {
        set({ cols });
    },
}));
