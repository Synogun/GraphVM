import type { ReactNode } from 'react';

export const ActionBarButtonStyle = 'btn-outline hover:btn-accent focus:btn-accent';

export function ActionBarButton({
    id,
    label,
    icon,
    onClick,
    condensed = false,
    margin = 'my-1',
    disabled = false,
    isDelete = false,
    className = '',
}: Readonly<ActionBarButtonProps>) {
    const classStyle = isDelete ? 'btn-error' : ActionBarButtonStyle;

    return (
        <button
            id={id}
            className={`btn ${classStyle} ${margin} ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {icon ? <span>{icon}</span> : null}
            {condensed ? null : <span>{label}</span>}
        </button>
    );
}

type ActionBarButtonProps = {
    id?: string;
    label: string;
    isDelete?: boolean;
    icon?: ReactNode;
    onClick?: () => void;
    margin?: string;
    condensed?: boolean;
    disabled?: boolean;
    className?: string;
};
