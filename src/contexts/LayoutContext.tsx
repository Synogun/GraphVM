import cytoscape from 'cytoscape';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';

const LayoutContext = createContext<LayoutProperties | undefined>(undefined);

export function LayoutProvider({ children }: LayoutProviderProps) {
    const [current, setCurrent] = useState<cytoscape.LayoutOptions | undefined>(undefined);

    const [type, setType] = useState<LayoutType>('circle');

    const [radius, setRadius] = useState(100);
    
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    const circleLayout = useMemo(() => ({ radius, setRadius }), [radius]);
    const gridLayout = useMemo(() => ({ rows, setRows, cols, setCols }), [rows, cols]);

    const generalLayout = useMemo(() => ({
        current, setCurrent,
        type, setType,
    }), [current, type]);

    const value = {
        ...generalLayout,
        circle: circleLayout,
        grid: gridLayout,
    };

    return (
        <LayoutContext.Provider value={ value }>
            {children}
        </LayoutContext.Provider>
    );
}
    
export function useLayoutProperties() {
    const context = useContext(LayoutContext);
    
    if (context === undefined) {
        throw new Error('useLayoutProperties must be used within a PropertiesProvider');
    }
    
    return context;
}
    

// ---------- Type Definitions ----------

const LAYOUT_TYPES = [
    'null',
    'circle',
    'random',
    'grid',
    'concentric',
    'breadthfirst',
    'cose'
] as const;
export type LayoutType = typeof LAYOUT_TYPES[number];

export function isLayoutType(value: string): value is LayoutType {
    return LAYOUT_TYPES.includes(value as LayoutType);
}

type LayoutProperties = {
    current: cytoscape.LayoutOptions | undefined;
    setCurrent: (layout: cytoscape.LayoutOptions | undefined) => void;

    type: LayoutType;
    setType: (type: LayoutType) => void;

    circle: {
        radius: number;
        setRadius: (radius: number) => void;
    };

    grid: {
        rows: number;
        setRows: (rows: number) => void;
        cols: number;
        setCols: (cols: number) => void;
    };
};

export type LayoutProviderProps = {
    children: ReactNode;
};
