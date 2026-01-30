import type { ChangeEvent } from 'react';
import { AppIcons } from '../common/AppIcons';

export function ActionBarEdgeModeButton({
    isCompleteEdgeMode = false,
    handleToggleEdgeMode = () => {
        /* empty */
    },
    iconSize = '1.5em',
    className = '',
}: ActionBarEdgeModeButtonProps) {
    const activeColor = isCompleteEdgeMode ? 'btn-accent' : 'btn-outline';
    const swapStyle = 'flex mx-auto text-center gap-2';

    return (
        <label
            className={`btn ${activeColor} hover:btn-accent swap hover:swap-rotate my-1 ${className}`}
        >
            <input
                checked={isCompleteEdgeMode}
                onChange={handleToggleEdgeMode}
                type="checkbox"
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
    isCompleteEdgeMode?: boolean;
    handleToggleEdgeMode?: (e: ChangeEvent<HTMLInputElement>) => void;
    iconSize?: string | number;
    className?: string;
};
