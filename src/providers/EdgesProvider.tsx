import { EdgesContext } from '@/contexts/EdgesContext';
import type { EdgeCurveStyle, EdgeLabelStyle } from '@/types/edges';
import { useState, type ReactNode } from 'react';

export function EdgesProvider({ children }: EdgesProviderProps) {
    const [labelStyle, setLabelStyle] = useState<EdgeLabelStyle>('hidden');
    const [weight, setWeight] = useState(1);
    const [color, setColor] = useState('#cccccc');
    const [lineStyle, setLineStyle] = useState<cytoscape.Css.LineStyle>('solid');
    const [curveStyle, setCurveStyle] = useState<EdgeCurveStyle>('bezier');

    const value = {
        labelStyle,
        setLabelStyle,
        weight,
        setWeight,
        color,
        setColor,
        lineStyle,
        setLineStyle,
        curveStyle,
        setCurveStyle,
    };

    return <EdgesContext.Provider value={value}>{children}</EdgesContext.Provider>;
}

type EdgesProviderProps = {
    children: ReactNode;
};
