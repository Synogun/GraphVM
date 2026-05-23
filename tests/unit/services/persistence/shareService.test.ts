import LZString from 'lz-string';
import { describe, expect, it } from 'vitest';
import {
    buildShareUrl,
    decodeSharePayload,
    encodeSharePayload,
} from '@/services/persistence/shareService';

describe('encodeSharePayload / decodeSharePayload', () => {
    it('round-trips a payload with null graph', () => {
        const payload = { v: 1 as const, name: 'Test Graph', graph: null };
        const encoded = encodeSharePayload(payload);
        expect(decodeSharePayload(encoded)).toEqual(payload);
    });

    it('round-trips a payload with graph data', () => {
        const payload = {
            v: 1 as const,
            name: 'My Graph',
            graph: {
                elements: { nodes: [{ data: { id: 'n1', label: 'A' } }], edges: [] },
                style: [],
            },
        };
        const encoded = encodeSharePayload(payload);
        expect(decodeSharePayload(encoded)).toEqual(payload);
    });

    it('returns null for garbage input', () => {
        expect(decodeSharePayload('not-valid-encoded-data')).toBeNull();
    });

    it('returns null for valid lz-string but wrong shape', () => {
        const bad = LZString.compressToEncodedURIComponent(
            JSON.stringify({ foo: 'bar' })
        );
        expect(decodeSharePayload(bad)).toBeNull();
    });

    it('returns null for valid lz-string but invalid JSON', () => {
        const bad = LZString.compressToEncodedURIComponent('not { valid json');
        expect(decodeSharePayload(bad)).toBeNull();
    });

    it('encoded output differs from raw JSON', () => {
        const payload = { v: 1 as const, name: 'G', graph: null };
        const encoded = encodeSharePayload(payload);
        expect(encoded).not.toBe(JSON.stringify(payload));
    });
});

describe('buildShareUrl', () => {
    it('appends share param to current location', () => {
        const url = buildShareUrl('abc123');
        expect(url).toMatch(/\?share=abc123$/);
    });

    it('includes origin and pathname', () => {
        const url = buildShareUrl('abc123');
        expect(url).toContain(window.location.origin);
        expect(url).toContain(window.location.pathname);
    });
});
