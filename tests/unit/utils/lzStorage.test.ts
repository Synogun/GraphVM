import { beforeEach, describe, expect, it } from 'vitest';
import LZString from 'lz-string';
import { lzLoad, lzSave } from '@/utils/lzStorage';

describe('lzStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('saves and loads data round-trip', () => {
        const data = { foo: 'bar', nums: [1, 2, 3] };
        lzSave('test-key', data);
        const result = lzLoad('test-key') as typeof data | null;
        expect(result).toEqual(data);
    });

    it('returns null for missing key', () => {
        expect(lzLoad('nonexistent')).toBeNull();
    });

    it('stored value is not raw JSON', () => {
        const data = { test: 'value' };
        lzSave('test-key', data);
        const raw = localStorage.getItem('test-key');
        expect(raw).not.toBe(JSON.stringify(data));
    });

    it('returns null for corrupted storage value', () => {
        localStorage.setItem('bad-key', 'not-valid-lz-string');
        expect(lzLoad('bad-key')).toBeNull();
    });

    it('returns null for decompressed but invalid JSON', () => {
        // Store a valid lz-string compressed value that is not valid JSON
        localStorage.setItem(
            'bad-json',
            LZString.compressToBase64('not valid json {')
        );
        expect(lzLoad('bad-json')).toBeNull();
    });
});
