import { useNodesStore } from '@/stores/nodesStore';

export function useNodeProperties() {
    const color = useNodesStore((s) => s.color);
    const shape = useNodesStore((s) => s.shape);
    const setColor = useNodesStore((s) => s.setColor);
    const setShape = useNodesStore((s) => s.setShape);

    return { color, setColor, shape, setShape };
}
