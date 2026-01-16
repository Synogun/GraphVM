import { EdgesContext } from '@/contexts/EdgesContext';
import type { EdgeCurveStyle } from '@/types/edges';
import { useMemo, useState, type ReactNode } from 'react';

export function EdgesProvider({ children }: EdgesProviderProps) {
    const [labelStyle, setLabelStyle] = useState('hidden');
    const [weight, setWeight] = useState(1);
    const [color, setColor] = useState('#cccccc');
    const [lineStyle, setLineStyle] = useState('solid');
    const [curveStyle, setCurveStyle] = useState<EdgeCurveStyle>('bezier');

    const value = useMemo(
        () => ({
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
        }),
        [labelStyle, weight, color, lineStyle, curveStyle]
    );

    return <EdgesContext.Provider value={value}>{children}</EdgesContext.Provider>;
}

type EdgesProviderProps = {
    children: ReactNode;
};
