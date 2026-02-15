import type cytoscape from 'cytoscape';

export type EdgeCurveStyle =
    | 'haystack'
    | 'straight'
    | 'bezier'
    | 'unbundled-bezier'
    | 'segments'
    | 'taxi'
    | 'round-taxi'
    | 'round-segments';

export type EdgeLabelStyle = 'hidden' | 'weight' | 'index' | 'custom';

export type EdgesData = {
    id: string;
    source: string;
    target: string;
    weight: number;
    label: EdgeLabelStyle;
    color: string;
    style: cytoscape.Css.LineStyle;
    curve: EdgeCurveStyle;
    arrowShape: cytoscape.Css.ArrowShape;
};

export type EdgesContextProperties = {
    labelStyle: EdgeLabelStyle;
    setLabelStyle: (labelStyle: EdgeLabelStyle) => void;

    weight: number;
    setWeight: (weight: number) => void;

    color: string;
    setColor: (color: string) => void;

    lineStyle: cytoscape.Css.LineStyle;
    setLineStyle: (lineStyle: cytoscape.Css.LineStyle) => void;

    curveStyle: EdgeCurveStyle;
    setCurveStyle: (curveStyle: EdgeCurveStyle) => void;

    arrowShape: cytoscape.Css.ArrowShape;
    setArrowShape: (arrowShape: cytoscape.Css.ArrowShape) => void;
};
