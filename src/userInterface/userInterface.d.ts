
export type NodeField = 'label' | 'color' | 'shape';

export interface NodeFieldValues {
    label: string;
    color: string;
    shape: string;
}

export type EdgeField = 'weight' | 'label' | 'color' | 'style' | 'curve';

export interface EdgeFieldValues {
    weight: string;
    label: string;
    color: string;
    style: string;
    curve: string;
}
