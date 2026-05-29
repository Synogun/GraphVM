import { describe, it, expect } from 'vitest';
import {
    freeColor,
    isColorFree,
    buildMaximalFan,
    findCdPath,
    invertPath,
    rotateFan,
    assignColor,
} from '@/services/algorithms/coloring/misraGriesCore';
import type { ColorMap, EdgeColorMap } from '@/services/algorithms/coloring/misraGriesCore';

describe('freeColor', () => {
    it('returns 1 when no colors used', () => {
        expect(freeColor('a', new Map())).toBe(1);
    });
    it('skips used colors', () => {
        const C: ColorMap = new Map([['a', new Map([[1, 'b'], [2, 'c']])]]);
        expect(freeColor('a', C)).toBe(3);
    });
});

describe('isColorFree', () => {
    it('returns true when color absent', () => {
        const C: ColorMap = new Map([['a', new Map([[1, 'b']])]]);
        expect(isColorFree('a', 2, C)).toBe(true);
    });
    it('returns false when color used', () => {
        const C: ColorMap = new Map([['a', new Map([[1, 'b']])]]);
        expect(isColorFree('a', 1, C)).toBe(false);
    });
});

describe('buildMaximalFan', () => {
    it('returns [v0] when no neighbor via free color of v0', () => {
        expect(buildMaximalFan('u', 'v0', new Map(), new Map())).toEqual(['v0']);
    });
    it('extends fan via free color chain', () => {
        // u-v1 has color 1; freeColor(v0)=1 since C[v0] empty => C[u][1]='v1'
        // fan should be ['v0','v1']
        const C: ColorMap = new Map([
            ['u', new Map([[1, 'v1']])],
            ['v1', new Map([[1, 'u']])],
        ]);
        const G: EdgeColorMap = new Map([
            ['u', new Map([['v1', 1]])],
            ['v1', new Map([['u', 1]])],
        ]);
        expect(buildMaximalFan('u', 'v0', C, G)).toEqual(['v0', 'v1']);
    });
});

describe('findCdPath', () => {
    it('returns just [u] when alpha not used at u', () => {
        expect(findCdPath('u', 1, 2, new Map())).toEqual(['u']);
    });
    it('follows alternating colors', () => {
        // u -alpha-> a -beta-> b
        const C: ColorMap = new Map([
            ['u', new Map([[1, 'a']])],
            ['a', new Map([[2, 'b']])],
        ]);
        expect(findCdPath('u', 1, 2, C)).toEqual(['u', 'a', 'b']);
    });
});

describe('invertPath', () => {
    it('swaps alpha and beta along a 2-vertex path', () => {
        const C: ColorMap = new Map([
            ['a', new Map([[1, 'b']])],
            ['b', new Map([[1, 'a']])],
        ]);
        const G: EdgeColorMap = new Map([
            ['a', new Map([['b', 1]])],
            ['b', new Map([['a', 1]])],
        ]);
        invertPath(['a', 'b'], 1, 2, C, G);
        expect(G.get('a')?.get('b')).toBe(2);
        expect(C.get('a')?.get(2)).toBe('b');
        expect(C.get('a')?.has(1)).toBe(false);
    });
});

describe('rotateFan', () => {
    it('shifts color from fan[1] to fan[0] and uncolors fan[1]', () => {
        // (u,v0) uncolored, (u,v1) has color 2
        const C: ColorMap = new Map([
            ['u', new Map([[2, 'v1']])],
            ['v1', new Map([[2, 'u']])],
        ]);
        const G: EdgeColorMap = new Map([
            ['u', new Map([['v0', 0], ['v1', 2]])],
            ['v1', new Map([['u', 2]])],
            ['v0', new Map([['u', 0]])],
        ]);
        rotateFan(['v0', 'v1'], 'u', C, G);
        expect(G.get('u')?.get('v0')).toBe(2);
        expect(G.get('u')?.get('v1')).toBe(0);
        expect(C.get('u')?.get(2)).toBe('v0');
        expect(C.get('u')?.has(2)).toBe(true);
    });
});

describe('assignColor', () => {
    it('sets G and C in both directions', () => {
        const C: ColorMap = new Map();
        const G: EdgeColorMap = new Map();
        assignColor('a', 'b', 3, C, G);
        expect(G.get('a')?.get('b')).toBe(3);
        expect(G.get('b')?.get('a')).toBe(3);
        expect(C.get('a')?.get(3)).toBe('b');
        expect(C.get('b')?.get(3)).toBe('a');
    });
});
