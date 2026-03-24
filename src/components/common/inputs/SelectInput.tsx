import { type ChangeEvent, type ReactNode } from 'react';
import { FieldWrapper } from './FieldWrapper';

export function SelectInput({
    value,
    options,
    label,
    onChange,
    className = '',
    tooltip,
    defaultValue,
    allowClear = true,
    disabled = false,
}: Readonly<SelectInputProps>) {
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
            target: { value: defaultValue },
        } as ChangeEvent<HTMLSelectElement>);
    };

    const makeOptionValue = ({ value, label, title: isTitle }: SelectOptionType) => {
        return (
            <option key={`${value}-option`} value={value} disabled={isTitle}>
                {label}
            </option>
        );
    };

    return (
        <FieldWrapper
            label={label}
            onReset={handleReset}
            showReset={isModified}
            tooltip={tooltip}
        >
            <select
                className={`select hover:select-accent focus:select-accent cursor-pointer w-full ${className}`}
                onChange={onChange}
                value={value}
                disabled={disabled}
            >
                {options.map(makeOptionValue)}
            </select>
        </FieldWrapper>
    );
}

type SelectOptionType = {
    label: string;
    value: string;
    title?: boolean;
};

type SelectInputProps = {
    label: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOptionType[];
    className?: string;
    tooltip?: {
        icon?: ReactNode;
        content: ReactNode;
    };
    defaultValue?: string;
    allowClear?: boolean;
    disabled?: boolean;
};
