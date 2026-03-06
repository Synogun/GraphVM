import { type ChangeEvent, type ReactNode } from 'react';
import { AppIcons } from '../AppIcons';
import { FieldWrapper } from './FieldWrapper';

export function ColorInput({
    label,
    value,
    onChange,
    className = '',
    tooltip,
    defaultValue,
    allowClear = true,
}: ColorInputProps) {
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
        } as ChangeEvent<HTMLInputElement>);
    };

    return (
        <FieldWrapper
            label={label}
            onReset={handleReset}
            showReset={isModified}
            tooltip={tooltip}
        >
            <label
                className={`input ${highlightStyle} cursor-pointer flex items-center w-full`}
            >
                {paletteIcon}
                <input
                    className={`p-2 border-0 rounded bg-transparent cursor-pointer ${highlightStyle} ${className}`}
                    onChange={onChange}
                    type="color"
                    value={value}
                />
            </label>
        </FieldWrapper>
    );
}

const paletteIcon = <AppIcons.ColorPalette className="opacity-50" size="1.5em" />;
const highlightStyle = 'hover:input-accent focus:input-accent';

type ColorInputProps = {
    label: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    tooltip?: {
        icon?: ReactNode;
        content: ReactNode;
    };
    defaultValue?: string;
    allowClear?: boolean;
};
