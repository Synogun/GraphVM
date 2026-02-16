import { type ChangeEvent, type ReactNode } from 'react';
import { FieldWrapper } from './FieldWrapper';

function TextInput({
    label,
    value,
    onChange,
    className = '',
    tooltip,
    defaultValue,
    allowClear = true,
}: TextInputProps) {
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
            <input
                className={`p-1 border rounded input ${highlightStyle} ${className}`}
                onChange={onChange}
                type="text"
                value={value}
            />
        </FieldWrapper>
    );
}

const highlightStyle = 'hover:input-accent focus:input-accent';

type TextInputProps = {
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

export default TextInput;
