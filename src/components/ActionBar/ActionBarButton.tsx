import type { ReactNode } from 'react';

export const ActionBarButtonStyle = 'btn-outline hover:btn-accent focus:btn-accent';
export const ActionBarTooltipClassName =
    'tooltip tooltip-right block w-full [&::before]:delay-500 [&::after]:delay-500 [&::before]:whitespace-pre-line';

export function ActionBarButton({
    id,
    label,
    icon,
    onClick,
    condensed = false,
    disabled = false,
    isDelete = false,
    className = '',
    tooltipSuffix,
}: Readonly<ActionBarButtonProps>) {
    const classStyle = isDelete ? 'btn-error' : ActionBarButtonStyle;

    const button = (
        <button
            id={id}
            className={`btn w-full ${classStyle} ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {icon ? <span>{icon}</span> : null}
            {condensed ? null : <span>{label}</span>}
        </button>
    );

    if (condensed) {
        return (
            <div className={ActionBarTooltipClassName} data-tip={tooltipSuffix ? `${label}\n(${tooltipSuffix})` : label}>
                {button}
            </div>
        );
    }

    return button;
}

type ActionBarButtonProps = {
    id?: string;
    label: string;
    isDelete?: boolean;
    icon?: ReactNode;
    onClick?: () => void;
    condensed?: boolean;
    disabled?: boolean;
    className?: string;
    tooltipSuffix?: string;
};
