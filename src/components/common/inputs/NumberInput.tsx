import { type ChangeEvent, type ReactNode } from 'react';
import { FieldWrapper } from './FieldWrapper';

export function NumberInput({
    label,
    value,
    onChange,
    max,
    min,
    step,
    className = '',
    tooltip,
    defaultValue,
    allowClear = true,
}: NumberInputProps) {
    const isModified =
        allowClear &&
        defaultValue !== undefined &&
        value !== undefined &&
        value !== defaultValue;

    const handleReset = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (defaultValue === undefined || !onChange) {
            return;
        }

        onChange({
            target: { value: String(defaultValue) },
        } as ChangeEvent<HTMLInputElement>);
    };

    return (
        <FieldWrapper
            label={label}
            onReset={handleReset}
            showReset={isModified}
            tooltip={tooltip}
        >
            <input
                className={`w-full input p-1 text-center ${highlightStyle} ${className}`}
                max={max}
                min={min}
                onChange={onChange}
                step={step}
                type="number"
                value={value}
            />
        </FieldWrapper>
    );
}

const highlightStyle = 'hover:input-accent focus:input-accent';
type NumberInputProps = {
    label: string;
    value?: number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    max?: number;
    min?: number;
    step?: number;
    className?: string;
    tooltip?: {
        icon?: ReactNode;
        content: ReactNode;
    };
    defaultValue?: number;
    allowClear?: boolean;
};
