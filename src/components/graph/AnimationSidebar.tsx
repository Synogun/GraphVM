import { useEffect, useState } from 'react';
import { useGraphRegistry } from '@Contexts';
import { useAnimationStore } from '@/stores/animationStore';
import type { GraphInstance } from '@/types/graph';
import type { BFSStep } from '@/types';
import { makeScopedGraphRegistryId } from '@/utils/graphRegistry';

type AnimationSidebarProps = {
    tabId: string;
};

export function AnimationSidebar({ tabId }: Readonly<AnimationSidebarProps>) {
    const tab = useAnimationStore((s) => s.tabs[tabId]);
    const registry = useGraphRegistry();
    const [graph, setGraph] = useState<GraphInstance | null>(null);

    useEffect(() => {
        return registry.subscribe(
            makeScopedGraphRegistryId('main-graph', tabId),
            setGraph
        );
    }, [registry, tabId]);

    if (!tab || tab.status === 'idle' || !tab.animation) return null;

    const { animation, currentStepIndex } = tab;
    if (currentStepIndex >= animation.steps.length) return null;
    const step = animation.steps[currentStepIndex];

    const nodeDisplay = (id: string) => {
        const label = graph?.$id(id).data('label') as string | undefined;
        return label ? `${label} (${id})` : id;
    };

    if (animation.algorithm !== 'bfs' && animation.algorithm !== 'dfs') {
        return (
            <div className="text-sm">
                <div className="divider mb-1">
                    <h1 className="text-lg font-bold text-center">Algorithm</h1>
                </div>

                <div className="flex justify-between items-center py-1.5">
                    <span className="text-base-content/60">Algorithm</span>
                    <span className="font-bold font-mono">
                        {animation.algorithm.toUpperCase()}
                    </span>
                </div>

                <div className="divider mb-1">
                    <h1 className="text-lg font-bold text-center">Step</h1>
                </div>

                <div className="flex justify-between items-center py-1.5">
                    <span className="text-base-content/60">Progress</span>
                    <span className="tabular-nums">
                        {currentStepIndex + 1} / {animation.steps.length}
                    </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                    <span className="text-base-content/60">Operation</span>
                    <span className="font-mono text-xs">{step.operation}</span>
                </div>
            </div>
        );
    }

    const traversalStep = step as BFSStep;
    const isBFS = animation.algorithm === 'bfs';
    const frontierLabel = isBFS ? 'Queue' : 'Stack';
    const frontier = traversalStep.frontier as string[];
    const depth = traversalStep.metrics.depth;

    return (
        <div className="text-sm">
            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Algorithm</h1>
            </div>

            <div className="flex justify-between items-center py-1.5">
                <span className="text-base-content/60">Algorithm</span>
                <span className="font-bold font-mono">
                    {animation.algorithm.toUpperCase()}
                </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
                <span className="text-base-content/60">Start</span>
                <span className="font-mono">
                    {nodeDisplay(animation.params.startNodeId)}
                </span>
            </div>

            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Step</h1>
            </div>

            <div className="flex justify-between items-center py-1.5">
                <span className="text-base-content/60">Progress</span>
                <span className="tabular-nums">
                    {currentStepIndex + 1} / {animation.steps.length}
                </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
                <span className="text-base-content/60">Operation</span>
                <span className="font-mono text-xs">{traversalStep.operation}</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
                <span className="text-base-content/60">Current</span>
                <span className="font-mono">{nodeDisplay(traversalStep.currentNode)}</span>
            </div>

            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">{frontierLabel}</h1>
            </div>

            {frontier.length === 0 ? (
                <span className="text-base-content/40 italic text-xs">empty</span>
            ) : (
                <ol className="list-decimal list-inside space-y-0.5 text-xs pb-1">
                    {frontier.map((id, i) => (
                        <li key={`${id}-${String(i)}`} className="font-mono">
                            {nodeDisplay(id)}
                        </li>
                    ))}
                </ol>
            )}

            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Visited</h1>
            </div>

            {traversalStep.visited.length === 0 ? (
                <span className="text-base-content/40 italic text-xs">none</span>
            ) : (
                <div className="flex flex-wrap gap-1 pb-1">
                    {traversalStep.visited.map((id: string) => (
                        <span
                            key={id}
                            className="badge badge-xs badge-success font-mono"
                        >
                            {nodeDisplay(id)}
                        </span>
                    ))}
                </div>
            )}

            <div className="divider mb-1">
                <h1 className="text-lg font-bold text-center">Depth</h1>
            </div>

            <div className="pb-1">
                {Object.entries(depth as Record<string, number>).map(
                    ([nodeId, d]) => (
                        <div
                            key={nodeId}
                            className="flex justify-between text-xs py-0.5"
                        >
                            <span className="font-mono">{nodeDisplay(nodeId)}</span>
                            <span className="tabular-nums">{d}</span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
