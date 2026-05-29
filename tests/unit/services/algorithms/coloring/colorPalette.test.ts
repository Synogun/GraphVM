import { describe, expect, it } from 'vitest';
import { generatePalette } from '@/services/algorithms/coloring/colorPalette';

describe('generatePalette', () => {
    it('returns n colors', () => {
        expect(generatePalette(5)).toHaveLength(5);
    });
    it('returns valid hex strings', () => {
        for (const c of generatePalette(8)) {
            expect(c).toMatch(/^#[0-9a-f]{6}$/i);
        }
    });
    it('returns distinct colors for n > 1', () => {
        const p = generatePalette(6);
        expect(new Set(p).size).toBe(6);
    });
    it('returns empty array for n=0', () => {
        expect(generatePalette(0)).toEqual([]);
    });
});
