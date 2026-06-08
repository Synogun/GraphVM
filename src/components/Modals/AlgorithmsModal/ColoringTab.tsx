import { SelectInput } from '@/components/common';
import { parseError } from '@/config/parsedError';
import { ParsedErrorToasts } from '@/constants';
import { useGetGraph } from '@/hooks';
import {
    runHlpEdgeColoringAnimation,
    runMisraGriesAnimation,
} from '@/services/algorithms/coloring';
import { useAnimationStore } from '@/stores/animationStore';
import { useGraphMetaStore } from '@/stores/graphMetaStore';
import { useGraphWorkspaceStore } from '@/stores/graphWorkspaceStore';
import { parseKebabCase } from '@/utils/elements';
import { useToasts } from '@Contexts';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { ColoringParamsSection } from './ColoringAlgorithmsParams';

type ColoringAlgorithmOption = 'misra-gries';

type AlgorithmEntry = { description: string };

const ALGORITHM_MAP: Record<ColoringAlgorithmOption, AlgorithmEntry> = {
    'misra-gries': {
        description:
            'Misra & Gries edge coloring assigns colors to every edge such that no two edges sharing a vertex share a color. Works on any simple graph and uses at most Δ+1 colors where Δ is the maximum degree. On HLP graphs, exploits the Cayley graph structure automatically.',
    },
};

const ALGORITHM_OPTIONS = Object.keys(ALGORITHM_MAP) as ColoringAlgorithmOption[];

export type ColoringTabRef = {
    handleRun: () => void;
};

type ColoringTabProps = {
    isOpen: boolean;
};

export const ColoringTab = forwardRef<ColoringTabRef, ColoringTabProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ isOpen: _ }, ref) => {
        const graph = useGetGraph('main-graph');
        const { addToast } = useToasts();
        const activeTabId = useGraphWorkspaceStore((s) => s.activeTabId);
        const { initAnimation, play } = useAnimationStore.getState();
        const families = useGraphMetaStore((s) => s.families);

        const handleRun = () => {
            const activeGraph = graph.current;

            if (!activeGraph) {
                addToast(ParsedErrorToasts.GraphNotFound);
                return;
            }

            if (!activeTabId) {
                addToast({ type: 'error', message: 'No active tab found.' });
                return;
            }

            try {
                const animation = families.includes('hlp')
                    ? runHlpEdgeColoringAnimation(activeGraph, {
                          algorithm: 'hlp-edge-coloring',
                      })
                    : runMisraGriesAnimation(activeGraph, {
                          algorithm: 'misra-gries',
                      });
                initAnimation(activeTabId, animation);
                play(activeTabId);
            } catch (error) {
                const parsedError = parseError(error);
                addToast({ type: 'error', message: parsedError.message });
            }
        };

        useImperativeHandle(ref, () => ({ handleRun }));

        const selectOptions = useMemo(
            () =>
                ALGORITHM_OPTIONS.map((algorithm) => ({
                    label: parseKebabCase(algorithm),
                    value: algorithm,
                })),
            []
        );

        return (
            <div className="flex flex-col gap-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <SelectInput
                            label="Coloring Algorithm"
                            options={selectOptions}
                            value="misra-gries"
                            onChange={() => void 0}
                        />
                        <p className="ml-1 mt-1 text-xs text-base-content/70">
                            Select the edge coloring algorithm to run.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1 ml-1 text-xs opacity-50">
                            <strong>DESCRIPTION</strong>
                        </span>
                        <div className="flex flex-1 items-center rounded-lg bg-base-200 p-3 text-sm text-base-content/80">
                            {ALGORITHM_MAP['misra-gries'].description}
                        </div>
                    </div>
                </div>

                <div className="divider text-sm opacity-50 mb-0" />

                <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">Parameters</span>
                    <p className="text-xs text-base-content/70">
                        Configure the parameters for the selected coloring algorithm.
                    </p>
                </div>

                <ColoringParamsSection />
            </div>
        );
    }
);
