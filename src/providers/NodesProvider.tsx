import { NodesContext } from '@/contexts/NodesContext';
import { useMemo, useState, type ReactNode } from 'react';

export function NodesProvider({ children }: NodesProviderProps) {
    const [color, setColor] = useState('#999999');
    const [shape, setShape] = useState('ellipse');

    const value = useMemo(
        () => ({
            color,
            setColor,
            shape,
            setShape,
        }),
        [color, shape]
    );

    return <NodesContext.Provider value={value}>{children}</NodesContext.Provider>;
}

type NodesProviderProps = {
    children: ReactNode;
};
