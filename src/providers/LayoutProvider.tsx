import { LayoutContext } from '@/contexts/LayoutContext';
import type { LayoutType } from '@/types/layout';
import { useState, type ReactNode } from 'react';

export function LayoutProvider({ children }: LayoutProviderProps) {
    const [current, setCurrent] = useState<cytoscape.LayoutOptions | undefined>(
        undefined
    );

    const [type, setType] = useState<LayoutType>('circle');

    const [radius, setRadius] = useState(100);

    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    const circleLayout = { radius, setRadius };
    const gridLayout = { rows, setRows, cols, setCols };

    const generalLayout = { current, setCurrent, type, setType };

    const value = { ...generalLayout, circle: circleLayout, grid: gridLayout };

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}

export type LayoutProviderProps = {
    children: ReactNode;
};
