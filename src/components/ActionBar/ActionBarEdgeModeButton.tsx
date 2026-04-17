import type { ChangeEvent } from 'react';
import { AppIcons } from '../common/AppIcons';

export function ActionBarEdgeModeButton({
    id,
    isCompleteEdgeMode = false,
    handleToggleEdgeMode = () => {
        /* empty */
    },
    iconSize = '1.5em',
    className = '',
    disabled = false,
}: Readonly<ActionBarEdgeModeButtonProps>) {
    const colorIfComplete = isCompleteEdgeMode ? 'btn-accent' : 'btn-outline';
    const activeColor = disabled ? 'btn-disabled' : colorIfComplete;

    const swapStyle = 'flex mx-auto text-center gap-2';

    return (
        <label
            id={id ? `${id}-label` : undefined}
            className={`btn ${activeColor} hover:btn-accent swap hover:swap-rotate my-1 ${className}`}
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
                {AppIcons.PathEdgeMode({ size: iconSize })} Path Mode
            </div>
            <div className={`swap-on ${swapStyle}`}>
                {AppIcons.CompleteEdgeMode({ size: iconSize })} Complete Mode
            </div>
        </label>
    );
}

type ActionBarEdgeModeButtonProps = {
    id?: string;
    isCompleteEdgeMode?: boolean;
    handleToggleEdgeMode?: (e: ChangeEvent<HTMLInputElement>) => void;
    iconSize?: string | number;
    className?: string;
    disabled?: boolean;
};
