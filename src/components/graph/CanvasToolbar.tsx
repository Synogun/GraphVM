import { useCanvasToolbar } from '@/hooks/useCanvasToolbar';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { AppIcons } from '../common/AppIcons';

const ICON_SIZE = '1em';
const DIGITS_ONLY = /\D/g;

export function CanvasToolbar() {
    const {
        handleArrangeGraph,
        handleCenterGraph,
        handleZoomIn,
        handleZoomOut,
        handleZoomTo,
        zoomPercent,
    } = useCanvasToolbar();

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.select();
        }
    }, [isEditing]);

    const startEdit = () => {
        setEditValue(String(zoomPercent));
        setIsEditing(true);
    };

    const commitEdit = () => {
        const parsed = Number.parseInt(editValue.replace(DIGITS_ONLY, ''), 10);
        if (!Number.isNaN(parsed)) {
            handleZoomTo(parsed);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') commitEdit();
        if (e.key === 'Escape') setIsEditing(false);
    };

    return (
        <div className="flex items-center bg-base-200 rounded-lg border border-base-300 shadow-xl/45 p-1 gap-0.5 select-none">
            <div className="tooltip tooltip-top" data-tip="Arrange">
                <button
                    className="btn btn-sm btn-ghost hover:btn-accent"
                    onClick={handleArrangeGraph}
                    type="button"
                    aria-label="Arrange graph"
                >
                    <AppIcons.Arrange size={ICON_SIZE} />
                </button>
            </div>

            <div className="divider divider-horizontal mx-0.5" />

            <div className="tooltip tooltip-top" data-tip="Zoom out">
                <button
                    className="btn btn-sm btn-ghost hover:btn-accent"
                    onClick={handleZoomOut}
                    type="button"
                    aria-label="Zoom out"
                >
                    <span className="text-base leading-none">−</span>
                </button>
            </div>

            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    className="input input-xs w-14 text-center tabular-nums"
                    value={editValue}
                    onChange={(e) => {
                        setEditValue(e.target.value.replace(DIGITS_ONLY, ''));
                    }}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    aria-label="Set zoom percentage"
                />
            ) : (
                <button
                    type="button"
                    className="text-sm text-base-content/70 min-w-14 text-center tabular-nums hover:text-base-content cursor-text bg-transparent border-none p-0"
                    onClick={startEdit}
                    aria-label="Edit zoom percentage"
                    title="Click to set zoom"
                >
                    {zoomPercent}%
                </button>
            )}

            <div className="tooltip tooltip-top" data-tip="Zoom in">
                <button
                    className="btn btn-sm btn-ghost hover:btn-accent"
                    onClick={handleZoomIn}
                    type="button"
                    aria-label="Zoom in"
                >
                    <span className="text-base leading-none">+</span>
                </button>
            </div>

            <div className="tooltip tooltip-top" data-tip="Fit to view">
                <button
                    className="btn btn-sm btn-ghost hover:btn-accent"
                    onClick={handleCenterGraph}
                    type="button"
                    aria-label="Fit graph to view"
                >
                    <AppIcons.Center size={ICON_SIZE} />
                </button>
            </div>
        </div>
    );
}
