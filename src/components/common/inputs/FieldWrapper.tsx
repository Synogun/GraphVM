import type { ReactNode } from 'react';
import { HelpTooltip } from './HelpTooltip';
import { ResetHandle } from './ResetHandle';

export type FieldWrapperProps = {
    label: string;
    children: ReactNode;
    tooltip?: {
        icon?: ReactNode;
        content: ReactNode;
    };
    onReset?: (e: React.MouseEvent) => void;
    showReset?: boolean;
    className?: string;
};

export function FieldWrapper({
    label,
    children: input,
    tooltip,
    onReset,
    showReset,
    className = '',
}: FieldWrapperProps) {
    return (
        <fieldset className={`fieldset group ${className}`}>
            <legend className="fieldset-legend w-full flex items-center justify-between">
                <span className="flex items-center gap-1">
                    {label}
                    {tooltip && (
                        <HelpTooltip content={tooltip.content} icon={tooltip.icon} />
                    )}
                </span>
                {showReset && onReset && <ResetHandle onClick={onReset} />}
            </legend>
            {input}
        </fieldset>
    );
}
