import type { ReactNode } from 'react';
import { AppIcons } from '../AppIcons';

export function HelpTooltip({ icon, content }: HelpTooltipProps) {
    if (!content) {
        return null;
    }

    return (
        <div
            className="tooltip tooltip-right z-50 cursor-help before:max-w-48 before:whitespace-normal before:h-auto"
            data-tip={typeof content === 'string' ? content : undefined}
        >
            {icon ?? <AppIcons.Help size="1em" className="hover:text-accent" />}
            {typeof content !== 'string' && (
                <div className="tooltip-content w-48 whitespace-normal text-left">
                    {content}
                </div>
            )}
        </div>
    );
}

type HelpTooltipProps = {
    icon?: ReactNode;
    content: ReactNode;
};
