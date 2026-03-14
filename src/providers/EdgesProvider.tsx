import { DefaultEdgesData } from '@/constants/graphDefaults';
import type { EdgeCurveStyle, EdgeLabelStyle } from '@/types/edges';
import { EdgesContext } from '@Contexts';
import { useMemo, useState, type ReactNode } from 'react';

export function EdgesProvider({ children }: Readonly<EdgesProviderProps>) {
    const {
        label: defaultLabelStyle,
        weight: defaultWeight,
        color: defaultColor,
        style: defaultLineStyle,
        curve: defaultCurveStyle,
        arrowShape: defaultArrowShape,
    } = DefaultEdgesData;

    const [labelStyle, setLabelStyle] = useState<EdgeLabelStyle>(defaultLabelStyle);
    const [weight, setWeight] = useState(defaultWeight);
    const [color, setColor] = useState(defaultColor);
    const [lineStyle, setLineStyle] =
        useState<cytoscape.Css.LineStyle>(defaultLineStyle);
    const [curveStyle, setCurveStyle] = useState<EdgeCurveStyle>(defaultCurveStyle);
    const [arrowShape, setArrowShape] =
        useState<cytoscape.Css.ArrowShape>(defaultArrowShape);

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
            arrowShape,
            setArrowShape,
        }),
        [labelStyle, weight, color, lineStyle, curveStyle, arrowShape]
    );

    return <EdgesContext.Provider value={value}>{children}</EdgesContext.Provider>;
}

type EdgesProviderProps = {
    children: ReactNode;
};
