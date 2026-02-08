import { type ChangeEvent, type ReactNode } from 'react';
import { FieldWrapper } from './FieldWrapper';

function SelectInput({
    value,
    options,
    label,
    selectTitle,
    onChange,
    className = '',
    tooltip,
    defaultValue,
    allowClear = true,
}: SelectInputProps) {
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

    const selectTitleOption = (
        <option
            key={
                selectTitle
                    ? `${selectTitle.replace(' ', '-')}-type-dropdown-title`
                    : 'no-title-type-dropdown-title'
            }
            disabled={true}
        >
            {selectTitle}
        </option>
    );

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
            >
                {selectTitle && selectTitleOption}

                {options.map((option) => (
                    <option
                        key={option.label.replace(' ', '-') + '-' + option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </FieldWrapper>
    );
}

type SelectInputProps = {
    label: string;
    selectTitle?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    className?: string;
    tooltip?: {
        icon?: ReactNode;
        content: ReactNode;
    };
    defaultValue?: string;
    allowClear?: boolean;
};

export default SelectInput;
