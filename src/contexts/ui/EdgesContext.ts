import { useEdgesStore } from '@/stores/edgesStore';

export function useEdgesProperties() {
    const labelStyle = useEdgesStore((s) => s.labelStyle);
    const weight = useEdgesStore((s) => s.weight);
    const color = useEdgesStore((s) => s.color);
    const lineStyle = useEdgesStore((s) => s.lineStyle);
    const curveStyle = useEdgesStore((s) => s.curveStyle);
    const arrowShape = useEdgesStore((s) => s.arrowShape);
    const setLabelStyle = useEdgesStore((s) => s.setLabelStyle);
    const setWeight = useEdgesStore((s) => s.setWeight);
    const setColor = useEdgesStore((s) => s.setColor);
    const setLineStyle = useEdgesStore((s) => s.setLineStyle);
    const setCurveStyle = useEdgesStore((s) => s.setCurveStyle);
    const setArrowShape = useEdgesStore((s) => s.setArrowShape);

    return {
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
    };
}
