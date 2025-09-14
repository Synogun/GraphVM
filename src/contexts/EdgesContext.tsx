import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const EdgesContext = createContext<EdgesProperties | undefined>(undefined);
    
export function EdgesProvider({ children }: EdgesProviderProps) {
    const [labelStyle, setLabelStyle] = useState('hidden');
    const [weight, setWeight] = useState(1);
    const [color, setColor] = useState('#cccccc');
    const [lineStyle, setLineStyle] = useState('solid');
    const [curveStyle, setCurveStyle] = useState('bezier');

    const value = useMemo(() => ({
        labelStyle, setLabelStyle,
        weight, setWeight,
        color, setColor,
        lineStyle, setLineStyle,
        curveStyle, setCurveStyle
    }), [labelStyle, weight, color, lineStyle, curveStyle]);

    return (
        <EdgesContext.Provider value={ value }>
            {children}
        </EdgesContext.Provider>
    );
}

export function useEdgesProperties() {
    const context = useContext(EdgesContext);
    
    if (context === undefined) {
        throw new Error('useEdgesProperties must be used within a PropertiesProvider');
    }
    
    return context;
}

type EdgesProperties = {
    labelStyle: string;
    setLabelStyle: (labelStyle: string) => void;

    weight: number;
    setWeight: (weight: number) => void;

    color: string;
    setColor: (color: string) => void;

    lineStyle: string;
    setLineStyle: (lineStyle: string) => void;

    curveStyle: string;
    setCurveStyle: (curveStyle: string) => void;
};

type EdgesProviderProps = {
    children: ReactNode;
};
