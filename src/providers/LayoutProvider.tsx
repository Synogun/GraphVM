import { LayoutContext } from '@/contexts/LayoutContext';
import type { LayoutType } from '@/types/layout';
import { useMemo, useState, type ReactNode } from 'react';

export function LayoutProvider({ children }: LayoutProviderProps) {
    const [current, setCurrent] = useState<cytoscape.LayoutOptions | undefined>(undefined);

    const [type, setType] = useState<LayoutType>('circle');

    const [radius, setRadius] = useState(100);

    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    const circleLayout = useMemo(() => ({ radius, setRadius }), [radius]);
    const gridLayout = useMemo(() => ({ rows, setRows, cols, setCols }), [rows, cols]);

    const generalLayout = useMemo(
        () => ({
            current,
            setCurrent,
            type,
            setType,
        }),
        [current, type]
    );

    const value = {
        ...generalLayout,
        circle: circleLayout,
        grid: gridLayout,
    };

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export type LayoutProviderProps = {
    children: ReactNode;
};
