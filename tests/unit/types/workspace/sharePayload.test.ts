import { describe, expect, it } from 'vitest';
import { isSharePayload } from '@/types/workspace/typeGuards';

describe('isSharePayload', () => {
    it('accepts valid payload with null graph', () => {
        expect(isSharePayload({ v: 1, name: 'My Graph', graph: null })).toBe(true);
    });

    it('accepts valid payload with graph object', () => {
        expect(
            isSharePayload({ v: 1, name: 'My Graph', graph: { elements: { nodes: [], edges: [] }, style: [] } })
        ).toBe(true);
    });

    it('rejects wrong version', () => {
        expect(isSharePayload({ v: 2, name: 'G', graph: null })).toBe(false);
    });

    it('rejects missing name', () => {
        expect(isSharePayload({ v: 1, graph: null })).toBe(false);
    });

    it('rejects empty name string', () => {
        expect(isSharePayload({ v: 1, name: '', graph: null })).toBe(false);
    });

    it('rejects missing graph field', () => {
        expect(isSharePayload({ v: 1, name: 'G' })).toBe(false);
    });

    it('rejects null input', () => {
        expect(isSharePayload(null)).toBe(false);
    });

    it('rejects non-object input', () => {
        expect(isSharePayload('string')).toBe(false);
        expect(isSharePayload(42)).toBe(false);
    });
});
