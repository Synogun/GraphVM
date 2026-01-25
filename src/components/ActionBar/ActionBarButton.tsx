import type { ReactNode } from 'react';

export function ActionBarButton({
    label,
    icon,
    onClick,
    condensed = false,
    margin = 'my-1',
    disabled = false,
    isDelete = false,
}: ActionBarButtonProps) {
    const classStyle = isDelete ? 'btn-error' : 'btn-outline hover:btn-accent focus:btn-accent';

    return (
        <button className={`btn ${classStyle} ${margin}`} disabled={disabled} onClick={onClick}>
            {icon ? <span>{icon}</span> : null}
            {!condensed ? label : null}
        </button>
    );
}

type ActionBarButtonProps = {
    label: string;
    isDelete?: boolean;
    icon?: ReactNode;
    onClick?: () => void;
    margin?: string;
    condensed?: boolean;
    disabled?: boolean;
};
