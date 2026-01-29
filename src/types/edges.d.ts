export type EdgeCurveStyle =
    | 'haystack'
    | 'straight'
    | 'bezier'
    | 'unbundled-bezier'
    | 'segments'
    | 'taxi'
    | 'round-taxi'
    | 'round-segments';

export type EdgesData = {
    id: string;
    source: string;
    target: string;
    weight: number;
    label: string;
    color: string;
    style: string;
    curve: EdgeCurveStyle;
    arrowShape: string;
};

export type EdgesContextProperties = {
    labelStyle: string;
    setLabelStyle: (labelStyle: string) => void;

    weight: number;
    setWeight: (weight: number) => void;

    color: string;
    setColor: (color: string) => void;

    lineStyle: string;
    setLineStyle: (lineStyle: string) => void;

    curveStyle: EdgeCurveStyle;
    setCurveStyle: (curveStyle: EdgeCurveStyle) => void;
};
