import type { ChangeEvent } from 'react';
import { AppIcons } from '../common/AppIcons';
import { ActionBarTooltipClassName } from './ActionBarButton';

export function ActionBarEdgeModeButton({
    id,
    isCompleteEdgeMode = false,
    handleToggleEdgeMode = () => {
        /* empty */
    },
    iconSize = '1.5em',
    className = '',
    disabled = false,
    condensed = false,
}: Readonly<ActionBarEdgeModeButtonProps>) {
    const colorIfComplete = isCompleteEdgeMode ? 'btn-accent' : 'btn-outline';
    const activeColor = disabled ? 'btn-disabled' : colorIfComplete;

    const swapStyle = 'flex mx-auto text-center gap-2';
    const tooltipLabel = isCompleteEdgeMode
        ? 'Edge Insertion Mode\nComplete Mode'
        : 'Edge Insertion Mode\nPath Mode';

    const button = (
        <label
            id={id ? `${id}-label` : undefined}
            className={`btn w-full ${activeColor} hover:btn-accent swap hover:swap-rotate my-1 ${className}`}
            aria-disabled={disabled}
        >
            <input
                id={id ? `${id}-input` : undefined}
                checked={isCompleteEdgeMode}
                onChange={handleToggleEdgeMode}
                type="checkbox"
                disabled={disabled}
            />
            <div className={`swap-off ${swapStyle}`}>
                {AppIcons.PathEdgeMode({ size: iconSize })}
                {condensed ? null : ' Path Mode'}
            </div>
            <div className={`swap-on ${swapStyle}`}>
                {AppIcons.CompleteEdgeMode({ size: iconSize })}
                {condensed ? null : ' Complete Mode'}
            </div>
        </label>
    );

    if (condensed) {
        return (
            <div
                className={`${ActionBarTooltipClassName} [&::before]:whitespace-pre-line [&::before]:text-center [&::after]:whitespace-pre-line [&::after]:text-center`}
                data-tip={tooltipLabel}
            >
                {button}
            </div>
        );
    }

    return button;
}

type ActionBarEdgeModeButtonProps = {
    id?: string;
    isCompleteEdgeMode?: boolean;
    handleToggleEdgeMode?: (e: ChangeEvent<HTMLInputElement>) => void;
    iconSize?: string | number;
    className?: string;
    disabled?: boolean;
    condensed?: boolean;
};
