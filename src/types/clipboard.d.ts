import type { EdgesData } from '@/types/elements/edges';
import type { NodesData } from '@/types/elements/nodes';

export type ClipboardNode = {
    data: NodesData; // includes id — preserved for oldId→newId remap on paste
    position: { x: number; y: number }; // model space
    classes: string[];
};

export type ClipboardEdge = {
    data: EdgesData;
    classes: string[];
};

export type ClipboardPayload = {
    graphvm: true;
    version: 1;
    nodes: ClipboardNode[];
    edges: ClipboardEdge[];
};
