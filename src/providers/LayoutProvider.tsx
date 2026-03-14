import { DefaultLayoutOptions } from '@/constants/layoutDefaults';
import type { LayoutType } from '@/types/layout';
import { isLayoutType } from '@/types/layoutTypeGuards';
import { LayoutContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';

export function LayoutProvider({ children }: Readonly<LayoutProviderProps>) {
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

    const value = useMemo(() => {
        const generalLayout = { current, setCurrent, type, setType };

        return {
            ...generalLayout,
            circle: { radius, setRadius },
            grid: { rows, setRows, cols, setCols },
        };
    }, [current, type, radius, rows, cols]);

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export type LayoutProviderProps = {
    children: ReactNode;
};
