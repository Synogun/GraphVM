import { DefaultEdgesData } from '@/config/graphDefaults';
import { EdgesContext } from '@/contexts/EdgesContext';
import type { EdgeCurveStyle, EdgeLabelStyle } from '@/types/edges';
import { useState, type ReactNode } from 'react';

export function EdgesProvider({ children }: EdgesProviderProps) {
    const {
        label: defaultLabelStyle,
        weight: defaultWeight,
        color: defaultColor,
        style: defaultLineStyle,
        curve: defaultCurveStyle,
    } = DefaultEdgesData;

    const [labelStyle, setLabelStyle] = useState<EdgeLabelStyle>(defaultLabelStyle);
    const [weight, setWeight] = useState(defaultWeight);
    const [color, setColor] = useState(defaultColor);
    const [lineStyle, setLineStyle] =
        useState<cytoscape.Css.LineStyle>(defaultLineStyle);
    const [curveStyle, setCurveStyle] = useState<EdgeCurveStyle>(defaultCurveStyle);

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
