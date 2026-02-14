export type LayoutType =
    | 'null'
    | 'circle'
    | 'random'
    | 'grid'
    | 'concentric'
    | 'breadthfirst'
    | 'preset'
    | 'fcose';

export type LayoutContextProperties = {
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
