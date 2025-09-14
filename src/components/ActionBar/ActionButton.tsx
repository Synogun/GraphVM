import { type ReactNode } from 'react';

function ActionButton({ label, icon, onClick, condensed = false, margin = 'my-1', disabled = false, isDelete = false }: ActionButtonProps) {
    const classStyle = isDelete
        ? 'btn-error'
        : 'btn-outline hover:btn-accent focus:btn-accent';
    
    return (
        <button
            className={ `btn ${classStyle} ${margin}` }
            disabled={ disabled }
            onClick={ onClick }
        >
            {icon ? <span>{icon}</span> : null}
            {!condensed ? label : null}
        </button>
    );
}

export default ActionButton;

// ---------- Type Definitions ----------

type ActionButtonProps = {
    label: string;
    isDelete?: boolean;
    icon?: ReactNode;
    onClick?: () => void;
    margin?: string;
    condensed?: boolean;
    disabled?: boolean;
};
