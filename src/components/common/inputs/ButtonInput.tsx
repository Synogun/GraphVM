import type { ReactNode } from 'react';
import { FieldWrapper, type FieldWrapperProps } from './FieldWrapper';

export function ButtonInput({
    label,
    onClick,
    children,
    tooltip,
    className = '',
    disabled = false,
}: Readonly<ButtonInputProps>) {
    return (
        <FieldWrapper label={label} tooltip={tooltip}>
            <button
                className={`btn btn-sm btn-outline w-full ${className}`}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        </FieldWrapper>
    );
}

type ButtonInputProps = {
    label: string;
    onClick: () => void;
    children: ReactNode;
    tooltip?: FieldWrapperProps['tooltip'];
    className?: string;
    disabled?: boolean;
};
