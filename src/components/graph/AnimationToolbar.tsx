import { useAnimationStore } from '@/stores/animationStore';
import { useEffect, useRef, useState } from 'react';
import { AppIcons } from '../common';

const SPEEDS = [0.25, 0.5, 1, 2, 4] as const;

type AnimationToolbarProps = {
    tabId: string;
};

export function AnimationToolbar({ tabId }: Readonly<AnimationToolbarProps>) {
    const tab = useAnimationStore((s) => s.tabs[tabId]);
    const {
        play,
        pause,
        replay,
        stop,
        stepForward,
        stepBackward,
        seekTo,
        setSpeed,
    } = useAnimationStore.getState();

    const barRef = useRef<HTMLDivElement>(null);
    const [tooltipState, setTooltipState] = useState<{
        step: number;
        x: number;
    } | null>(null);
    const stepInputRef = useRef<HTMLInputElement>(null);
    const [isEditingStep, setIsEditingStep] = useState(false);
    const [editStepValue, setEditStepValue] = useState('');

    useEffect(() => {
        if (isEditingStep) stepInputRef.current?.select();
    }, [isEditingStep]);

    const prevTabStatusRef = useRef<string | undefined>(undefined);
    if (prevTabStatusRef.current !== tab?.status) {
        prevTabStatusRef.current = tab?.status;
        if (tab?.status === 'playing') setIsEditingStep(false);
    }

    const totalSteps = tab?.animation?.steps.length ?? 0;
    const current = (tab?.currentStepIndex ?? 0) + 1;

    const getStepFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = barRef.current?.getBoundingClientRect();
        if (!rect || totalSteps === 0) return null;
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        return Math.max(1, Math.min(totalSteps, Math.round(ratio * totalSteps)));
    };

    const handleBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const step = getStepFromEvent(e);
        const rect = barRef.current?.getBoundingClientRect();
        if (step === null || !rect) return;
        setTooltipState({ step, x: e.clientX - rect.left });
    };

    const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isEditingStep) return;
        const step = getStepFromEvent(e);
        if (step !== null) seekTo(tabId, step - 1);
    };

    const startStepEdit = () => {
        setEditStepValue(String(current));
        setIsEditingStep(true);
    };

    const commitStepEdit = () => {
        const parsed = Number.parseInt(editStepValue, 10);
        if (!Number.isNaN(parsed)) {
            seekTo(tabId, Math.max(1, Math.min(totalSteps, parsed)) - 1);
        }
        setIsEditingStep(false);
    };

    const handleStepKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') commitStepEdit();
        if (e.key === 'Escape') setIsEditingStep(false);
    };

    if (!tab || tab.status === 'idle') return null;

    const isPlaying = tab.status === 'playing';
    const isFinished = tab.status === 'finished';

    let playPauseLabel: string;
    let playPauseIcon: React.ReactNode;
    if (isFinished) {
        playPauseLabel = 'Replay';
        playPauseIcon = <AppIcons.AnimReplay />;
    } else if (isPlaying) {
        playPauseLabel = 'Pause';
        playPauseIcon = <AppIcons.AnimPause />;
    } else {
        playPauseLabel = 'Play';
        playPauseIcon = <AppIcons.AnimPlay />;
    }

    return (
        <div className="flex items-center w-full bg-base-200 rounded-lg border border-base-300 shadow-xl/45 p-1 gap-0.5 select-none">
            <div className="tooltip tooltip-top" data-tip="Step back">
                <button
                    type="button"
                    className="btn btn-sm btn-ghost hover:btn-accent"
                    onClick={() => {
                        stepBackward(tabId);
                    }}
                    disabled={tab.currentStepIndex === 0}
                    aria-label="Step backward"
                >
                    <span className="text-base leading-none">
                        <AppIcons.AnimBackward />
                    </span>
                </button>
            </div>

            <div className="tooltip tooltip-top" data-tip={playPauseLabel}>
                <button
                    type="button"
                    className="btn btn-sm btn-ghost hover:btn-accent"
                    onClick={() => {
                        if (isFinished) {
                            replay(tabId);
                        } else if (isPlaying) {
                            pause(tabId);
                        } else {
                            play(tabId);
                        }
                    }}
                    aria-label={playPauseLabel}
                >
                    <span className="text-base leading-none">{playPauseIcon}</span>
                </button>
            </div>

            <div className="tooltip tooltip-top" data-tip="Stop">
                <button
                    type="button"
                    className="btn btn-sm btn-ghost hover:btn-error"
                    onClick={() => {
                        stop(tabId);
                    }}
                    aria-label="Stop animation"
                >
                    <span className="text-base leading-none">
                        <AppIcons.AnimStop />
                    </span>
                </button>
            </div>

            <div className="tooltip tooltip-top" data-tip="Step forward">
                <button
                    type="button"
                    className="btn btn-sm btn-ghost hover:btn-accent"
                    onClick={() => {
                        stepForward(tabId);
                    }}
                    disabled={isFinished}
                    aria-label="Step forward"
                >
                    <span className="text-base leading-none">
                        <AppIcons.AnimForward />
                    </span>
                </button>
            </div>

            <div className="divider divider-horizontal mx-0.5" />

            <select
                className="select select-xs w-auto bg-base-200 border-none focus:outline-none"
                value={String(tab.speed)}
                onChange={(e) => {
                    setSpeed(tabId, Number(e.target.value));
                }}
                aria-label="Playback speed"
            >
                {SPEEDS.map((s) => (
                    <option key={s} value={String(s)}>
                        {s}×
                    </option>
                ))}
            </select>

            <div className="divider divider-horizontal mx-0.5" />

            <div
                ref={barRef}
                role="slider"
                tabIndex={0}
                aria-label="Animation progress"
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-valuenow={current}
                className="relative flex-1 min-w-0 self-center h-2 bg-base-300 rounded-full cursor-pointer mx-2"
                onMouseMove={handleBarMouseMove}
                onMouseLeave={() => {
                    setTooltipState(null);
                }}
                onClick={handleBarClick}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        stepForward(tabId);
                    } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        stepBackward(tabId);
                    }
                }}
            >
                <div
                    className="absolute inset-y-0 left-0 bg-accent rounded-full pointer-events-none"
                    style={{
                        width:
                            totalSteps > 0
                                ? `${((current / totalSteps) * 100).toFixed(2)}%`
                                : '0%',
                    }}
                />
                {tooltipState !== null && (
                    <div
                        key={tooltipState.step}
                        className="absolute -top-8 text-xs bg-base-300 border border-base-content/10 px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 animate-tooltip-in"
                        style={{ left: tooltipState.x }}
                    >
                        Step {tooltipState.step}
                    </div>
                )}
            </div>

            <div className="divider divider-horizontal mx-0.5" />

            {isEditingStep ? (
                <input
                    ref={stepInputRef}
                    type="text"
                    inputMode="numeric"
                    className="input input-xs w-14 text-center tabular-nums"
                    value={editStepValue}
                    max={totalSteps}
                    onChange={(e) => {
                        setEditStepValue(e.target.value.replace(/\D/g, ''));
                    }}
                    onBlur={commitStepEdit}
                    onKeyDown={handleStepKeyDown}
                    aria-label="Set step"
                />
            ) : (
                <button
                    type="button"
                    className="text-xs text-base-content/70 min-w-14 text-center tabular-nums hover:text-base-content cursor-text bg-transparent border-none p-0"
                    onClick={startStepEdit}
                    aria-label="Edit step"
                    title="Click to seek to step"
                >
                    {current} / {totalSteps}
                </button>
            )}
        </div>
    );
}
