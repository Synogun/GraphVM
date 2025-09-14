import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const NodesContext = createContext<NodeProperties | undefined>(undefined);
    
export function NodesProvider({ children }: NodesProviderProps) {
    const [color, setColor] = useState('#999999');
    const [shape, setShape] = useState('ellipse');

    const value = useMemo(() => ({
        color, setColor,
        shape, setShape
    }), [color, shape]);

    return (
        <NodesContext.Provider value={ value }>
            {children}
        </NodesContext.Provider>
    );
}

export function useNodeProperties() {
    const context = useContext(NodesContext);
    
    if (context === undefined) {
        throw new Error('useNodeProperties must be used within a PropertiesProvider');
    }
    return context;
}

// ---------- Type Definitions ----------

type NodeProperties = {
    color: string;
    setColor: (color: string) => void;
    shape: string;
    setShape: (shape: string) => void;
};

type NodesProviderProps = {
    children: ReactNode;
};
