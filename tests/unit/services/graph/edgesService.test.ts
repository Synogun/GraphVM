import { ParsedError } from '@/config/parsedError';
import {
    addEdge,
    addEdges,
    assertEdgeLimit,
    makeEdgeId,
    removeEdges,
    updateEdges,
} from '@/services/graph/edgesService';
import { getDefaultEdgesData } from '@/utils/styleHelpers';
import type cytoscape from 'cytoscape';
import { beforeEach, describe, expect, it } from 'vitest';
import {
    createSeededGraph,
    summarizeEdgeRoutes,
    summarizeEdges,
} from './graphTestHelpers';

describe('edgesService', () => {
    let core: cytoscape.Core;

    beforeEach(() => {
        core = createSeededGraph();
    });

    describe('makeEdgeId', () => {
        it('generates ids with expected prefix', () => {
            expect(makeEdgeId()).toMatch(/^e-[a-f0-9]+$/i);
        });

        it('generates different ids across calls', () => {
            const testPool = [];

            // Not 100% guaranteed but collision
            // its mostly impossible from common usage
            for (let i = 0; i < 1000; i++) {
                testPool.push(makeEdgeId());
            }

            const uniqueIds = new Set(testPool);
            expect(uniqueIds.size).toBe(testPool.length);
        });
    });

    describe('assertEdgeLimit', () => {
        it('does not throw when limits not provided', () => {
            expect(() => {
                assertEdgeLimit(2, 1);
            }).not.toThrow();
        });

        it('does not throw when attempted count within limit', () => {
            expect(() => {
                assertEdgeLimit(2, 1, { maxNodes: 10, maxEdges: 3 });
            }).not.toThrow();
        });

        it('throws when attempted count exceeds limit', () => {
            expect(() => {
                assertEdgeLimit(2, 1, { maxNodes: 10, maxEdges: 2 });
            }).toThrow(ParsedError);
        });
    });

    describe('addEdge', () => {
        it('throws when source missing', () => {
            expect(() => {
                addEdge(core, {
                    data: { target: 'b' } as cytoscape.EdgeDataDefinition,
                });
            }).toThrow(ParsedError);
        });

        it('throws when target missing', () => {
            expect(() => {
                addEdge(core, {
                    data: { source: 'a' } as cytoscape.EdgeDataDefinition,
                });
            }).toThrow(ParsedError);
        });

        it('adds edge with merged data and provided classes', () => {
            addEdge(
                core,
                {
                    data: {
                        id: 'edge-1',
                        source: 'a',
                        target: 'b',
                        weight: 7,
                    },
                },
                ['manual-edge']
            );

            const edge = core.$id('edge-1');

            expect(edge.data('source')).toBe('a');
            expect(edge.data('target')).toBe('b');
            expect(edge.data('weight')).toBe(7);
            expect(edge.data('index')).toBe(1);
            expect(edge.hasClass('manual-edge')).toBe(true);
        });

        it('marks edge ghost when explicit ghost flag provided', () => {
            addEdge(core, { data: { source: 'a', target: 'b', isGhost: true } });

            const [edge] = summarizeEdges(core);

            expect(edge.isGhost).toBe(true);
            expect(edge.style).toBe('dashed');
            expect(edge.classes).toContain('ghost-element');
        });

        it('marks edge ghost when endpoint node ghost', () => {
            core = createSeededGraph(['a', { id: 'b', isGhost: true }]);

            addEdge(core, { data: { source: 'a', target: 'b' } });

            const [edge] = summarizeEdges(core);

            expect(edge.isGhost).toBe(true);
            expect(edge.style).toBe('dashed');
            expect(edge.classes).toContain('ghost-element');
        });

        it('adds directed class to actual inserted edge', () => {
            addEdge(core, {
                data: {
                    id: 'edge-1',
                    source: 'a',
                    target: 'b',
                    directed: true,
                },
            });

            expect(core.$id('edge-1').hasClass('directed')).toBe(true);
        });

        it('enforces edge limits', () => {
            expect(() => {
                addEdge(core, { data: { source: 'a', target: 'b' } }, undefined, {
                    maxNodes: 10,
                    maxEdges: 0,
                });
            }).toThrow(ParsedError);
        });
    });

    describe('addEdges', () => {
        it('throws when fewer than two nodes provided', () => {
            expect(() => {
                addEdges(core, ['a']);
            }).toThrow(ParsedError);
        });

        it('creates path edges between consecutive nodes', () => {
            addEdges(core, ['a', 'b', 'c'], 'path', { weight: 5 });

            expect(summarizeEdgeRoutes(core)).toEqual(['a->b', 'b->c']);
            expect(core.edges().map((edge) => Number(edge.data('weight')))).toEqual([
                5, 5,
            ]);
        });

        it('creates complete edge set for node list', () => {
            addEdges(core, ['a', 'b', 'c'], 'complete');

            expect(summarizeEdgeRoutes(core)).toEqual(['b->a', 'c->a', 'c->b']);
        });

        it('enforces edge limits based on created edge count', () => {
            expect(() => {
                addEdges(core, ['a', 'b', 'c'], 'path', undefined, {
                    maxNodes: 10,
                    maxEdges: 1,
                });
            }).toThrow(ParsedError);
        });
    });

    describe('removeEdges', () => {
        it('throws when no edges provided', () => {
            expect(() => {
                removeEdges(core, core.edges());
            }).toThrow(ParsedError);
        });

        it('removes only selected edges', () => {
            addEdges(core, ['a', 'b', 'c'], 'path');

            removeEdges(
                core,
                core.edges().filter((edge) => edge.source().id() === 'a')
            );

            expect(summarizeEdgeRoutes(core)).toEqual(['b->c']);
        });
    });

    describe('updateEdges', () => {
        it('throws when no edge ids provided', () => {
            expect(() => {
                updateEdges(core, [], 'weight', 10);
            }).toThrow(ParsedError);
        });

        it('updates only targeted edges', () => {
            addEdges(core, ['a', 'b', 'c'], 'path');

            const targetId = summarizeEdges(core)[0].id;
            updateEdges(core, [targetId], 'weight', 9);

            const edges = summarizeEdges(core);
            expect(edges.find((edge) => edge.id === targetId)?.weight).toBe(9);
            expect(edges.find((edge) => edge.id !== targetId)?.weight).toBe(1);
        });

        it('falls back to default weight when invalid weight provided', () => {
            const defaults = getDefaultEdgesData(core);
            addEdge(core, { data: { id: 'edge-1', source: 'a', target: 'b' } });

            updateEdges(core, ['edge-1'], 'weight', -1);

            expect(core.$id('edge-1').data('weight')).toBe(defaults.weight);
        });

        it('falls back to default curve when invalid curve provided', () => {
            const defaults = getDefaultEdgesData(core);
            addEdge(core, { data: { id: 'edge-1', source: 'a', target: 'b' } });

            updateEdges(core, ['edge-1'], 'curve', 'bad-curve');

            expect(core.$id('edge-1').data('curve')).toBe(defaults.curve);
        });

        it('falls back to default arrow shape when invalid shape provided', () => {
            const defaults = getDefaultEdgesData(core);
            addEdge(core, { data: { id: 'edge-1', source: 'a', target: 'b' } });

            updateEdges(core, ['edge-1'], 'arrowShape', 'bad-shape');

            expect(core.$id('edge-1').data('arrowShape')).toBe(defaults.arrowShape);
        });

        it('updates line style only for non-ghost edges', () => {
            addEdge(core, { data: { id: 'normal', source: 'a', target: 'b' } });
            addEdge(core, {
                data: { id: 'ghost', source: 'b', target: 'c', isGhost: true },
            });

            updateEdges(core, ['normal', 'ghost'], 'style', 'dotted');

            expect(core.$id('normal').data('style')).toBe('dotted');
            expect(core.$id('ghost').data('style')).toBe('dashed');
        });
    });
});
