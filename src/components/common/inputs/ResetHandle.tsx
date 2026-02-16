import { AppIcons } from '../AppIcons';

export function ResetHandle({ onClick }: ResetHandleProps) {
    return (
        <button
            className={`text-normal ${highlightStyle} opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1`}
            onClick={onClick}
            title="Reset to default"
            type="button"
        >
            <span className="text-xs hidden md:inline">Clear</span>
            <AppIcons.CloseCircle size="1.2em" />
        </button>
    );
}

const highlightStyle = 'hover:text-accent focus:text-accent';

type ResetHandleProps = {
    onClick: (e: React.MouseEvent) => void;
};
