import { DefaultLayoutOptions } from '@/config/layoutDefaults';
import type { LayoutType } from '@/types/layout';
import { isLayoutType } from '@/types/layoutTypeGuards';
import { LayoutContext } from '@Contexts';
import { useState, type ReactNode } from 'react';

export function LayoutProvider({ children }: LayoutProviderProps) {
    const {
        name: defaultLayoutType,
        radius: defaultRadius,
        rows: defaultRows,
        cols: defaultCols,
    } = DefaultLayoutOptions;

    const [current, setCurrent] = useState<cytoscape.LayoutOptions | undefined>(
        undefined
    );

    const [type, setType] = useState<LayoutType>(
        isLayoutType(defaultLayoutType) ? defaultLayoutType : 'circle'
    );

    const [radius, setRadius] = useState(defaultRadius);

    const [rows, setRows] = useState(defaultRows);
    const [cols, setCols] = useState(defaultCols);

    const circleLayout = { radius, setRadius };
    const gridLayout = { rows, setRows, cols, setCols };

    const generalLayout = { current, setCurrent, type, setType };

    const value = { ...generalLayout, circle: circleLayout, grid: gridLayout };

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export type LayoutProviderProps = {
    children: ReactNode;
};
